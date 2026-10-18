import React, { useState } from 'react';
import { verifyTeacherCredentials } from '../services/storage';
import { Lock, User, ShieldCheck, X, Eye, EyeOff } from 'lucide-react';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = verifyTeacherCredentials(username, password);
    if (isValid) {
      setError(false);
      setUsername('');
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleModalClose = () => {
    setError(false);
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 md:p-8 shadow-2xl border-2 border-indigo-100 text-center relative animate-in zoom-in-95 duration-200">
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1">Khu Vực Giáo Viên</h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Khu vực bảo mật quản lý hộp thư và hỗ trợ học sinh. Vui lòng đăng nhập để tiếp tục.
        </p>

        <form onSubmit={handleVerify} className="space-y-4 text-left">
          {/* Tên đăng nhập */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên đăng nhập
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Nhập tên đăng nhập"
                className={`w-full py-2.5 pl-9 pr-3 text-sm rounded-xl border-2 outline-hidden transition-colors ${
                  error
                    ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/40'
                }`}
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Nhập mật khẩu"
                className={`w-full py-2.5 pl-9 pr-10 text-sm rounded-xl border-2 outline-hidden transition-colors ${
                  error
                    ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/40'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-bold mt-1.5 animate-shake">
                Tên đăng nhập hoặc mật khẩu không chính xác!
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Đăng nhập hệ thống
          </button>
        </form>
      </div>
    </div>
  );
};
