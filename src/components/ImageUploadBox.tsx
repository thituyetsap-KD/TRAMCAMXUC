import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, RotateCcw, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

interface ImageUploadBoxProps {
  onImageReady: (imageUrl: string) => void;
  onClearImage?: () => void;
}

export const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({ onImageReady, onClearImage }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Strip EXIF metadata by re-encoding through HTML5 Canvas
  const processAndStripExif = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Limit max resolution for school privacy and speed
      const maxDim = 1200;
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
        // Stripped pure jpeg data URL without EXIF GPS or camera metadata
        const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImagePreview(cleanDataUrl);
        onImageReady(cleanDataUrl);
      }
    };
    img.src = dataUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh (jpg, png, webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        processAndStripExif(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Thiết bị không hỗ trợ máy ảnh trực tiếp.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError('Chưa thể mở máy ảnh. Em hãy kiểm tra xem đã cấp quyền máy ảnh chưa nhé!');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopCamera();
        processAndStripExif(dataUrl);
      }
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClearImage) {
      onClearImage();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-purple-100 flex flex-col items-center max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl md:text-2xl font-black text-purple-900 text-center">Góc Gửi Hình Ảnh</h3>
      </div>
      <p className="text-sm md:text-base text-slate-600 text-center mb-4 max-w-md">
        Em có thể chia sẻ bức tranh em vẽ, góc học tập hoặc hình ảnh diễn tả tâm trạng của mình.
      </p>

      {/* Safety Notice Banner */}
      <div className="w-full bg-purple-50/70 border border-purple-200 rounded-2xl p-3.5 mb-6 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm text-purple-900 leading-relaxed">
          <strong>Lưu ý an toàn cho bạn nhỏ:</strong> Không gửi ảnh riêng tư, địa chỉ nhà, giấy tờ cá nhân hay ảnh chụp người khác khi chưa được bạn đồng ý. Hệ thống sẽ tự động bảo vệ quyền riêng tư của em.
        </div>
      </div>

      {cameraError && (
        <div className="w-full bg-amber-50 border border-amber-300 rounded-2xl p-3.5 mb-4 flex items-center gap-2 text-amber-800 text-xs md:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Camera Live Feed View */}
      {isCameraActive && (
        <div className="relative w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden mb-6 flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-4 flex items-center gap-3">
            <button
              onClick={capturePhoto}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 text-sm flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Chụp ảnh này
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2.5 bg-slate-700/80 hover:bg-slate-800 text-white font-bold rounded-2xl transition-transform active:scale-95 text-sm"
            >
              Đóng máy ảnh
            </button>
          </div>
        </div>
      )}

      {/* Preview selected/captured image */}
      {imagePreview && !isCameraActive && (
        <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-purple-200 mb-6 bg-slate-50 flex flex-col items-center">
          <img src={imagePreview} alt="Xem trước hình ảnh" className="w-full max-h-72 object-contain" />
          <div className="w-full bg-purple-50 p-3 flex items-center justify-between border-t border-purple-100">
            <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Đã sẵn sàng đính kèm
            </span>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa ảnh
            </button>
          </div>
        </div>
      )}

      {/* Buttons to select or capture */}
      {!imagePreview && !isCameraActive && (
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm md:text-base"
          >
            <ImageIcon className="w-5 h-5" />
            Chọn ảnh từ máy
          </button>
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm md:text-base"
          >
            <Camera className="w-5 h-5" />
            Chụp ảnh mới
          </button>
        </div>
      )}

      {imagePreview && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Hình ảnh sẽ được gửi cùng với lời nhắn của em đến thầy cô phụ trách.
        </p>
      )}
    </div>
  );
};
