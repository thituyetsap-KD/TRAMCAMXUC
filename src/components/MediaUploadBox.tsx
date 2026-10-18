import React, { useState, useRef } from 'react';
import {
  Camera,
  Video,
  Image as ImageIcon,
  Trash2,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Play,
  Square,
  Circle,
  RefreshCw,
} from 'lucide-react';

interface MediaUploadBoxProps {
  onPhotoReady: (dataUrl: string, fileName?: string, mimeType?: string) => void;
  onVideoReady?: (dataUrl: string, durationSec?: number, fileName?: string, mimeType?: string) => void;
  onClearMedia?: () => void;
}

export const MediaUploadBox: React.FC<MediaUploadBoxProps> = ({
  onPhotoReady,
  onVideoReady,
  onClearMedia,
}) => {
  const [activeMediaKind, setActiveMediaKind] = useState<'photo' | 'video'>('photo');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const filePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const fileVideoInputRef = useRef<HTMLInputElement | null>(null);
  const videoStreamRef = useRef<HTMLVideoElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Strip EXIF metadata by re-encoding through HTML5 Canvas
  const processAndStripExif = (dataUrl: string, originalName?: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 1280;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoPreview(cleanDataUrl);
        setVideoPreview(null);
        onPhotoReady(cleanDataUrl, originalName || 'Hinh_anh.jpg', 'image/jpeg');
      }
    };
    img.src = dataUrl;
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh (jpg, png, webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        processAndStripExif(event.target.result as string, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Vui lòng chọn một tệp video (mp4, webm, mov).');
      return;
    }

    // Limit video file size to 25MB for smooth upload
    if (file.size > 25 * 1024 * 1024) {
      alert('Tệp video quá lớn (trên 25MB). Bạn nhỏ hãy chọn video ngắn hơn hoặc dưới 25MB nhé!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setVideoPreview(base64);
        setPhotoPreview(null);
        if (onVideoReady) {
          onVideoReady(base64, 15, file.name, file.type || 'video/mp4');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async (forVideo = false) => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Thiết bị không hỗ trợ máy ảnh trực tiếp.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: forVideo,
      });
      activeStreamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoStreamRef.current) {
          videoStreamRef.current.srcObject = stream;
          videoStreamRef.current.play();
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError('Chưa thể mở máy ảnh. Em hãy kiểm tra xem đã cấp quyền máy ảnh chưa nhé!');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsCameraActive(false);
    setIsRecordingVideo(false);
  };

  const capturePhoto = () => {
    if (videoStreamRef.current) {
      const video = videoStreamRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopCamera();
        processAndStripExif(dataUrl, 'Chup_anh.jpg');
      }
    }
  };

  const startVideoRecording = () => {
    if (!activeStreamRef.current) return;
    videoChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const recorder = new MediaRecorder(activeStreamRef.current);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setVideoPreview(base64);
          setPhotoPreview(null);
          if (onVideoReady) {
            onVideoReady(base64, recordingSeconds, 'Quay_video.webm', 'video/webm');
          }
        };
        reader.readAsDataURL(videoBlob);
        stopCamera();
      };

      recorder.start(250);
      setIsRecordingVideo(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopVideoRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Không thể ghi video trên thiết bị này.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecordingVideo(false);
    }
  };

  const handleClear = () => {
    setPhotoPreview(null);
    setVideoPreview(null);
    stopCamera();
    if (filePhotoInputRef.current) filePhotoInputRef.current.value = '';
    if (fileVideoInputRef.current) fileVideoInputRef.current.value = '';
    if (onClearMedia) onClearMedia();
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-purple-100 flex flex-col items-center max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl md:text-2xl font-black text-purple-900 text-center">
          Góc Gửi Hình Ảnh & Video
        </h3>
      </div>
      <p className="text-sm text-slate-600 text-center mb-4 max-w-md">
        Em có thể chia sẻ tranh vẽ, góc học tập hoặc một đoạn video ngắn diễn tả tâm trạng của mình.
      </p>

      {/* Safety Notice Banner */}
      <div className="w-full bg-purple-50/70 border border-purple-200 rounded-2xl p-3.5 mb-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-900 leading-relaxed">
          <strong>Lưu ý an toàn:</strong> Không gửi ảnh/video riêng tư, địa chỉ nhà hay thông tin cá nhân của người khác khi chưa được phép. Tệp sẽ được chuyển vào Google Drive bảo mật của nhà trường.
        </div>
      </div>

      {cameraError && (
        <div className="w-full bg-amber-50 border border-amber-300 rounded-2xl p-3.5 mb-4 flex items-center gap-2 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Media Type Switcher (Ảnh / Video) */}
      {!photoPreview && !videoPreview && !isCameraActive && (
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMediaKind('photo')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeMediaKind === 'photo' ? 'bg-white text-purple-800 shadow-xs font-black' : 'text-slate-600'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Hình ảnh
          </button>
          <button
            type="button"
            onClick={() => setActiveMediaKind('video')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeMediaKind === 'video' ? 'bg-white text-purple-800 shadow-xs font-black' : 'text-slate-600'
            }`}
          >
            <Video className="w-4 h-4" /> Video ngắn
          </button>
        </div>
      )}

      {/* Live Camera View */}
      {isCameraActive && (
        <div className="relative w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden mb-6 flex flex-col items-center justify-center">
          <video ref={videoStreamRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          
          {isRecordingVideo && (
            <div className="absolute top-3 left-3 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <Circle className="w-2.5 h-2.5 fill-white" /> Đang quay {recordingSeconds}s
            </div>
          )}

          <div className="absolute bottom-4 flex items-center gap-3">
            {activeMediaKind === 'photo' ? (
              <button
                onClick={capturePhoto}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 text-sm flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Chụp ảnh này
              </button>
            ) : isRecordingVideo ? (
              <button
                onClick={stopVideoRecording}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 text-sm flex items-center gap-2"
              >
                <Square className="w-4 h-4 fill-white" />
                Dừng quay video ({recordingSeconds}s)
              </button>
            ) : (
              <button
                onClick={startVideoRecording}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 text-sm flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Bắt đầu quay video
              </button>
            )}

            <button
              onClick={stopCamera}
              className="px-4 py-2.5 bg-slate-700/80 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm"
            >
              Đóng máy ảnh
            </button>
          </div>
        </div>
      )}

      {/* Preview Photo */}
      {photoPreview && !isCameraActive && (
        <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-purple-200 mb-5 bg-slate-50 flex flex-col items-center">
          <img src={photoPreview} alt="Xem trước hình ảnh" className="w-full max-h-72 object-contain" />
          <div className="w-full bg-purple-50 p-3 flex items-center justify-between border-t border-purple-100">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Đã sẵn sàng gửi kèm ảnh
            </span>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
          </div>
        </div>
      )}

      {/* Preview Video */}
      {videoPreview && !isCameraActive && (
        <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-purple-200 mb-5 bg-slate-900 flex flex-col items-center">
          <video src={videoPreview} controls className="w-full max-h-72 object-contain" />
          <div className="w-full bg-purple-50 p-3 flex items-center justify-between border-t border-purple-100">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Đã sẵn sàng gửi kèm video
            </span>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!photoPreview && !videoPreview && !isCameraActive && (
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          {activeMediaKind === 'photo' ? (
            <>
              <input
                type="file"
                ref={filePhotoInputRef}
                onChange={handlePhotoFileChange}
                accept="image/*,.jpg,.jpeg,.png,.webp"
                className="hidden"
              />
              <button
                onClick={() => filePhotoInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
              >
                <ImageIcon className="w-5 h-5" />
                Chọn ảnh từ thiết bị
              </button>
              <button
                onClick={() => startCamera(false)}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
              >
                <Camera className="w-5 h-5" />
                Chụp ảnh mới
              </button>
            </>
          ) : (
            <>
              <input
                type="file"
                ref={fileVideoInputRef}
                onChange={handleVideoFileChange}
                accept="video/*,.mp4,.webm,.mov"
                className="hidden"
              />
              <button
                onClick={() => fileVideoInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
              >
                <Video className="w-5 h-5" />
                Chọn video từ máy
              </button>
              <button
                onClick={() => startCamera(true)}
                className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
              >
                <Camera className="w-5 h-5" />
                Quay video bằng camera
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
