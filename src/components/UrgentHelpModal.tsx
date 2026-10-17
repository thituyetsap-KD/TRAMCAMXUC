import React, { useState } from 'react';
import { HeartHandshake, PhoneCall, ShieldAlert, CheckCircle, ArrowRight, X, Sparkles } from 'lucide-react';

interface UrgentHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestHelp: (data: { studentName: string; studentClass: string; note: string; directMeet: boolean }) => void;
}

export const UrgentHelpModal: React.FC<UrgentHelpModalProps> = ({
  isOpen,
  onClose,
  onRequestHelp,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [urgentNote, setUrgentNote] = useState('');
  const [directMeet, setDirectMeet] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestHelp({
      studentName: studentName.trim() || 'Học sinh cần giúp đỡ khẩn',
      studentClass: studentClass.trim() || 'Tiểu học',
      note: urgentNote.trim() || 'Em cảm thấy không an toàn hoặc đang gặp chuyện rất khó khăn, cần thầy cô hỗ trợ trực tiếp.',
      directMeet,
    });
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setStudentName('');
    setStudentClass('');
    setUrgentNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-amber-300 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header with gentle caring warm icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-amber-950">
                  Em Không Phải Một Mình Đâu Nhé!
                </h3>
                <p className="text-xs md:text-sm text-amber-800 font-semibold">
                  Thầy cô luôn ở đây để lắng nghe, yêu thương và bảo vệ em.
                </p>
              </div>
            </div>

            {/* Gentle Warm Guidance Cards */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 mb-5 text-sm text-amber-950 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="text-lg">🌟</span>
                <p>
                  Nếu em đang cảm thấy <strong>bị bắt nạt</strong>, <strong>lo sợ</strong>, hoặc <strong>gặp chuyện nguy hiểm</strong>: Em hãy hít một hơi thật sâu. Mọi chuyện đều có cách giải quyết khi có người lớn đồng hành cùng em.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-lg">🏫</span>
                <p>
                  <strong>Ngay lúc này:</strong> Em hãy đến ngay <strong>phòng Y tế</strong>, <strong>phòng Tham vấn tâm lý</strong> hoặc tìm <strong>thầy cô chủ nhiệm / người lớn đáng tin cậy gần nhất</strong> nhé!
                </p>
              </div>
            </div>

            {/* Emergency Hotlines box */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-5 h-5 text-sky-600" />
                <div>
                  <div className="text-xs font-bold text-sky-900">Tổng đài Quốc gia Bảo vệ Trẻ em</div>
                  <div className="text-base font-black text-sky-600 tracking-wider">111 (Miễn phí 24/7)</div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white text-sky-700 rounded-lg border border-sky-200">
                Luôn sẵn sàng
              </span>
            </div>

            {/* Direct Assistance Request Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Gửi tín hiệu cần thầy cô hỗ trợ ngay:
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên của em (hoặc để trống):</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="VD: Minh Anh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp của em:</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="VD: Lớp 4A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Điều gì đang xảy ra với em?</label>
                <textarea
                  rows={3}
                  value={urgentNote}
                  onChange={(e) => setUrgentNote(e.target.value)}
                  placeholder="Em có thể kể ngắn gọn điều làm em lo sợ hoặc khó khăn nhất..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm outline-hidden resize-none"
                />
              </div>

              {/* Preference selector */}
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={directMeet}
                    onChange={(e) => setDirectMeet(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-400"
                  />
                  <span>Em muốn nói chuyện trực tiếp với thầy cô</span>
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-1/3 py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Gửi yêu cầu giúp đỡ
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
              Thầy cô đã nhận được thông tin của em!
            </h4>
            <p className="text-sm md:text-base text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
              Em hãy yên tâm và hít thở sâu nhé. Thầy cô phụ trách sẽ chủ động gặp gỡ và đồng hành giúp đỡ em thật sớm!
            </p>
            <button
              onClick={resetAndClose}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm inline-flex items-center gap-2"
            >
              <span>Về trang chủ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
