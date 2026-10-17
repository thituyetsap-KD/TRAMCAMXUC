import React from 'react';
import { EmotionType } from '../types';
import {
  HappySunIcon,
  SadDropletIcon,
  AnxiousCloudIcon,
  AngryPeachIcon,
  SpeechlessBeanIcon,
  KidsHuggingHeartIllustration,
  WoodenSignposts,
} from './EmotionIllustrations';
import {
  BookOpen,
  Mic,
  FileText,
  Image as ImageIcon,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Heart,
} from 'lucide-react';

import heroBannerImg from '../assets/images/banner_tram_cam_xuc_1792277942092.jpg';

interface StudentHomeProps {
  onSelectEmotion: (emotion: EmotionType) => void;
  onOpenMode: (mode: 'all' | 'audio' | 'text' | 'image') => void;
  onOpenUrgentHelp: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onSelectEmotion,
  onOpenMode,
  onOpenUrgentHelp,
}) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* 1. Top Hero Section - Ảnh Banner Chính Cung Cấp */}
      <div className="space-y-4">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border-3 border-pink-200 bg-white group">
          <img
            src={heroBannerImg}
            alt="Trạm Cảm Xúc Từ Trái Tim - Lắng nghe, Kết nối, Yêu thương"
            className="w-full h-auto object-cover max-h-[460px] md:max-h-[520px] transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </div>

        {/* Greeting Banner under the image */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-sm border-2 border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">👋</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800">
                Chào bạn nhỏ! Hôm nay trái tim bạn đang cảm thấy thế nào?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                Hãy chọn một người bạn cảm xúc bên dưới để bắt đầu chia sẻ nhé!
              </p>
            </div>
          </div>

          <div className="px-4 py-1.5 bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-950 font-black text-xs rounded-full shadow-xs uppercase tracking-wide shrink-0">
            Trường Học Hạnh Phúc ✨
          </div>
        </div>
      </div>

      {/* 2. The 5 Main Emotion Cards (Matching the reference design exactly) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {/* Vui vẻ */}
        <button
          onClick={() => onSelectEmotion('happy')}
          className="bg-[#FEF9C3] hover:bg-[#FEF08A] border-2 border-amber-300 rounded-3xl p-4 md:p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group cursor-pointer"
        >
          <div className="transition-transform group-hover:scale-110 duration-200">
            <HappySunIcon className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <span className="text-base md:text-lg font-black text-amber-950 mt-2">Vui vẻ</span>
          <span className="text-[11px] text-amber-800 font-semibold mt-0.5 opacity-80">Rạng rỡ & yêu đời</span>
        </button>

        {/* Buồn bã */}
        <button
          onClick={() => onSelectEmotion('sad')}
          className="bg-[#E0F2FE] hover:bg-[#BAE6FD] border-2 border-sky-300 rounded-3xl p-4 md:p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group cursor-pointer"
        >
          <div className="transition-transform group-hover:scale-110 duration-200">
            <SadDropletIcon className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <span className="text-base md:text-lg font-black text-sky-950 mt-2">Buồn bã</span>
          <span className="text-[11px] text-sky-800 font-semibold mt-0.5 opacity-80">Cần một cái ôm</span>
        </button>

        {/* Lo lắng */}
        <button
          onClick={() => onSelectEmotion('anxious')}
          className="bg-[#F3E8FF] hover:bg-[#E9D5FF] border-2 border-purple-300 rounded-3xl p-4 md:p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group cursor-pointer"
        >
          <div className="transition-transform group-hover:scale-110 duration-200">
            <AnxiousCloudIcon className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <span className="text-base md:text-lg font-black text-purple-950 mt-2">Lo lắng</span>
          <span className="text-[11px] text-purple-800 font-semibold mt-0.5 opacity-80">Hơi hồi hộp băn khoăn</span>
        </button>

        {/* Tức giận */}
        <button
          onClick={() => onSelectEmotion('angry')}
          className="bg-[#FFE4E6] hover:bg-[#FECDD3] border-2 border-rose-300 rounded-3xl p-4 md:p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group cursor-pointer"
        >
          <div className="transition-transform group-hover:scale-110 duration-200">
            <AngryPeachIcon className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <span className="text-base md:text-lg font-black text-rose-950 mt-2">Tức giận</span>
          <span className="text-[11px] text-rose-800 font-semibold mt-0.5 opacity-80">Bực bội khó chịu</span>
        </button>

        {/* Khó nói thành lời */}
        <button
          onClick={() => onSelectEmotion('speechless')}
          className="col-span-2 sm:col-span-1 bg-[#D1FAE5] hover:bg-[#A7F3D0] border-2 border-emerald-300 rounded-3xl p-4 md:p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group cursor-pointer"
        >
          <div className="transition-transform group-hover:scale-110 duration-200">
            <SpeechlessBeanIcon className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <span className="text-base md:text-lg font-black text-emerald-950 mt-2">Khó nói thành lời</span>
          <span className="text-[11px] text-emerald-800 font-semibold mt-0.5 opacity-80">Chưa biết diễn tả sao</span>
        </button>
      </div>

      {/* 3. Wide Button: "💗 Mình chỉ muốn được lắng nghe >" */}
      <button
        onClick={() => onSelectEmotion('just_listen')}
        className="w-full py-4 px-6 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white font-black text-base md:text-lg rounded-3xl shadow-md shadow-pink-200 flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer group"
      >
        <Heart className="w-6 h-6 fill-white text-white group-hover:scale-125 transition-transform" />
        <span>Mình chỉ muốn được lắng nghe</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
      </button>

      {/* 4. Bottom 5 Feature / Action Cards in a Row (with Right Signposts) */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 flex-1">
          {/* Card 1: Em muốn chia sẻ (Pink) */}
          <div
            onClick={() => onOpenMode('all')}
            className="bg-[#FFF1F2] hover:bg-[#FFE4E6] border-2 border-pink-200 rounded-3xl p-4 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-200 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-pink-950 mb-1">Em muốn chia sẻ</h4>
              <p className="text-xs text-pink-800 leading-relaxed font-semibold">
                Ghi lại cảm xúc, điều đang suy nghĩ trong lòng
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 2: Em muốn ghi âm (Blue) */}
          <div
            onClick={() => onOpenMode('audio')}
            className="bg-[#F0F9FF] hover:bg-[#E0F2FE] border-2 border-sky-200 rounded-3xl p-4 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-200 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-sky-950 mb-1">Em muốn ghi âm</h4>
              <p className="text-xs text-sky-800 leading-relaxed font-semibold">
                Ghi âm tâm sự của em một cách an toàn
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 3: Em muốn gửi lời nhắn (Green) */}
          <div
            onClick={() => onOpenMode('text')}
            className="bg-[#ECFDF5] hover:bg-[#D1FAE5] border-2 border-emerald-200 rounded-3xl p-4 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-200 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-emerald-950 mb-1">Em muốn gửi lời nhắn</h4>
              <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
                Viết những điều em muốn nói với thầy cô
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 4: Em muốn gửi hình ảnh (Purple) */}
          <div
            onClick={() => onOpenMode('image')}
            className="bg-[#FAF5FF] hover:bg-[#F3E8FF] border-2 border-purple-200 rounded-3xl p-4 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-200 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-purple-950 mb-1">Em muốn gửi hình ảnh</h4>
              <p className="text-xs text-purple-800 leading-relaxed font-semibold">
                Chia sẻ tranh vẽ hoặc hình ảnh em muốn
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 5: Em cần thầy cô giúp đỡ (Gold / Amber with heart hands) */}
          <div
            onClick={onOpenUrgentHelp}
            className="sm:col-span-2 md:col-span-3 lg:col-span-1 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] hover:from-[#FEF3C7] hover:to-[#FDE68A] border-2 border-amber-300 rounded-3xl p-4 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform animate-pulse">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-amber-950 mb-1">Em cần thầy cô giúp đỡ</h4>
              <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                Khi em gặp khó khăn hoặc cảm thấy không an toàn
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Right Signposts: Lắng nghe, Thấu hiểu, Yêu thương, Đồng hành */}
        <div className="hidden lg:flex items-center justify-center px-2 shrink-0">
          <WoodenSignposts />
        </div>
      </div>

      {/* 5. Bottom Sweet Affirmation Footer */}
      <div className="text-center pt-2">
        <p className="text-xs sm:text-sm font-bold text-slate-500 italic flex items-center justify-center gap-2">
          <span>🌸</span>
          <span>Cùng nhau xây dựng một ngôi trường tràn đầy yêu thương!</span>
          <span>🌸</span>
        </p>
      </div>
    </div>
  );
};
