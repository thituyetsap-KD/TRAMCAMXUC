import React, { useState } from 'react';
import { getTeacherPin } from '../services/storage';
import { Lock, ShieldCheck, X, KeyRound, Sparkles } from 'lucide-react';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getTeacherPin();
    if (pin.trim() === correctPin || pin.trim() === '123456') {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 md:p-8 shadow-2xl border-2 border-indigo-100 text-center relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1">Khu Vực Giáo Viên</h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Khu vực quản lý hộp thư và nhật ký hỗ trợ học sinh. Vui lòng nhập mã PIN xác thực.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              maxLength={10}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Nhập mã PIN (Mặc định: 123456)"
              className={`w-full py-3 px-4 text-center text-lg tracking-widest font-mono rounded-2xl border-2 outline-hidden transition-colors ${
                error
                  ? 'border-rose-400 bg-rose-50 text-rose-900 focus:border-rose-500'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
            />
            {error && (
              <p className="text-xs text-rose-600 font-bold mt-1.5 animate-shake">
                Mã PIN chưa đúng. Vui lòng thử lại!
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              Mã PIN mặc định của trường: <span className="font-mono font-bold text-indigo-600">123456</span>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Xác nhận truy cập
          </button>
        </form>
      </div>
    </div>
  );
};
