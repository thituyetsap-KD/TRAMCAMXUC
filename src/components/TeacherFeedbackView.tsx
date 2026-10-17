import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Sparkles, BookOpen, Heart, Award, ArrowLeft, MessageSquareQuote } from 'lucide-react';

interface TeacherFeedbackViewProps {
  onBackToHome: () => void;
}

export const TeacherFeedbackView: React.FC<TeacherFeedbackViewProps> = ({ onBackToHome }) => {
  const [copied, setCopied] = useState(false);
  const classkickUrl = 'https://app.classkick.com/login/E4KLJ8';
  const classCode = 'E4KLJ8';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Không gian học tập & Phản hồi
        </span>
      </div>

      {/* Prominent Hero Area for Classkick */}
      <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-600 rounded-3xl p-6 md:p-10 shadow-xl text-white overflow-hidden">
        {/* Soft decorative glow circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-emerald-50 border border-white/30 shadow-xs">
            <span>🎒</span>
            <span>Phản hồi & Lớp học trực tuyến</span>
            <span>⭐</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm font-['Quicksand',sans-serif]">
            Lớp Học Classkick Cùng Thầy Cô
          </h2>

          <p className="text-sm md:text-base text-emerald-50 leading-relaxed font-medium">
            Thầy cô đã gửi phản hồi, lời động viên và bài tập tương tác sinh động đến các bạn nhỏ. Hãy tham gia ngay để cùng học và nhận hoa điểm mười nhé!
          </p>

          {/* THE PROMINENT REQUIRED CLASSKICK BUTTON */}
          <div className="pt-2 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={classkickUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base md:text-lg rounded-2xl shadow-xl shadow-emerald-950/20 transition-all hover:scale-105 active:scale-95 text-center group cursor-pointer border-2 border-amber-200"
            >
              <BookOpen className="w-5 h-5 text-amber-950" />
              <span>Tham gia Lớp học Classkick</span>
              <ExternalLink className="w-5 h-5 text-amber-950 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            <button
              onClick={handleCopyCode}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl backdrop-blur-md transition-all text-sm border border-white/30 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>Mã lớp: <strong>{classCode}</strong></span>
              {copied && <span className="text-xs text-emerald-200 font-semibold">(Đã chép)</span>}
            </button>
          </div>

          <p className="text-xs text-emerald-100 font-semibold pt-1">
            * Trang Classkick sẽ mở trong thẻ mới, không làm gián đoạn hay mất dữ liệu đang làm việc của em.
          </p>
        </div>
      </div>

      {/* Helpful Instructions & Teacher Warm Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-800 mb-1">Nhận Lời Nhắn Riêng</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thầy cô sẽ chấm bài, để lại lời nhắn động viên ấm áp và giải đáp các câu hỏi khó cho em ngay trên từng trang bài làm.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
            ✓ Phản hồi nhanh chóng
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-800 mb-1">Sticker Khen Ngợi</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các bạn nhỏ hoàn thành tốt sẽ được thầy cô tặng hoa điểm 10, ngôi sao chăm ngoan và huy hiệu khen ngợi đáng yêu!
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700">
            ✓ Hoa điểm 10 & sao vàng
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-sky-600" />
            </div>
            <h4 className="text-base font-black text-slate-800 mb-1">Giúp Đỡ Tức Thì</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nếu gặp bài tập khó, em có thể bấm nút “Giơ tay xin trợ giúp” (Please Help) để thầy cô vào xem và chỉ dẫn trực tiếp.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-sky-700">
            ✓ Tương tác trực tiếp 2 chiều
          </div>
        </div>
      </div>
    </div>
  );
};
