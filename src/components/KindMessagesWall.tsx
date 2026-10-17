import React, { useState } from 'react';
import { KindMessage } from '../types';
import { KIND_PROMPTS } from '../constants/emotions';
import { Heart, Send, Sparkles, Plus, Award } from 'lucide-react';

interface KindMessagesWallProps {
  messages: KindMessage[];
  onAddMessage: (msg: { author: string; promptTemplate: string; content: string; sticker: string }) => void;
  onLikeMessage: (id: string) => void;
}

export const KindMessagesWall: React.FC<KindMessagesWallProps> = ({
  messages,
  onAddMessage,
  onLikeMessage,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(KIND_PROMPTS[0].title);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('💖');

  const stickers = ['💖', '🌟', '🌸', '🐱', '🌈', '🍀', '🧸', '🎈'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Em hãy viết một điều tốt đẹp nhé!');
      return;
    }

    onAddMessage({
      author: authorName.trim() || 'Bạn nhỏ dễ thương',
      promptTemplate: selectedPrompt,
      content: content.trim(),
      sticker: selectedSticker,
    });

    setContent('');
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-100 via-amber-50 to-emerald-50 rounded-3xl p-6 md:p-8 border-2 border-pink-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500 text-white rounded-full text-xs font-black mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Khu Vườn Tích Cực
          </div>
          <h3 className="text-2xl font-black text-slate-800">Gửi Điều Tốt Đẹp</h3>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Nơi lan tỏa những lời cảm ơn, niềm tự hào và sự biết ơn của thầy trò chúng mình. Những lời yêu thương sẽ sưởi ấm cả ngôi trường!
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 text-sm shrink-0"
        >
          {isFormOpen ? 'Đóng bảng viết' : <><Plus className="w-4 h-4" /> Gửi điều tốt đẹp mới</>}
        </button>
      </div>

      {/* Writing Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border-2 border-pink-200 shadow-lg space-y-4 animate-in slide-in-from-top-4 duration-200">
          <h4 className="font-black text-slate-800 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-500" />
            Viết một lời nhắn trao gửi yêu thương
          </h4>

          {/* Quick Prompt Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Chọn mẫu gợi ý:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {KIND_PROMPTS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    setSelectedPrompt(p.title);
                    if (!content) setContent(p.prefix);
                  }}
                  className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all ${
                    selectedPrompt === p.title
                      ? 'border-pink-400 bg-pink-50 text-pink-900 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung em muốn nhắn gửi:</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="VD: Em cảm ơn cô vì luôn kiên nhẫn chỉ bài cho em..."
              className="w-full p-3.5 rounded-2xl border-2 border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 text-sm outline-hidden resize-none bg-pink-50/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên của em hoặc lớp (không bắt buộc):</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="VD: Minh Khang - Lớp 3B"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-pink-400 outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hình dán yêu thích:</label>
              <div className="flex gap-2">
                {stickers.map((stk) => (
                  <button
                    type="button"
                    key={stk}
                    onClick={() => setSelectedSticker(stk)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform ${
                      selectedSticker === stk ? 'bg-pink-100 ring-2 ring-pink-400 scale-110' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" /> Đăng lên Vườn Yêu Thương
            </button>
          </div>
        </form>
      )}

      {/* Cards Grid of Kind Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border-2 border-pink-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{item.sticker || '💖'}</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="text-xs font-bold text-pink-600 uppercase tracking-wide mb-1">
                {item.promptTemplate}
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-4">
                “{item.content}”
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600">
                🌿 {item.author}
              </span>
              <button
                onClick={() => onLikeMessage(item.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition-colors text-xs font-bold active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                <span>{item.likes || 0} Yêu thương</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
