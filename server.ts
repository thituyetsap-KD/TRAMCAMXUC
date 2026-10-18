import express from 'express';
import { createServer as createViteServer } from 'vite';

interface MediaRecord {
  fileId: string;
  type: 'audio' | 'image' | 'video';
  fileName: string;
  mimeType: string;
  data: Buffer;
  createdAt: string;
}

// In-memory media store for local playback and fallback Drive streaming
const mediaStore = new Map<string, MediaRecord>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support large base64 media uploads (audio, photos, videos up to 60MB)
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // Helper: Extract clean Base64 data from Data URL
  const extractCleanBase64 = (dataUrl?: string): string => {
    if (!dataUrl) return '';
    const commaIndex = dataUrl.indexOf(',');
    if (commaIndex !== -1) {
      return dataUrl.substring(commaIndex + 1);
    }
    return dataUrl;
  };

  // API Route: Upload and persist media locally
  app.post('/api/upload-media', (req, res) => {
    try {
      const { type, fileName, mimeType, base64 } = req.body;
      if (!base64) {
        return res.status(400).json({ success: false, message: 'Dữ liệu tệp trống.' });
      }

      const cleanB64 = extractCleanBase64(base64);
      const buffer = Buffer.from(cleanB64, 'base64');
      const fileId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const safeMime = mimeType || (type === 'audio' ? 'audio/webm' : type === 'video' ? 'video/mp4' : 'image/jpeg');
      const safeName = fileName || `file_${fileId}.${type === 'audio' ? 'webm' : type === 'video' ? 'mp4' : 'jpg'}`;

      mediaStore.set(fileId, {
        fileId,
        type: type || 'image',
        fileName: safeName,
        mimeType: safeMime,
        data: buffer,
        createdAt: new Date().toISOString(),
      });

      return res.json({
        success: true,
        fileId,
        fileName: safeName,
        mimeType: safeMime,
        size: buffer.length,
        viewUrl: `/api/media/${fileId}`,
        downloadUrl: `/api/media/${fileId}?download=true`,
      });
    } catch (err: any) {
      console.error('Error storing media:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // API Route: Stream and serve media files with full Range and audio/video seeking support
  app.get('/api/media/:fileId', (req, res) => {
    const { fileId } = req.params;
    const isDownload = req.query.download === 'true';
    const item = mediaStore.get(fileId);

    if (!item) {
      return res.status(404).send('Tệp đa phương tiện không tồn tại hoặc đã hết hạn phiên làm việc.');
    }

    const { data, mimeType, fileName } = item;
    const totalSize = data.length;

    if (isDownload) {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', totalSize);
      return res.send(data);
    }

    // Support HTTP Range requests for seeking in audio and video
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });

      return res.end(data.subarray(start, end + 1));
    }

    res.writeHead(200, {
      'Content-Length': totalSize,
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
    });
    return res.end(data);
  });

  // API Route: Proxy sync to Google Apps Script with detailed diagnostics & multi-format support
  app.post('/api/sync-gas', async (req, res) => {
    try {
      const { gasUrl, payload } = req.body;

      if (!gasUrl) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_URL',
          message: 'Chưa có đường dẫn Google Apps Script Web App.',
        });
      }

      // Pre-store media on local server so it is immediately playable
      if (payload) {
        if (payload.audioBase64 && !payload.audioFileId) {
          const cleanB64 = extractCleanBase64(payload.audioBase64);
          const fId = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          mediaStore.set(fId, {
            fileId: fId,
            type: 'audio',
            fileName: payload.audioFileName || `Ghi_am_${fId}.webm`,
            mimeType: payload.audioMimeType || 'audio/webm',
            data: Buffer.from(cleanB64, 'base64'),
            createdAt: new Date().toISOString(),
          });
          payload.localAudioUrl = `/api/media/${fId}`;
          payload.audioFileId = fId;
        }

        if ((payload.photoBase64 || payload.photoUrl) && !payload.photoFileId) {
          const raw = payload.photoBase64 || payload.photoUrl;
          if (raw && raw.startsWith('data:')) {
            const cleanB64 = extractCleanBase64(raw);
            const fId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            mediaStore.set(fId, {
              fileId: fId,
              type: 'image',
              fileName: payload.photoFileName || `Anh_${fId}.jpg`,
              mimeType: payload.photoMimeType || 'image/jpeg',
              data: Buffer.from(cleanB64, 'base64'),
              createdAt: new Date().toISOString(),
            });
            payload.localPhotoUrl = `/api/media/${fId}`;
            payload.photoFileId = fId;
          }
        }

        if (payload.videoBase64 && !payload.videoFileId) {
          const cleanB64 = extractCleanBase64(payload.videoBase64);
          const fId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          mediaStore.set(fId, {
            fileId: fId,
            type: 'video',
            fileName: payload.videoFileName || `Video_${fId}.mp4`,
            mimeType: payload.videoMimeType || 'video/mp4',
            data: Buffer.from(cleanB64, 'base64'),
            createdAt: new Date().toISOString(),
          });
          payload.localVideoUrl = `/api/media/${fId}`;
          payload.videoFileId = fId;
        }
      }

      // Call Google Apps Script following all 302 redirects
      let response;
      try {
        response = await fetch(gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: typeof payload === 'string' ? payload : JSON.stringify(payload),
          redirect: 'follow',
        });
      } catch (networkErr: any) {
        return res.json({
          success: false,
          error: 'NETWORK_ERROR',
          message: `Không thể kết nối đến URL Google Apps Script: ${networkErr.message}. Dữ liệu đã được lưu an toàn trên máy và sẵn sàng đồng bộ lại.`,
          localAudioUrl: payload?.localAudioUrl,
          localPhotoUrl: payload?.localPhotoUrl,
          localVideoUrl: payload?.localVideoUrl,
        });
      }

      const responseText = await response.text();

      // Check if Google returned an HTML login or access denied page
      if (
        responseText.trim().startsWith('<') ||
        responseText.includes('<!DOCTYPE') ||
        responseText.includes('ServiceLogin') ||
        responseText.includes('accounts.google.com') ||
        responseText.includes('ページが見つかりません')
      ) {
        const isNotFound = responseText.includes('ページが見つかりません') || responseText.includes('Page Not Found');
        return res.json({
          success: false,
          error: isNotFound ? 'GAS_NOT_FOUND' : 'GOOGLE_AUTH_RESTRICTED',
          message: isNotFound
            ? 'Đường dẫn Google Apps Script không tồn tại hoặc chưa được Triển khai (Deploy). Thầy cô hãy vào Apps Script > Triển khai > Quản lý bản triển khai để sao chép đúng URL Web App kết thúc bằng "/exec".'
            : 'Google Apps Script hiện đang bị hạn chế quyền truy cập ("Chỉ mình tôi"). Thầy cô cần vào phần Triển khai (Deploy) > Quản lý bản triển khai > Chuyển mục "Ai có quyền truy cập" (Who has access) thành "Bất kỳ ai" (Anyone).',
          rawResponse: responseText.slice(0, 300),
          localAudioUrl: payload?.localAudioUrl,
          localPhotoUrl: payload?.localPhotoUrl,
          localVideoUrl: payload?.localVideoUrl,
        });
      }

      // Try parsing JSON response from Google Apps Script
      try {
        const json = JSON.parse(responseText);
        if (json.status === 'error' || json.success === false) {
          return res.json({
            success: false,
            error: 'GAS_EXECUTION_ERROR',
            message: `Lỗi trong kịch bản Google Apps Script: ${json.message || 'Lỗi không xác định'}`,
            localAudioUrl: payload?.localAudioUrl,
            localPhotoUrl: payload?.localPhotoUrl,
            localVideoUrl: payload?.localVideoUrl,
          });
        }

        return res.json({
          success: true,
          audioFileId: json.audioFileId || payload?.audioFileId || '',
          audioDriveUrl: json.audioDriveUrl || json.linkGhiAmDrive || '',
          photoFileId: json.photoFileId || payload?.photoFileId || '',
          photoDriveUrl: json.photoDriveUrl || json.linkHinhAnhDrive || '',
          videoFileId: json.videoFileId || payload?.videoFileId || '',
          videoDriveUrl: json.videoDriveUrl || json.linkVideoDrive || '',
          hoSoFileId: json.hoSoFileId || '',
          hoSoDriveUrl: json.hoSoDriveUrl || '',
          rowNumber: json.rowNumber,
          localAudioUrl: payload?.localAudioUrl,
          localPhotoUrl: payload?.localPhotoUrl,
          localVideoUrl: payload?.localVideoUrl,
          message: 'Đồng bộ thành công và đã tạo tệp Drive.',
        });
      } catch (parseErr) {
        return res.json({
          success: false,
          error: 'INVALID_JSON_RESPONSE',
          message: 'Google Apps Script trả về nội dung không đúng định dạng JSON.',
          rawResponse: responseText.slice(0, 300),
          localAudioUrl: payload?.localAudioUrl,
          localPhotoUrl: payload?.localPhotoUrl,
          localVideoUrl: payload?.localVideoUrl,
        });
      }
    } catch (err: any) {
      console.error('Error proxying to GAS:', err);
      return res.status(500).json({
        success: false,
        error: 'NETWORK_ERROR',
        message: `Lỗi kết nối tới Google Apps Script: ${err.message}`,
      });
    }
  });

  // API Route: Test connection to Google Apps Script
  app.post('/api/test-gas', async (req, res) => {
    try {
      const { gasUrl } = req.body;
      if (!gasUrl) {
        return res.status(400).json({ success: false, message: 'Chưa cung cấp URL.' });
      }

      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'ping' }),
        redirect: 'follow',
      });

      const text = await response.text();
      if (text.includes('<!DOCTYPE') || text.includes('ServiceLogin')) {
        return res.json({
          success: false,
          error: 'GOOGLE_AUTH_RESTRICTED',
          message: 'Cần cấp quyền "Bất kỳ ai (Anyone)" trong phần Triển khai của Google Apps Script.',
        });
      }

      if (text.includes('ページが見つかりません') || text.includes('Page Not Found')) {
        return res.json({
          success: false,
          error: 'GAS_NOT_FOUND',
          message: 'Không tìm thấy trang Web App. Vui lòng kiểm tra lại URL triển khai mới nhất.',
        });
      }

      return res.json({
        success: true,
        message: 'Kết nối thành công tới Google Apps Script!',
        responsePreview: text.slice(0, 150),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Mount Vite development middlewares
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Application server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
