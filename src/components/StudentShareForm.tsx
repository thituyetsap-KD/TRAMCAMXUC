import React, { useState } from 'react';
import { EmotionType, TopicType, SupportLevel } from '../types';
import { EMOTIONS, TOPICS, SUPPORT_LEVELS, STICKERS } from '../constants/emotions';
import { AudioRecorder } from './AudioRecorder';
import { MediaUploadBox } from './MediaUploadBox';
import {
  HappySunIcon,
  SadDropletIcon,
  AnxiousCloudIcon,
  AngryPeachIcon,
  SpeechlessBeanIcon,
  LogoStationHeart,
} from './EmotionIllustrations';
import {
  Mic,
  Image as ImageIcon,
  Send,
  RotateCcw,
  Sparkles,
  UserCheck,
  UserX,
  Volume2,
  Video,
  Trash2,
} from 'lucide-react';

interface StudentShareFormProps {
  initialEmotion?: EmotionType;
  initialMode?: 'all' | 'audio' | 'text' | 'image';
  onSubmitSuccess: () => void;
  onSaveSubmission: (data: {
    emotion: EmotionType;
    topic: TopicType;
    supportLevel: SupportLevel;
    textMessage: string;
    studentName: string;
    studentClass: string;
    isAnonymous: boolean;
    sticker?: string;
    audioBase64?: string;
    audioDuration?: number;
    audioFileName?: string;
    audioMimeType?: string;
    photoUrl?: string;
    photoBase64?: string;
    photoFileName?: string;
    photoMimeType?: string;
    videoBase64?: string;
    videoDuration?: number;
    videoFileName?: string;
    videoMimeType?: string;
  }) => Promise<void>;
}

export const StudentShareForm: React.FC<StudentShareFormProps> = ({
  initialEmotion = 'happy',
  initialMode = 'all',
  onSubmitSuccess,
  onSaveSubmission,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(initialEmotion);
  const [selectedTopic, setSelectedTopic] = useState<TopicType>('friends');
  const [supportLevel, setSupportLevel] = useState<SupportLevel>('share_only');
  const [textMessage, setTextMessage] = useState<string>('');
  const [selectedSticker, setSelectedSticker] = useState<string>('heart');
  const [studentName, setStudentName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('Lớp 3A');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  // Attached media state
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioMimeType, setAudioMimeType] = useState<string>('');

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [photoMimeType, setPhotoMimeType] = useState<string>('');

  const [videoBase64, setVideoBase64] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [videoMimeType, setVideoMimeType] = useState<string>('');

  // UI tabs
  const [activeTab, setActiveTab] = useState<'text' | 'audio' | 'photo'>(
    initialMode === 'audio' ? 'audio' : initialMode === 'image' ? 'photo' : 'text'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const promptSuggestions = [
    'Hôm nay có chuyện làm em vui hoặc buồn...',
    'Điều đang khiến em suy nghĩ nhiều nhất là...',
    'Em mong thầy cô có thể lắng nghe hoặc giúp em...',
    'Có điều này em chưa biết nói với ai ở lớp...',
  ];

  const handleAudioReady = (_blob: Blob, base64: string, durationSec: number, fileName?: string, mimeType?: string) => {
    setAudioBase64(base64);
    setAudioDuration(durationSec);
    if (fileName) setAudioFileName(fileName);
    if (mimeType) setAudioMimeType(mimeType);
  };

  const handlePhotoReady = (dataUrl: string, fileName?: string, mimeType?: string) => {
    setPhotoUrl(dataUrl);
    if (fileName) setPhotoFileName(fileName);
    if (mimeType) setPhotoMimeType(mimeType);
  };

  const handleVideoReady = (dataUrl: string, durationSec?: number, fileName?: string, mimeType?: string) => {
    setVideoBase64(dataUrl);
    setVideoDuration(durationSec || 0);
    if (fileName) setVideoFileName(fileName);
    if (mimeType) setVideoMimeType(mimeType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!textMessage.trim() && !audioBase64 && !photoUrl && !videoBase64) {
      alert('Em hãy viết vài lời nhắn hoặc ghi âm / chụp ảnh để gửi đến thầy cô nhé!');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitStep('Đang chuẩn bị tệp tin đa phương tiện...');

    try {
      if (audioBase64 || photoUrl || videoBase64) {
        setSubmitStep('Đang mã hóa và lưu tệp an toàn...');
      }
      setSubmitStep('Đang đồng bộ lên Google Drive và hệ thống...');

      await onSaveSubmission({
        emotion: selectedEmotion,
        topic: selectedTopic,
        supportLevel,
        textMessage: textMessage.trim(),
        studentName: isAnonymous ? 'Học sinh ẩn danh' : studentName.trim() || 'Học sinh',
        studentClass: studentClass.trim() || 'Tiểu học',
        isAnonymous,
        sticker: selectedSticker,
        audioBase64: audioBase64 || undefined,
        audioDuration: audioDuration || undefined,
        audioFileName: audioFileName || undefined,
        audioMimeType: audioMimeType || undefined,
        photoUrl: photoUrl || undefined,
        photoBase64: photoUrl || undefined,
        photoFileName: photoFileName || undefined,
        photoMimeType: photoMimeType || undefined,
        videoBase64: videoBase64 || undefined,
        videoDuration: videoDuration || undefined,
        videoFileName: videoFileName || undefined,
        videoMimeType: videoMimeType || undefined,
      });

      setSubmitStep('Hoàn tất!');
      onSubmitSuccess();
    } catch (err: any) {
      console.error(err);
      setSubmitError(err?.message || 'Có lỗi kết nối. Dữ liệu đã được lưu lại, em có thể thử gửi lại nhé!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEmotionIcon = (emotionKey: EmotionType, size = 'w-10 h-10') => {
    switch (emotionKey) {
      case 'happy':
        return <HappySunIcon className={size} />;
      case 'sad':
        return <SadDropletIcon className={size} />;
      case 'anxious':
        return <AnxiousCloudIcon className={size} />;
      case 'angry':
        return <AngryPeachIcon className={size} />;
      case 'speechless':
        return <SpeechlessBeanIcon className={size} />;
      default:
        return <LogoStationHeart className={size} />;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 md:p-8 shadow-xl border-2 border-pink-100 max-w-4xl mx-auto">
      {/* Step 1: Current Emotion Banner */}
      <div className="mb-6">
        <label className="block text-sm font-black text-slate-800 mb-2">
          1. Trái tim bạn đang cảm thấy thế nào hôm nay?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {(['happy', 'sad', 'anxious', 'angry', 'speechless', 'just_listen'] as EmotionType[]).map((emoKey) => {
            const emo = EMOTIONS[emoKey];
            const isSelected = selectedEmotion === emoKey;
            return (
              <button
                type="button"
                key={emoKey}
                onClick={() => setSelectedEmotion(emoKey)}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-center border-2 ${
                  isSelected
                    ? `${emo.bgColor} ${emo.borderColor} shadow-md scale-102 ring-2 ring-pink-400`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {renderEmotionIcon(emoKey, 'w-10 h-10')}
                <span className="text-xs font-black truncate max-w-full">{emo.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Topic & Support Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Topic Selector */}
        <div>
          <label className="block text-sm font-black text-slate-800 mb-2">
            2. Chuyện xảy ra liên quan đến điều gì?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-3 py-2 rounded-xl text-left border-2 transition-all flex items-center gap-2 text-xs font-bold ${
                  selectedTopic === topic.id
                    ? 'border-sky-400 bg-sky-50 text-sky-950 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-base">{topic.icon}</span>
                <span className="truncate">{topic.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Support Level */}
        <div>
          <label className="block text-sm font-black text-slate-800 mb-2">
            3. Em mong muốn thầy cô hỗ trợ thế nào?
          </label>
          <div className="space-y-2">
            {SUPPORT_LEVELS.map((lvl) => (
              <button
                type="button"
                key={lvl.id}
                onClick={() => setSupportLevel(lvl.id)}
                className={`w-full p-2.5 rounded-xl text-left border-2 transition-all text-xs ${
                  supportLevel === lvl.id
                    ? `${lvl.color} shadow-xs font-bold ring-1 ring-current`
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="font-black flex items-center justify-between">
                  <span>{lvl.label}</span>
                  {supportLevel === lvl.id && <span>✓</span>}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">{lvl.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: Expression mode tabs (Text / Audio / Photo & Video) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-black text-slate-800">
            4. Em chọn cách chia sẻ:
          </label>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'text' ? 'bg-white text-pink-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✍️ Viết lời nhắn
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'audio' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              Ghi âm {audioBase64 && '●'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('photo')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'photo' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Ảnh & Video {(photoUrl || videoBase64) && '●'}
            </button>
          </div>
        </div>

        {/* Tab 1: Text message */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {promptSuggestions.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTextMessage((prev) => (prev ? prev + ' ' + p : p))}
                  className="text-xs px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg border border-pink-200 transition-colors cursor-pointer text-left"
                >
                  💡 {p}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                maxLength={1000}
                placeholder="Em cứ viết tự nhiên những điều em đang nghĩ nhé..."
                className="w-full p-4 rounded-2xl border-2 border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 text-sm outline-hidden leading-relaxed resize-none bg-pink-50/20"
              />
              <div className="flex items-center justify-between text-xs text-slate-400 px-2 mt-1">
                <span>{textMessage.length}/1000 ký tự</span>
                {textMessage.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTextMessage('')}
                    className="text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Xóa viết lại
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Audio Recording */}
        {activeTab === 'audio' && (
          <div>
            <AudioRecorder
              onAudioReady={handleAudioReady}
              onSwitchToText={() => setActiveTab('text')}
            />
            {audioBase64 && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-600" /> Đã đính kèm tệp âm thanh ({audioDuration}s)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAudioBase64(null);
                    setAudioDuration(0);
                    setAudioFileName('');
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Photo & Video Upload */}
        {activeTab === 'photo' && (
          <div>
            <MediaUploadBox
              onPhotoReady={handlePhotoReady}
              onVideoReady={handleVideoReady}
              onClearMedia={() => {
                setPhotoUrl(null);
                setVideoBase64(null);
                setPhotoFileName('');
                setVideoFileName('');
              }}
            />
          </div>
        )}
      </div>

      {/* Step 4: Choose a cute sticker */}
      <div className="mb-6">
        <label className="block text-sm font-black text-slate-800 mb-2">
          5. Chọn một hình dán trang trí gửi kèm:
        </label>
        <div className="flex flex-wrap gap-2">
          {STICKERS.map((stk) => (
            <button
              type="button"
              key={stk.id}
              onClick={() => setSelectedSticker(stk.id)}
              className={`px-3 py-1.5 rounded-xl border-2 flex items-center gap-1.5 text-xs font-bold transition-all ${
                selectedSticker === stk.id
                  ? 'border-pink-400 bg-pink-100 text-pink-900 shadow-xs scale-105'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">{stk.icon}</span>
              <span>{stk.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 5: Student Identity & Anonymous Option */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isAnonymous ? (
              <UserX className="w-5 h-5 text-indigo-500" />
            ) : (
              <UserCheck className="w-5 h-5 text-emerald-600" />
            )}
            <span className="text-sm font-black text-slate-800">
              {isAnonymous ? 'Chế độ ẩn danh (Không ghi tên)' : 'Gửi kèm họ và tên của em'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              isAnonymous
                ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
            }`}
          >
            {isAnonymous ? 'Đổi: Em muốn ghi tên' : 'Đổi: Giữ ẩn danh'}
          </button>
        </div>

        {isAnonymous ? (
          <p className="text-xs text-slate-500 leading-relaxed">
            🛡️ <strong>Chế độ ẩn danh:</strong> Thầy cô sẽ không biết tên của em. Lựa chọn này giúp em thoải mái chia sẻ, nhưng thầy cô có thể khó liên hệ lại trực tiếp nếu em cần hỗ trợ sâu hơn.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên của em:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="VD: Nguyễn Bảo Nam"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-pink-400 outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lớp của em:</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="VD: Lớp 4B"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-pink-400 outline-hidden bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary of attached attachments */}
      {(audioBase64 || photoUrl || videoBase64) && (
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 bg-pink-50/50 p-2.5 rounded-xl border border-pink-200">
          <span>Đính kèm tệp:</span>
          {audioBase64 && (
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Ghi âm ({audioDuration}s)
            </span>
          )}
          {photoUrl && (
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> 1 Hình ảnh
            </span>
          )}
          {videoBase64 && (
            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Video className="w-3 h-3" /> 1 Video ({videoDuration}s)
            </span>
          )}
        </div>
      )}

      {/* Error alert if submission failed */}
      {submitError && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-center justify-between">
          <span>⚠️ {submitError}</span>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        {isSubmitting && (
          <span className="text-xs text-slate-500 font-semibold animate-pulse">
            {submitStep}
          </span>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>{submitStep || 'Đang gửi...'}</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Gửi Lời Chia Sẻ Từ Trái Tim</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
