import { Submission, KindMessage, CaseStatus, TeacherNote } from '../types';
import { DEFAULT_GAS_URL, EMOTIONS, TOPICS, SUPPORT_LEVELS } from '../constants/emotions';

const SUBMISSIONS_STORAGE_KEY = 'tram_cam_xuc_submissions_v2';
const KIND_MESSAGES_KEY = 'tram_cam_xuc_kind_messages_v2';
const GAS_URL_KEY = 'tram_cam_xuc_gas_url';
const TEACHER_PIN_KEY = 'tram_cam_xuc_teacher_pin';

export const getStoredGasUrl = (): string => {
  return localStorage.getItem(GAS_URL_KEY) || DEFAULT_GAS_URL;
};

export const setStoredGasUrl = (url: string): void => {
  localStorage.setItem(GAS_URL_KEY, url.trim());
};

export const getTeacherPin = (): string => {
  return localStorage.getItem(TEACHER_PIN_KEY) || '123456';
};

export const setTeacherPin = (pin: string): void => {
  localStorage.setItem(TEACHER_PIN_KEY, pin);
};

// Seed initial realistic data for demonstration
const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'demo-1',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    studentName: 'Học sinh ẩn danh',
    studentClass: 'Lớp 3A',
    isAnonymous: true,
    emotion: 'anxious',
    topic: 'study',
    supportLevel: 'urgent',
    textMessage: 'Em thấy lo lắng vì ngày mai thi kiểm tra môn Toán. Mấy hôm nay em ôn bài mà vẫn sợ làm sai. Thầy cô có thể dặn dò giúp em bình tĩnh hơn không ạ?',
    sticker: 'star',
    status: 'new',
    teacherNotes: [
      {
        id: 'n-1',
        date: new Date(Date.now() - 3600000).toISOString(),
        author: 'Cô Thu Hương (Chủ nhiệm 3A)',
        content: 'Đã nhận tin. Sáng mai đầu giờ sẽ động viên cả lớp và hỏi thăm nhẹ nhàng để em không bị tâm lý.',
      },
    ],
    supportPlan: 'Gặp gỡ 5 phút trước giờ thi, cho làm bài mẫu nhẹ nhàng.',
    syncedToGoogle: true,
    isUrgentAlert: true,
  },
  {
    id: 'demo-2',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    studentName: 'Nguyễn Minh Khang',
    studentClass: 'Lớp 4B',
    isAnonymous: false,
    emotion: 'happy',
    topic: 'joy',
    supportLevel: 'share_only',
    textMessage: 'Hôm nay nhóm em được cô khen vì cùng nhau chăm sóc bồn hoa của trường! Em và các bạn cảm thấy rất vui và yêu quý ngôi trường này.',
    sticker: 'sun',
    status: 'helped',
    teacherNotes: [
      {
        id: 'n-2',
        date: new Date(Date.now() - 3600000 * 12).toISOString(),
        author: 'Thầy Tuấn (Tổng phụ trách)',
        content: 'Niềm vui rất đáng khích lệ, sẽ tuyên dương tập thể lớp vào giờ sinh hoạt.',
      },
    ],
    syncedToGoogle: true,
  },
  {
    id: 'demo-3',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    studentName: 'Học sinh ẩn danh',
    studentClass: 'Lớp 5C',
    isAnonymous: true,
    emotion: 'sad',
    topic: 'friends',
    supportLevel: 'chat',
    textMessage: 'Giờ ra chơi các bạn không cho em cùng chơi nhảy dây. Em cảm thấy một mình rất buồn và tủi thân. Em mong cô giúp em hòa đồng cùng các bạn.',
    sticker: 'cloud',
    status: 'reviewing',
    teacherNotes: [],
    supportPlan: 'Tổ chức trò chơi tập thể gắn kết trong tiết hoạt động trải nghiệm.',
    syncedToGoogle: false,
  },
  {
    id: 'demo-4',
    createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    studentName: 'Trần Gia Hân',
    studentClass: 'Lớp 2B',
    isAnonymous: false,
    emotion: 'just_listen',
    topic: 'other',
    supportLevel: 'share_only',
    textMessage: 'Em chỉ muốn gửi lời cảm ơn cô giáo vì hôm nay đã chỉ cho em cách viết chữ đẹp hơn ạ. Trái tim em thấy ấm áp lắm!',
    sticker: 'heart',
    status: 'closed',
    teacherNotes: [
      {
        id: 'n-3',
        date: new Date(Date.now() - 3600000 * 30).toISOString(),
        author: 'Cô Mai (Chủ nhiệm 2B)',
        content: 'Đã gửi lời khen vào sổ liên lạc điện tử cho phụ huynh.',
      },
    ],
    syncedToGoogle: true,
  },
];

const INITIAL_KIND_MESSAGES: KindMessage[] = [
  {
    id: 'km-1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    author: 'Bạn nhỏ Lớp 4A',
    promptTemplate: 'Em cảm ơn thầy cô vì...',
    content: 'Em cảm ơn cô Hà vì luôn kiên nhẫn giảng lại bài mỗi khi chúng em chưa hiểu bài tập làm văn ạ!',
    likes: 12,
    sticker: '🌸',
  },
  {
    id: 'km-2',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    author: 'Minh Anh - Lớp 3C',
    promptTemplate: 'Em muốn nói với bạn rằng...',
    content: 'Mình muốn nói với bạn Nam rằng chiếc bút chì bạn cho mình mượn hôm qua đã giúp mình hoàn thành bài vẽ rất đẹp. Cảm ơn bạn!',
    likes: 18,
    sticker: '💖',
  },
  {
    id: 'km-3',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    author: 'Bạn nhỏ Lớp 2E',
    promptTemplate: 'Hôm nay em tự hào vì...',
    content: 'Hôm nay em tự hào vì đã dũng cảm xung phong lên bảng đọc bài thơ Chuyện Cổ Tích Về Loài Người.',
    likes: 25,
    sticker: '⭐',
  },
  {
    id: 'km-4',
    createdAt: new Date(Date.now() - 3600000 * 34).toISOString(),
    author: 'Bảo Ngọc - Lớp 5B',
    promptTemplate: 'Điều làm em mỉm cười là...',
    content: 'Điều làm em mỉm cười là nhìn thấy chú mèo tam thể nằm phơi nắng dưới gốc bàng sân trường vào buổi sáng.',
    likes: 15,
    sticker: '🐱',
  },
];

export const getSubmissions = (): Submission[] => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading submissions from localStorage', e);
    return INITIAL_SUBMISSIONS;
  }
};

export const saveSubmissions = (submissions: Submission[]): void => {
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Error saving submissions to localStorage', e);
  }
};

export const addSubmission = async (newSub: Omit<Submission, 'id' | 'createdAt' | 'status' | 'teacherNotes' | 'syncedToGoogle'>): Promise<Submission> => {
  const current = getSubmissions();
  const created: Submission = {
    ...newSub,
    id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    status: 'new',
    teacherNotes: [],
    syncedToGoogle: false,
  };

  const updated = [created, ...current];
  saveSubmissions(updated);

  // Background sync attempt to Google Apps Script
  syncSingleSubmissionToGas(created).catch((err) => {
    console.log('Background sync scheduled / queued:', err);
  });

  return created;
};

export const updateSubmissionStatus = (id: string, status: CaseStatus, teacherNote?: string, authorName?: string): Submission | null => {
  const current = getSubmissions();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const item = { ...current[index], status };
  if (teacherNote && teacherNote.trim()) {
    const newNote: TeacherNote = {
      id: 'note-' + Date.now(),
      date: new Date().toISOString(),
      author: authorName || 'Giáo viên phụ trách',
      content: teacherNote.trim(),
    };
    item.teacherNotes = [newNote, ...(item.teacherNotes || [])];
  }

  current[index] = item;
  saveSubmissions(current);
  return item;
};

export const updateSubmissionPlan = (id: string, plan: string): Submission | null => {
  const current = getSubmissions();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;

  current[index] = { ...current[index], supportPlan: plan.trim() };
  saveSubmissions(current);
  return current[index];
};

export const deleteSubmission = (id: string): boolean => {
  const current = getSubmissions();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) return false;
  saveSubmissions(filtered);
  return true;
};

// Kind messages store
export const getKindMessages = (): KindMessage[] => {
  try {
    const raw = localStorage.getItem(KIND_MESSAGES_KEY);
    if (!raw) {
      localStorage.setItem(KIND_MESSAGES_KEY, JSON.stringify(INITIAL_KIND_MESSAGES));
      return INITIAL_KIND_MESSAGES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_KIND_MESSAGES;
  }
};

export const addKindMessage = (msg: Omit<KindMessage, 'id' | 'createdAt' | 'likes'>): KindMessage => {
  const current = getKindMessages();
  const newMsg: KindMessage = {
    ...msg,
    id: 'km-' + Date.now(),
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  const updated = [newMsg, ...current];
  localStorage.setItem(KIND_MESSAGES_KEY, JSON.stringify(updated));
  return newMsg;
};

export const likeKindMessage = (id: string): number => {
  const current = getKindMessages();
  const index = current.findIndex((m) => m.id === id);
  if (index === -1) return 0;
  current[index].likes = (current[index].likes || 0) + 1;
  localStorage.setItem(KIND_MESSAGES_KEY, JSON.stringify(current));
  return current[index].likes;
};

// Mapping helpers to match standard Vietnamese column values
export const getVietnameseEmotion = (emotionKey: string): string => {
  const map: Record<string, string> = {
    happy: 'Vui vẻ',
    sad: 'Buồn bã',
    anxious: 'Lo lắng',
    angry: 'Tức giận',
    speechless: 'Khó nói thành lời',
    just_listen: 'Mình chỉ muốn được lắng nghe',
  };
  return map[emotionKey] || emotionKey;
};

export const getVietnameseTopic = (topicKey: string): string => {
  const map: Record<string, string> = {
    friends: 'Bạn bè',
    study: 'Học tập',
    teachers: 'Thầy cô',
    family: 'Gia đình',
    worry: 'Điều khiến em lo lắng',
    joy: 'Điều em vui',
    other: 'Chuyện khác',
  };
  return map[topicKey] || topicKey;
};

export const getVietnameseSupport = (supportKey: string): string => {
  const map: Record<string, string> = {
    share_only: 'Em muốn chia sẻ',
    chat: 'Em muốn được trò chuyện',
    urgent: 'Em cần thầy cô giúp đỡ sớm',
  };
  return map[supportKey] || supportKey;
};

export const getVietnameseStatus = (statusKey: string): string => {
  const map: Record<string, string> = {
    new: 'Mới tiếp nhận',
    reviewing: 'Đang xem xét',
    direct_chat: 'Cần trao đổi trực tiếp',
    helped: 'Đã hỗ trợ',
    closed: 'Đã đóng trường hợp',
  };
  return map[statusKey] || statusKey;
};

// Google Apps Script Sync Integration
// Exactly matching the 8 Google Sheet columns:
// Cột 1: Cảm Xúc
// Cột 2: Chủ Đề
// Cột 3: Mức Độ Hỗ Trợ
// Cột 4: Nội Dung Chia Sẻ
// Cột 5: Link Ghi Âm Drive
// Cột 6: Link Hình Ảnh Drive
// Cột 7: Link Hồ Sơ Drive
// Cột 8: Trạng Thái
export const syncSingleSubmissionToGas = async (sub: Submission): Promise<boolean> => {
  const url = getStoredGasUrl();
  if (!url) return false;

  const camXuc = getVietnameseEmotion(sub.emotion);
  const chuDe = getVietnameseTopic(sub.topic);
  const mucDoHoTro = getVietnameseSupport(sub.supportLevel);
  const trangThai = getVietnameseStatus(sub.status);

  // Prepare full readable message including student info
  const studentInfo = sub.isAnonymous
    ? `[Học sinh ẩn danh - ${sub.studentClass || 'Tiểu học'}]`
    : `[${sub.studentName} - ${sub.studentClass || 'Tiểu học'}]`;
  const noiDungChiaSe = `${studentInfo} ${sub.textMessage || ''}`.trim();

  const timestampStr = new Date(sub.createdAt).toISOString().replace(/[:.]/g, '-');
  const studentPrefix = (sub.isAnonymous ? 'AnDanh' : (sub.studentName || 'HocSinh')).replace(/\s+/g, '_');

  // Payload with full Base64 data so Google Apps Script DriveApp can create Drive files and links
  const payload = {
    action: 'newSubmission',
    id: sub.id,
    timestamp: sub.createdAt,
    studentName: sub.isAnonymous ? 'Học sinh ẩn danh' : sub.studentName,
    studentClass: sub.studentClass || 'Không ghi rõ',
    isAnonymous: sub.isAnonymous,

    // The 8 EXACT Vietnamese Columns for Google Sheet
    'Cảm Xúc': camXuc,
    'Chủ Đề': chuDe,
    'Mức Độ Hỗ Trợ': mucDoHoTro,
    'Nội Dung Chia Sẻ': noiDungChiaSe,
    'Link Ghi Âm Drive': '',
    'Link Hình Ảnh Drive': '',
    'Link Hồ Sơ Drive': `ID-${sub.id}`,
    'Trạng Thái': trangThai,

    // Standard ASCII parameter aliases for convenience
    camXuc,
    chuDe,
    mucDoHoTro,
    noiDungChiaSe,
    trangThai,

    // Audio file data for Google Drive creation
    audioBase64: sub.audioBase64 || '',
    audioFileName: `Ghi_Am_${studentPrefix}_${timestampStr}.webm`,
    audioMimeType: 'audio/webm',

    // Photo file data for Google Drive creation
    photoBase64: sub.photoUrl || '',
    photoFileName: `Hinh_Anh_${studentPrefix}_${timestampStr}.jpg`,
    photoMimeType: 'image/jpeg',

    // Extra flags
    sticker: sub.sticker || '',
    isUrgent: sub.supportLevel === 'urgent' || sub.isUrgentAlert,
  };

  try {
    // Post to Google Apps Script Web App
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // Mark as synced locally
    const current = getSubmissions();
    const idx = current.findIndex((s) => s.id === sub.id);
    if (idx !== -1) {
      current[idx].syncedToGoogle = true;
      saveSubmissions(current);
    }
    return true;
  } catch (error) {
    console.warn('Sync to Google Apps Script failed, will retry later:', error);
    return false;
  }
};

export const syncAllSubmissionsToGas = async (): Promise<{ success: number; failed: number }> => {
  const current = getSubmissions();
  let success = 0;
  let failed = 0;

  for (const item of current) {
    const ok = await syncSingleSubmissionToGas(item);
    if (ok) success++;
    else failed++;
  }

  return { success, failed };
};

// Export to CSV with UTF-8 BOM matching EXACTLY the 8 Sheet Columns:
// Cảm Xúc | Chủ Đề | Mức Độ Hỗ Trợ | Nội Dung Chia Sẻ | Link Ghi Âm Drive | Link Hình Ảnh Drive | Link Hồ Sơ Drive | Trạng Thái
export const exportSubmissionsToCsv = (submissions: Submission[], anonymize: boolean = false): void => {
  const header = [
    'Cảm Xúc',
    'Chủ Đề',
    'Mức Độ Hỗ Trợ',
    'Nội Dung Chia Sẻ',
    'Link Ghi Âm Drive',
    'Link Hình Ảnh Drive',
    'Link Hồ Sơ Drive',
    'Trạng Thái',
  ];

  const rows = submissions.map((s, index) => {
    const name = anonymize ? `Học sinh #${index + 1}` : (s.isAnonymous ? 'Học sinh ẩn danh' : s.studentName);
    const className = anonymize ? 'Lớp **' : (s.studentClass || 'Chưa ghi');
    const studentInfo = `[${name} - ${className}]`;
    const fullMessage = `${studentInfo} ${s.textMessage || ''}`.trim();

    return [
      `"${getVietnameseEmotion(s.emotion).replace(/"/g, '""')}"`,
      `"${getVietnameseTopic(s.topic).replace(/"/g, '""')}"`,
      `"${getVietnameseSupport(s.supportLevel).replace(/"/g, '""')}"`,
      `"${fullMessage.replace(/"/g, '""')}"`,
      s.audioBase64 ? `"Có tệp ghi âm (${s.audioDuration || 0}s)"` : '""',
      s.photoUrl ? '"Có tệp hình ảnh đính kèm"' : '""',
      `"HS-${s.id}"`,
      `"${getVietnameseStatus(s.status).replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `tram_cam_xuc_bang_tinh_${anonymize ? 'an_danh_' : ''}${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
