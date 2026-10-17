import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Home, Sparkles } from 'lucide-react';

interface SuccessConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
}

export const SuccessConfirmationModal: React.FC<SuccessConfirmationModalProps> = ({
  isOpen,
  onGoHome,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire festive kid-friendly confetti with pastel colors
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FDA4AF', '#FCD34D', '#93C5FD', '#A7F3D0', '#C084FC'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border-4 border-pink-200 text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Soft Background Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-pink-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-sky-100 rounded-full blur-2xl pointer-events-none" />

        {/* Big Beating Heart Graphic */}
        <div className="relative z-10 mx-auto w-28 h-28 mb-5 flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path
              d="M50 82 C50 82 16 60 16 38 C16 24 27 16 40 16 C46 16 50 20 50 20 C50 20 54 16 60 16 C73 16 84 24 84 38 C84 60 50 82 50 82 Z"
              fill="url(#successHeartGrad)"
            />
            {/* Cute Smiling Face on Heart */}
            <circle cx="39" cy="38" r="2.5" fill="#881337" />
            <circle cx="61" cy="38" r="2.5" fill="#881337" />
            <path d="M44 47 C47 52, 53 52, 56 47" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="34" cy="45" r="3.5" fill="#FDA4AF" />
            <circle cx="66" cy="45" r="3.5" fill="#FDA4AF" />
            <defs>
              <linearGradient id="successHeartGrad" x1="20" y1="20" x2="80" y2="80">
                <stop stopColor="#FB7185" />
                <stop offset="1" stopColor="#E11D48" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Required Vietnamese affirmation message */}
        <h3 className="text-xl md:text-2xl font-black text-rose-950 mb-3 leading-snug">
          Gửi Thành Công!
        </h3>

        <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 mb-6">
          <p className="text-sm md:text-base font-bold text-rose-900 leading-relaxed">
            “Cảm ơn em đã tin tưởng chia sẻ. Cảm xúc của em rất quan trọng. Em xứng đáng được lắng nghe và tôn trọng.”
          </p>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Thầy cô phụ trách sẽ luôn đồng hành và hỗ trợ em khi em cần nhé!
        </p>

        {/* Back to Home Button */}
        <button
          onClick={onGoHome}
          className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>Về trang chủ</span>
        </button>
      </div>
    </div>
  );
};
