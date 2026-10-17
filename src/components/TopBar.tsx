import React from 'react';
import { Menu, Settings, ShieldCheck, Heart } from 'lucide-react';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  onOpenTeacherAuth: () => void;
  isTeacherMode: boolean;
  onExitTeacherMode?: () => void;
  onOpenKindness?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onOpenTeacherAuth,
  isTeacherMode,
  onExitTeacherMode,
  onOpenKindness,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 md:px-8 py-3 flex items-center justify-between">
      {/* Left: Mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Small motto pill & link to kindness garden */}
        <button
          onClick={onOpenKindness}
          className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-full border border-rose-200 transition-all shadow-2xs cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Lời nhắn yêu thương & Vườn tích cực</span>
        </button>
      </div>

      {/* Right User Bar matching the reference mockup */}
      <div className="flex items-center gap-3">
        {isTeacherMode ? (
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              Đang ở Chế độ Giáo viên
            </span>
            <button
              onClick={onExitTeacherMode}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Về chế độ học sinh
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 bg-sky-50/80 border border-sky-200 rounded-full pl-2 pr-3 py-1 shadow-2xs">
            {/* Kid Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white text-base font-bold shadow-xs">
              🧒
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-slate-800 leading-tight">
                Xin chào, bạn nhỏ!
              </div>
              <div className="text-[10px] font-bold text-sky-700 leading-tight">
                Hãy chia sẻ cảm xúc của mình nhé!
              </div>
            </div>

            {/* Gear / Teacher Access Button */}
            <button
              onClick={onOpenTeacherAuth}
              title="Khu vực dành cho thầy cô"
              className="p-1.5 rounded-full hover:bg-white text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
