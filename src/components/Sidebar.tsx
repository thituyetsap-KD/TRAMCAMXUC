import React from 'react';
import { LogoStationHeart } from './EmotionIllustrations';
import { Home, Sparkles, MessageSquareQuote, BookOpen, ExternalLink } from 'lucide-react';

export type NavPage = 'home' | 'share' | 'audio' | 'text' | 'image' | 'kindness' | 'feedback';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const handleGoHome = () => {
    onNavigate('home');
    onCloseMobile();
  };

  const handleGoFeedback = () => {
    onNavigate('feedback');
    onCloseMobile();
  };

  const isHomeActive = currentPage === 'home';
  const isFeedbackActive = currentPage === 'feedback';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 md:w-72 bg-white/95 backdrop-blur-md border-r-2 border-pink-100 flex flex-col justify-between p-5 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5">
          {/* Logo & Brand Header */}
          <div
            onClick={handleGoHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="transition-transform group-hover:scale-105">
              <LogoStationHeart className="w-11 h-11" />
            </div>
            <div>
              <span className="text-base font-black text-rose-600 block leading-tight font-['Quicksand',sans-serif]">
                Trạm Cảm Xúc
              </span>
              <span className="text-sm font-bold text-sky-700 block leading-tight">
                Từ Trái Tim
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2.5">
            {/* 1. Nút Trang chủ */}
            <button
              onClick={handleGoHome}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-sm transition-all text-left border-2 cursor-pointer ${
                isHomeActive
                  ? 'bg-sky-100/90 text-sky-900 border-sky-300 shadow-xs scale-101'
                  : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border-slate-200'
              }`}
            >
              <Home className={`w-5 h-5 ${isHomeActive ? 'text-sky-600' : 'text-slate-500'}`} />
              <span>Trang chủ</span>
            </button>

            {/* 2. Mục Phản hồi của giáo viên (Thiết kế nút đẹp, nổi bật) */}
            <button
              onClick={handleGoFeedback}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-black text-sm transition-all text-left border-2 cursor-pointer ${
                isFeedbackActive
                  ? 'bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 text-emerald-950 border-emerald-400 shadow-sm scale-101 ring-2 ring-emerald-300/40'
                  : 'bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-white hover:from-emerald-100/80 hover:to-teal-50 text-emerald-900 border-emerald-200 shadow-2xs hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquareQuote className="w-4 h-4" />
                </span>
                <span className="truncate font-black">Phản hồi của giáo viên</span>
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-200/90 text-emerald-900 shrink-0 border border-emerald-300 shadow-2xs">
                Mới
              </span>
            </button>
          </nav>

          {/* Khu vực nổi bật Classkick ngay cột bên trái */}
          <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white p-4 rounded-3xl shadow-lg border-2 border-emerald-300/60 text-center relative overflow-hidden space-y-2.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-100 border border-white/30">
              <Sparkles className="w-3 h-3 text-amber-300" /> Phản hồi từ thầy cô
            </div>

            <div className="text-xs font-black leading-snug">
              Nhận phản hồi & bài tập trực tiếp từ thầy cô trên Classkick
            </div>

            {/* Nút bấm Tham gia nhận phản hồi từ thầy cô */}
            <a
              href="https://app.classkick.com/login/CVM6B2"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-amber-950 font-black rounded-xl text-xs shadow-md transition-all hover:scale-103 active:scale-95 group cursor-pointer border border-amber-200 tracking-tight"
            >
              <BookOpen className="w-4 h-4 shrink-0 text-amber-950" />
              <span className="uppercase text-[11px] leading-tight">THAM GIA NHẬN PHẢN HỒI TỪ THẦY CÔ</span>
              <ExternalLink className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="text-[10px] text-emerald-100 font-semibold opacity-95">
              Mã lớp: <strong>CVM6B2</strong> · Mở tab mới
            </div>
          </div>
        </div>

        {/* Bottom Caring Box: "Bạn không đơn độc!" */}
        <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 rounded-3xl p-3.5 border-2 border-pink-100 text-center relative overflow-hidden shadow-xs mt-3">
          <div className="w-12 h-12 mx-auto mb-1.5 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <circle cx="50" cy="50" r="48" fill="#FCE7F3" />
              <circle cx="35" cy="38" r="14" fill="#FED7AA" />
              <path d="M22 35 C22 25, 35 22, 45 28 C45 35, 25 35, 22 35 Z" fill="#1E293B" />
              <circle cx="32" cy="38" r="1.5" fill="#1E293B" />
              <circle cx="38" cy="38" r="1.5" fill="#1E293B" />
              <path d="M33 43 Q35 46, 37 43" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />

              <circle cx="65" cy="38" r="14" fill="#FED7AA" />
              <path d="M55 35 C58 22, 75 25, 78 35 C75 35, 55 35, 55 35 Z" fill="#78350F" />
              <circle cx="62" cy="38" r="1.5" fill="#1E293B" />
              <circle cx="68" cy="38" r="1.5" fill="#1E293B" />
              <path d="M63 43 Q65 46, 67 43" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />

              <path
                d="M50 72 C50 72, 30 55, 30 42 C30 35, 35 30, 42 30 C46 30, 50 34, 50 34 C50 34, 54 30, 58 30 C65 30, 70 35, 70 42 C70 55, 50 72, 50 72 Z"
                fill="#F43F5E"
              />
            </svg>
          </div>

          <h5 className="text-xs font-black text-rose-950 mb-0.5">
            Bạn không đơn độc!
          </h5>
          <p className="text-[10px] font-semibold text-rose-800 leading-tight">
            Luôn có thầy cô và bạn bè đồng hành cùng em!
          </p>
        </div>
      </aside>
    </>
  );
};
