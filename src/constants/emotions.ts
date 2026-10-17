import { EmotionInfo, TopicInfo, SupportLevelInfo, EmotionType } from '../types';

export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbz3aQzUnstWbk8O_lwIEqng5JPNfcw-80YEx7fqsCD04LoWt_TnkHu1Lc_LQ0SCQDtV/exec';

export const EMOTIONS: Record<EmotionType, EmotionInfo> = {
  happy: {
    id: 'happy',
    label: 'Vui vẻ',
    subLabel: 'Trái tim rạng rỡ và ngập tràn niềm vui',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-800',
    emoji: '😊',
    illustration: 'sun',
    themeGradient: 'from-amber-100 to-yellow-50',
  },
  sad: {
    id: 'sad',
    label: 'Buồn bã',
    subLabel: 'Có chuyện làm em thấy tủi thân hoặc rơi nước mắt',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-800',
    emoji: '😢',
    illustration: 'raindrop',
    themeGradient: 'from-sky-100 to-blue-50',
  },
  anxious: {
    id: 'anxious',
    label: 'Lo lắng',
    subLabel: 'Em thấy hồi hộp, bất an hoặc lo sợ điều gì đó',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-800',
    emoji: '😟',
    illustration: 'cloud',
    themeGradient: 'from-purple-100 to-indigo-50',
  },
  angry: {
    id: 'angry',
    label: 'Tức giận',
    subLabel: 'Em cảm thấy khó chịu, bực bội hoặc muốn bùng nổ',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-800',
    emoji: '😡',
    illustration: 'peach',
    themeGradient: 'from-rose-100 to-red-50',
  },
  speechless: {
    id: 'speechless',
    label: 'Khó nói thành lời',
    subLabel: 'Cảm xúc ngổn ngang, em chưa biết diễn tả ra sao',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-800',
    emoji: '😶',
    illustration: 'sprout',
    themeGradient: 'from-emerald-100 to-teal-50',
  },
  just_listen: {
    id: 'just_listen',
    label: 'Mình chỉ muốn được lắng nghe',
    subLabel: 'Không cần lời khuyên ngay, chỉ cần ai đó lắng nghe em',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-800',
    emoji: '💗',
    illustration: 'heart',
    themeGradient: 'from-pink-100 to-rose-50',
  },
};

export const TOPICS: TopicInfo[] = [
  { id: 'friends', label: 'Bạn bè', icon: '👫', desc: 'Chuyện chơi chung, xích mích hoặc hiểu lầm' },
  { id: 'study', label: 'Học tập', icon: '📚', desc: 'Bài vở trên lớp, điểm số hoặc áp lực thi cử' },
  { id: 'teachers', label: 'Thầy cô', icon: '👩‍🏫', desc: 'Lời dặn dò, điều em chưa hiểu hoặc muốn chia sẻ' },
  { id: 'family', label: 'Gia đình', icon: '🏡', desc: 'Bố mẹ, ông bà, anh chị em ở nhà' },
  { id: 'worry', label: 'Điều khiến em lo lắng', icon: '💭', desc: 'Một điều làm em băn khoăn, sợ hãi' },
  { id: 'joy', label: 'Điều em vui', icon: '🌟', desc: 'Thành tích nhỏ, niềm vui bất ngờ trong ngày' },
  { id: 'other', label: 'Chuyện khác', icon: '🎈', desc: 'Bất cứ điều gì em muốn tâm sự' },
];

export const SUPPORT_LEVELS: SupportLevelInfo[] = [
  {
    id: 'share_only',
    label: 'Em muốn chia sẻ',
    desc: 'Em chỉ muốn viết ra cho nhẹ lòng, chưa cần gặp trực tiếp.',
    color: 'border-emerald-400 bg-emerald-50 text-emerald-800',
  },
  {
    id: 'chat',
    label: 'Em muốn được trò chuyện',
    desc: 'Em mong có một buổi nói chuyện nhỏ riêng tư cùng thầy cô.',
    color: 'border-sky-400 bg-sky-50 text-sky-800',
  },
  {
    id: 'urgent',
    label: 'Em cần thầy cô giúp đỡ sớm',
    desc: 'Em đang rất bối rối, sợ hãi hoặc gặp chuyện khó khăn cần giúp ngay.',
    color: 'border-amber-500 bg-amber-50 text-amber-900',
  },
];

export const STICKERS = [
  { id: 'heart', label: 'Trái tim ấm', icon: '💖' },
  { id: 'star', label: 'Ngôi sao sáng', icon: '⭐' },
  { id: 'sun', label: 'Mặt trời tươi', icon: '☀️' },
  { id: 'rainbow', label: 'Cầu vồng hy vọng', icon: '🌈' },
  { id: 'clover', label: 'Cỏ 4 lá may mắn', icon: '🍀' },
  { id: 'cat', label: 'Mèo con ngoan', icon: '🐱' },
  { id: 'bear', label: 'Gấu ôm ấm áp', icon: '🧸' },
  { id: 'flower', label: 'Hoa điểm 10', icon: '🌸' },
];

export const KIND_PROMPTS = [
  { id: 'p1', title: 'Em cảm ơn thầy cô vì...', prefix: 'Em cảm ơn thầy/cô vì ' },
  { id: 'p2', title: 'Em muốn nói với bạn rằng...', prefix: 'Mình muốn nói với bạn rằng ' },
  { id: 'p3', title: 'Hôm nay em tự hào vì...', prefix: 'Hôm nay em rất tự hào vì ' },
  { id: 'p4', title: 'Điều làm em mỉm cười là...', prefix: 'Điều làm em mỉm cười hôm nay là ' },
];
