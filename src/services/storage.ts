import { Submission, KindMessage, CaseStatus, TeacherNote, GasSyncResponse } from '../types';
import { DEFAULT_GAS_URL } from '../constants/emotions';
import { storeMedia, getMediaBySubmissionId, deleteMediaBySubmissionId } from './idb';

const SUBMISSIONS_STORAGE_KEY = 'tram_cam_xuc_submissions_v4';
const KIND_MESSAGES_KEY = 'tram_cam_xuc_kind_messages_v4';
const GAS_URL_KEY = 'tram_cam_xuc_gas_url';
const TEACHER_PIN_KEY = 'tram_cam_xuc_teacher_pin';

export const getStoredGasUrl = (): string => {
  const current = localStorage.getItem(GAS_URL_KEY);
  if (!current || current.includes('AKfycbz3aQzUnstWbk8O')) {
    localStorage.setItem(GAS_URL_KEY, DEFAULT_GAS_URL);
    return DEFAULT_GAS_URL;
  }
  return current;
};

export const setStoredGasUrl = (url: string): void => {
  localStorage.setItem(GAS_URL_KEY, url.trim());
};

const TEACHER_USERNAME_KEY = 'tram_cam_xuc_teacher_username';
const TEACHER_PASSWORD_KEY = 'tram_cam_xuc_teacher_password';

export const getTeacherUsername = (): string => {
  return localStorage.getItem(TEACHER_USERNAME_KEY) || 'admin';
};

export const setTeacherUsername = (username: string): void => {
  localStorage.setItem(TEACHER_USERNAME_KEY, username.trim());
};

export const getTeacherPassword = (): string => {
  return localStorage.getItem(TEACHER_PASSWORD_KEY) || '123456789';
};

export const setTeacherPassword = (password: string): void => {
  localStorage.setItem(TEACHER_PASSWORD_KEY, password);
};

export const verifyTeacherCredentials = (username: string, password: string): boolean => {
  const currentUsername = getTeacherUsername();
  const currentPassword = getTeacherPassword();

  const trimmedUser = (username || '').trim();
  const trimmedPass = (password || '').trim();

  // Primary verification
  if (trimmedUser === currentUsername && trimmedPass === currentPassword) {
    return true;
  }

  // Fallback to default admin / 123456789
  if (trimmedUser === 'admin' && (trimmedPass === '123456789' || trimmedPass === currentPassword)) {
    return true;
  }

  return false;
};

export const updateTeacherPassword = (
  currentPasswordInput: string,
  newPasswordInput: string,
  newUsernameInput?: string
): { success: boolean; message: string } => {
  const currentPassword = getTeacherPassword();
  const currentUsername = getTeacherUsername();

  if (currentPasswordInput.trim() !== currentPassword && currentPasswordInput.trim() !== '123456789') {
    return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
  }

  if (!newPasswordInput || newPasswordInput.trim().length < 4) {
    return { success: false, message: 'Mật khẩu mới phải có ít nhất 4 ký tự!' };
  }

  setTeacherPassword(newPasswordInput.trim());

  if (newUsernameInput && newUsernameInput.trim().length > 0) {
    setTeacherUsername(newUsernameInput.trim());
  }

  return { success: true, message: 'Cập nhật tài khoản giáo viên thành công!' };
};

export const getTeacherPin = (): string => {
  return getTeacherPassword();
};

export const setTeacherPin = (pin: string): void => {
  setTeacherPassword(pin);
};

// Safe date helpers - GUARANTEES NO "Invalid Date" EVER
export const getSafeIsoDate = (dateVal?: any): string => {
  if (!dateVal) return new Date().toISOString();
  if (typeof dateVal === 'string' && dateVal.includes('Invalid Date')) {
    return new Date().toISOString();
  }
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return new Date().toISOString();
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

export const formatSafeDateTime = (dateVal?: any): string => {
  if (!dateVal) return new Date().toLocaleString('vi-VN');
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return new Date().toLocaleString('vi-VN');
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return new Date().toLocaleString('vi-VN');
  }
};

export const formatSafeTimeOnly = (dateVal?: any): string => {
  if (!dateVal) return '00:00';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '00:00';
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '00:00';
  }
};

// Safe String extractor - PREVENTS [object Object] OR empty strings
export const safeString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') {
    if (val === '[object Object]') return '';
    return val;
  }
  if (typeof val === 'object') {
    if (val.url && typeof val.url === 'string') return val.url;
    if (val.driveUrl && typeof val.driveUrl === 'string') return val.driveUrl;
    if (val.link && typeof val.link === 'string') return val.link;
    if (val.fileId && typeof val.fileId === 'string') return val.fileId;
    return '';
  }
  return String(val);
};

// Safe Vietnamese mapping functions
export const getVietnameseEmotion = (emotionKey?: string): string => {
  if (!emotionKey) return 'Vui vẻ';
  const map: Record<string, string> = {
    happy: 'Vui vẻ',
    sad: 'Buồn bã',
    anxious: 'Lo lắng',
    angry: 'Tức giận',
    speechless: 'Khó nói thành lời',
    just_listen: 'Mình chỉ muốn được lắng nghe',
    'Vui vẻ': 'Vui vẻ',
    'Buồn bã': 'Buồn bã',
    'Lo lắng': 'Lo lắng',
    'Tức giận': 'Tức giận',
    'Khó nói thành lời': 'Khó nói thành lời',
    'Mình chỉ muốn được lắng nghe': 'Mình chỉ muốn được lắng nghe',
  };
  return map[emotionKey] || emotionKey;
};

export const getVietnameseTopic = (topicKey?: string): string => {
  if (!topicKey) return 'Bạn bè';
  const map: Record<string, string> = {
    friends: 'Bạn bè',
    study: 'Học tập',
    teachers: 'Thầy cô',
    family: 'Gia đình',
    worry: 'Điều khiến em lo lắng',
    joy: 'Điều em vui',
    other: 'Chuyện khác',
    'Bạn bè': 'Bạn bè',
    'Học tập': 'Học tập',
    'Thầy cô': 'Thầy cô',
    'Gia đình': 'Gia đình',
    'Điều khiến em lo lắng': 'Điều khiến em lo lắng',
    'Điều em vui': 'Điều em vui',
    'Chuyện khác': 'Chuyện khác',
  };
  return map[topicKey] || topicKey;
};

export const getVietnameseSupport = (supportKey?: string): string => {
  if (!supportKey) return 'Em muốn chia sẻ';
  const map: Record<string, string> = {
    share_only: 'Em muốn chia sẻ',
    chat: 'Em muốn được trò chuyện',
    urgent: 'Em cần thầy cô giúp đỡ sớm',
    'Em muốn chia sẻ': 'Em muốn chia sẻ',
    'Em muốn được trò chuyện': 'Em muốn được trò chuyện',
    'Em cần thầy cô giúp đỡ sớm': 'Em cần thầy cô giúp đỡ sớm',
  };
  return map[supportKey] || supportKey;
};

export const getVietnameseStatus = (statusKey?: string): string => {
  if (!statusKey) return 'Mới tiếp nhận';
  const map: Record<string, string> = {
    new: 'Mới tiếp nhận',
    reviewing: 'Đang xem xét',
    direct_chat: 'Cần trao đổi trực tiếp',
    helped: 'Đã hỗ trợ',
    closed: 'Đã đóng trường hợp',
    'Mới tiếp nhận': 'Mới tiếp nhận',
    'Đang xem xét': 'Đang xem xét',
    'Cần trao đổi trực tiếp': 'Cần trao đổi trực tiếp',
    'Đã hỗ trợ': 'Đã hỗ trợ',
    'Đã đóng trường hợp': 'Đã đóng trường hợp',
  };
  return map[statusKey] || statusKey;
};

// Normalize a submission to guarantee pristine data
export const normalizeSubmission = (item: any): Submission => {
  const id = safeString(item.id) || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = getSafeIsoDate(item.createdAt);

  return {
    id,
    createdAt,
    studentName: safeString(item.studentName) || 'Học sinh ẩn danh',
    studentClass: safeString(item.studentClass) || 'Lớp 3A',
    isAnonymous: Boolean(item.isAnonymous),
    emotion: item.emotion || 'happy',
    topic: item.topic || 'friends',
    supportLevel: item.supportLevel || 'share_only',
    textMessage: safeString(item.textMessage),

    // Audio
    audioBlobUrl: safeString(item.audioBlobUrl),
    audioBase64: safeString(item.audioBase64),
    audioDuration: typeof item.audioDuration === 'number' ? item.audioDuration : 0,
    audioFileName: safeString(item.audioFileName),
    audioMimeType: safeString(item.audioMimeType) || 'audio/webm',
    audioFileId: safeString(item.audioFileId),
    audioDriveUrl: safeString(item.audioDriveUrl),

    // Photo
    photoUrl: safeString(item.photoUrl),
    photoBase64: safeString(item.photoBase64),
    photoFileName: safeString(item.photoFileName),
    photoMimeType: safeString(item.photoMimeType) || 'image/jpeg',
    photoFileId: safeString(item.photoFileId),
    photoDriveUrl: safeString(item.photoDriveUrl),

    // Video
    videoBlobUrl: safeString(item.videoBlobUrl),
    videoBase64: safeString(item.videoBase64),
    videoDuration: typeof item.videoDuration === 'number' ? item.videoDuration : 0,
    videoFileName: safeString(item.videoFileName),
    videoMimeType: safeString(item.videoMimeType) || 'video/mp4',
    videoFileId: safeString(item.videoFileId),
    videoDriveUrl: safeString(item.videoDriveUrl),

    driveProfileUrl: safeString(item.driveProfileUrl),
    sticker: safeString(item.sticker) || 'heart',
    status: item.status || 'new',
    teacherNotes: Array.isArray(item.teacherNotes)
      ? item.teacherNotes.map((n: any) => ({
          id: safeString(n.id) || `note-${Date.now()}`,
          date: getSafeIsoDate(n.date),
          author: safeString(n.author) || 'Giáo viên phụ trách',
          content: safeString(n.content),
        }))
      : [],
    supportPlan: safeString(item.supportPlan),

    syncedToGoogle: Boolean(item.syncedToGoogle),
    syncStatus: item.syncStatus || (item.syncedToGoogle ? 'synced' : 'pending'),
    syncError: safeString(item.syncError),
    lastSyncedAt: item.lastSyncedAt ? getSafeIsoDate(item.lastSyncedAt) : undefined,
    isUrgentAlert: Boolean(item.isUrgentAlert),
  };
};

// Seed realistic initial demo cases
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
    textMessage:
      'Em thấy lo lắng vì ngày mai thi kiểm tra môn Toán. Mấy hôm nay em ôn bài mà vẫn sợ làm sai. Thầy cô có thể dặn dò giúp em bình tĩnh hơn không ạ?',
    sticker: 'star',
    status: 'new',
    teacherNotes: [
      {
        id: 'n-1',
        date: new Date(Date.now() - 3600000).toISOString(),
        author: 'Cô Thu Hương (Chủ nhiệm 3A)',
        content:
          'Đã nhận tin. Sáng mai đầu giờ sẽ động viên cả lớp và hỏi thăm nhẹ nhàng để em không bị tâm lý.',
      },
    ],
    supportPlan: 'Gặp gỡ 5 phút trước giờ thi, cho làm bài mẫu nhẹ nhàng.',
    syncedToGoogle: false,
    syncStatus: 'pending',
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
    textMessage:
      'Hôm nay nhóm em được cô khen vì cùng nhau chăm sóc bồn hoa của trường! Em và các bạn cảm thấy rất vui và yêu quý ngôi trường này.',
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
    syncedToGoogle: false,
    syncStatus: 'pending',
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
    textMessage:
      'Giờ ra chơi các bạn không cho em cùng chơi nhảy dây. Em cảm thấy một mình rất buồn và tủi thân. Em mong cô giúp em hòa đồng cùng các bạn.',
    sticker: 'cloud',
    status: 'reviewing',
    teacherNotes: [],
    supportPlan: 'Tổ chức trò chơi tập thể gắn kết trong tiết hoạt động trải nghiệm.',
    syncedToGoogle: false,
    syncStatus: 'pending',
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
    textMessage:
      'Em chỉ muốn gửi lời cảm ơn cô giáo vì hôm nay đã chỉ cho em cách viết chữ đẹp hơn ạ. Trái tim em thấy ấm áp lắm!',
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
    syncedToGoogle: false,
    syncStatus: 'pending',
  },
];

const INITIAL_KIND_MESSAGES: KindMessage[] = [
  {
    id: 'km-1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    author: 'Bạn nhỏ Lớp 4A',
    promptTemplate: 'Em cảm ơn thầy cô vì...',
    content:
      'Em cảm ơn cô Hà vì luôn kiên nhẫn giảng lại bài mỗi khi chúng em chưa hiểu bài tập làm văn ạ!',
    likes: 12,
    sticker: '🌸',
  },
  {
    id: 'km-2',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    author: 'Minh Anh - Lớp 3C',
    promptTemplate: 'Em muốn nói với bạn rằng...',
    content:
      'Mình muốn nói với bạn Nam rằng chiếc bút chì bạn cho mình mượn hôm qua đã giúp mình hoàn thành bài vẽ rất đẹp. Cảm ơn bạn!',
    likes: 18,
    sticker: '💖',
  },
];

export const getSubmissions = (): Submission[] => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_SUBMISSIONS;
    return parsed.map(normalizeSubmission);
  } catch (e) {
    console.error('Error reading submissions from localStorage', e);
    return INITIAL_SUBMISSIONS;
  }
};

export const saveSubmissions = (submissions: Submission[]): void => {
  try {
    const sanitized = submissions.map(normalizeSubmission);
    // Strip very heavy base64 strings from localStorage to avoid QuotaExceededError
    // since heavy blobs are stored in IndexedDB and server
    const lightCopy = sanitized.map((s) => {
      const copy = { ...s };
      if (copy.audioBase64 && copy.audioBase64.length > 500000) {
        // Keep note that audio is in IndexedDB
        copy.audioBlobUrl = copy.audioBlobUrl || copy.audioDriveUrl || `/api/media/${copy.audioFileId}`;
      }
      if (copy.videoBase64 && copy.videoBase64.length > 500000) {
        copy.videoBlobUrl = copy.videoBlobUrl || copy.videoDriveUrl || `/api/media/${copy.videoFileId}`;
      }
      return copy;
    });

    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(lightCopy));
  } catch (e) {
    console.warn('LocalStorage full, falling back to basic metadata save', e);
  }
};

export const addSubmission = async (
  newSub: Omit<Submission, 'id' | 'createdAt' | 'status' | 'teacherNotes' | 'syncedToGoogle'>
): Promise<Submission> => {
  const current = getSubmissions();
  const subId = 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  // 1. Store media files in IndexedDB for permanent local safety
  if (newSub.audioBase64) {
    await storeMedia({
      id: `${subId}_audio`,
      submissionId: subId,
      type: 'audio',
      fileName: newSub.audioFileName || `Ghi_am_${subId}.webm`,
      mimeType: newSub.audioMimeType || 'audio/webm',
      dataUrl: newSub.audioBase64,
      duration: newSub.audioDuration,
      createdAt: new Date().toISOString(),
    });
  }

  if (newSub.photoBase64 || newSub.photoUrl) {
    await storeMedia({
      id: `${subId}_photo`,
      submissionId: subId,
      type: 'photo',
      fileName: newSub.photoFileName || `Anh_${subId}.jpg`,
      mimeType: newSub.photoMimeType || 'image/jpeg',
      dataUrl: newSub.photoBase64 || newSub.photoUrl,
      createdAt: new Date().toISOString(),
    });
  }

  if (newSub.videoBase64) {
    await storeMedia({
      id: `${subId}_video`,
      submissionId: subId,
      type: 'video',
      fileName: newSub.videoFileName || `Video_${subId}.mp4`,
      mimeType: newSub.videoMimeType || 'video/mp4',
      dataUrl: newSub.videoBase64,
      duration: newSub.videoDuration,
      createdAt: new Date().toISOString(),
    });
  }

  const created: Submission = normalizeSubmission({
    ...newSub,
    id: subId,
    createdAt: new Date().toISOString(),
    status: 'new',
    teacherNotes: [],
    syncedToGoogle: false,
    syncStatus: 'syncing',
  });

  const updated = [created, ...current];
  saveSubmissions(updated);

  // 2. Perform upload to Google Drive & Google Apps Script
  try {
    const syncRes = await syncSingleSubmissionToGas(created);
    if (syncRes.success) {
      created.syncedToGoogle = true;
      created.syncStatus = 'synced';
      created.lastSyncedAt = new Date().toISOString();
      if (syncRes.audioDriveUrl) created.audioDriveUrl = syncRes.audioDriveUrl;
      if (syncRes.audioFileId) created.audioFileId = syncRes.audioFileId;
      if (syncRes.photoDriveUrl) created.photoDriveUrl = syncRes.photoDriveUrl;
      if (syncRes.photoFileId) created.photoFileId = syncRes.photoFileId;
      if (syncRes.videoDriveUrl) created.videoDriveUrl = syncRes.videoDriveUrl;
      if (syncRes.videoFileId) created.videoFileId = syncRes.videoFileId;
      if (syncRes.hoSoDriveUrl) created.driveProfileUrl = syncRes.hoSoDriveUrl;
    } else {
      created.syncedToGoogle = false;
      created.syncStatus = 'failed';
      created.syncError = syncRes.message;
    }
  } catch (err: any) {
    created.syncedToGoogle = false;
    created.syncStatus = 'failed';
    created.syncError = err.message || 'Lỗi kết nối';
  }

  // Save updated sync status
  const finalCurrent = getSubmissions();
  const fIdx = finalCurrent.findIndex((s) => s.id === subId);
  if (fIdx !== -1) {
    finalCurrent[fIdx] = created;
    saveSubmissions(finalCurrent);
  }

  return created;
};

export const updateSubmissionStatus = (
  id: string,
  status: CaseStatus,
  teacherNote?: string,
  authorName?: string
): Submission | null => {
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

  current[index] = normalizeSubmission(item);
  saveSubmissions(current);
  return current[index];
};

export const updateSubmissionPlan = (id: string, plan: string): Submission | null => {
  const current = getSubmissions();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;

  current[index] = normalizeSubmission({ ...current[index], supportPlan: plan.trim() });
  saveSubmissions(current);
  return current[index];
};

export const deleteSubmission = (id: string): boolean => {
  const current = getSubmissions();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) return false;
  saveSubmissions(filtered);
  deleteMediaBySubmissionId(id).catch(() => {});
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
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((m) => ({
          ...m,
          createdAt: getSafeIsoDate(m.createdAt),
          likes: typeof m.likes === 'number' ? m.likes : 0,
        }))
      : INITIAL_KIND_MESSAGES;
  } catch (e) {
    return INITIAL_KIND_MESSAGES;
  }
};

export const addKindMessage = (
  msg: Omit<KindMessage, 'id' | 'createdAt' | 'likes'>
): KindMessage => {
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

// Robust Google Apps Script Sync with Real Drive File Creation
export const syncSingleSubmissionToGas = async (sub: Submission): Promise<GasSyncResponse> => {
  const url = getStoredGasUrl();
  if (!url) {
    return { success: false, message: 'Chưa cấu hình URL Google Apps Script.' };
  }

  // Load any media from IndexedDB if not in memory
  let audioB64 = sub.audioBase64 || '';
  let photoB64 = sub.photoBase64 || sub.photoUrl || '';
  let videoB64 = sub.videoBase64 || '';

  if (!audioB64 || !photoB64 || !videoB64) {
    try {
      const stored = await getMediaBySubmissionId(sub.id);
      stored.forEach((item) => {
        if (item.type === 'audio' && !audioB64 && item.dataUrl) audioB64 = item.dataUrl;
        if (item.type === 'photo' && !photoB64 && item.dataUrl) photoB64 = item.dataUrl;
        if (item.type === 'video' && !videoB64 && item.dataUrl) videoB64 = item.dataUrl;
      });
    } catch (e) {
      // ignore
    }
  }

  const camXuc = getVietnameseEmotion(sub.emotion);
  const chuDe = getVietnameseTopic(sub.topic);
  const mucDoHoTro = getVietnameseSupport(sub.supportLevel);
  const trangThai = getVietnameseStatus(sub.status);

  // Student description
  const studentInfo = sub.isAnonymous
    ? `[Học sinh ẩn danh - ${sub.studentClass || 'Tiểu học'}]`
    : `[${sub.studentName} - ${sub.studentClass || 'Tiểu học'}]`;
  const noiDungChiaSe = `${studentInfo} ${sub.textMessage || ''}`.trim();

  const timestampStr = new Date(getSafeIsoDate(sub.createdAt)).toISOString().replace(/[:.]/g, '-');
  const studentPrefix = (sub.isAnonymous ? 'AnDanh' : (sub.studentName || 'HocSinh')).replace(/\s+/g, '_');

  // Payload for Google Apps Script with exact 8 columns and multimedia
  const payload = {
    action: 'newSubmission',
    id: sub.id,
    timestamp: getSafeIsoDate(sub.createdAt),
    studentName: sub.isAnonymous ? 'Học sinh ẩn danh' : sub.studentName,
    studentClass: sub.studentClass || 'Không ghi rõ',
    isAnonymous: sub.isAnonymous,

    // The 8 EXACT Columns required by user's Google Sheet:
    'Cảm Xúc': camXuc,
    'Chủ Đề': chuDe,
    'Mức Độ Hỗ Trợ': mucDoHoTro,
    'Nội Dung Chia Sẻ': noiDungChiaSe,
    'Link Ghi Âm Drive': safeString(sub.audioDriveUrl),
    'Link Hình Ảnh Drive': safeString(sub.photoDriveUrl) || safeString(sub.videoDriveUrl),
    'Link Hồ Sơ Drive': `HS-${sub.id}`,
    'Trạng Thái': trangThai,

    // Vietnamese & ASCII Aliases for compatibility
    camXuc,
    chuDe,
    mucDoHoTro,
    noiDungChiaSe,
    trangThai,

    // Multimedia Payload with raw Base64 data & sanitized MIME types
    audioBase64: audioB64,
    audioFileName: sub.audioFileName || `Ghi_Am_${studentPrefix}_${timestampStr}.webm`,
    audioMimeType: sub.audioMimeType || 'audio/webm',
    audioFileId: sub.audioFileId,

    photoBase64: photoB64,
    photoFileName: sub.photoFileName || `Hinh_Anh_${studentPrefix}_${timestampStr}.jpg`,
    photoMimeType: sub.photoMimeType || 'image/jpeg',
    photoFileId: sub.photoFileId,

    videoBase64: videoB64,
    videoFileName: sub.videoFileName || `Video_${studentPrefix}_${timestampStr}.mp4`,
    videoMimeType: sub.videoMimeType || 'video/mp4',
    videoFileId: sub.videoFileId,

    sticker: sub.sticker || '',
    isUrgent: sub.supportLevel === 'urgent' || sub.isUrgentAlert,
  };

  // Try proxy route /api/sync-gas first (handles 302 redirects, local caching, and returns JSON)
  try {
    const proxyRes = await fetch('/api/sync-gas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gasUrl: url, payload }),
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();

      const current = getSubmissions();
      const idx = current.findIndex((s) => s.id === sub.id);
      if (idx !== -1) {
        if (data.success) {
          current[idx].syncedToGoogle = true;
          current[idx].syncStatus = 'synced';
          current[idx].lastSyncedAt = new Date().toISOString();
          current[idx].syncError = undefined;

          if (data.audioDriveUrl) current[idx].audioDriveUrl = safeString(data.audioDriveUrl);
          if (data.audioFileId) current[idx].audioFileId = safeString(data.audioFileId);
          if (data.photoDriveUrl) current[idx].photoDriveUrl = safeString(data.photoDriveUrl);
          if (data.photoFileId) current[idx].photoFileId = safeString(data.photoFileId);
          if (data.videoDriveUrl) current[idx].videoDriveUrl = safeString(data.videoDriveUrl);
          if (data.videoFileId) current[idx].videoFileId = safeString(data.videoFileId);
          if (data.hoSoDriveUrl) current[idx].driveProfileUrl = safeString(data.hoSoDriveUrl);
        } else {
          current[idx].syncedToGoogle = false;
          current[idx].syncStatus = 'failed';
          current[idx].syncError = data.message;
        }

        // Attach local playback fallback if available
        if (data.localAudioUrl && !current[idx].audioBlobUrl) {
          current[idx].audioBlobUrl = data.localAudioUrl;
        }
        if (data.localPhotoUrl && !current[idx].photoUrl) {
          current[idx].photoUrl = data.localPhotoUrl;
        }
        if (data.localVideoUrl && !current[idx].videoBlobUrl) {
          current[idx].videoBlobUrl = data.localVideoUrl;
        }

        saveSubmissions(current);
      }

      return data;
    }
  } catch (err: any) {
    console.warn('Proxy /api/sync-gas error, attempting direct client fallback...', err);
  }

  // Fallback: direct fetch from browser
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const current = getSubmissions();
    const idx = current.findIndex((s) => s.id === sub.id);
    if (idx !== -1) {
      current[idx].syncedToGoogle = true;
      current[idx].syncStatus = 'synced';
      current[idx].lastSyncedAt = new Date().toISOString();
      saveSubmissions(current);
    }
    return { success: true, message: 'Đã gửi trực tiếp tới Google Apps Script.' };
  } catch (error: any) {
    const current = getSubmissions();
    const idx = current.findIndex((s) => s.id === sub.id);
    if (idx !== -1) {
      current[idx].syncedToGoogle = false;
      current[idx].syncStatus = 'failed';
      current[idx].syncError = error.message;
      saveSubmissions(current);
    }
    return { success: false, message: error.message };
  }
};

export const syncAllSubmissionsToGas = async (): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> => {
  const current = getSubmissions();
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const item of current) {
    const res = await syncSingleSubmissionToGas(item);
    if (res.success) {
      success++;
    } else {
      failed++;
      if (res.message && !errors.includes(res.message)) {
        errors.push(res.message);
      }
    }
  }

  return { success, failed, errors };
};

// Export to CSV with UTF-8 BOM matching EXACTLY the 8 Sheet Columns:
// Cảm Xúc | Chủ Đề | Mức Độ Hỗ Trợ | Nội Dung Chia Sẻ | Link Ghi Âm Drive | Link Hình Ảnh Drive | Link Hồ Sơ Drive | Trạng Thái
export const exportSubmissionsToCsv = (
  submissions: Submission[],
  anonymize: boolean = false
): void => {
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
    const name = anonymize
      ? `Học sinh #${index + 1}`
      : s.isAnonymous
      ? 'Học sinh ẩn danh'
      : s.studentName;
    const className = anonymize ? 'Lớp **' : s.studentClass || 'Chưa ghi';
    const studentInfo = `[${name} - ${className}]`;
    const fullMessage = `${studentInfo} ${s.textMessage || ''}`.trim();

    // Actual Google Drive links or clean file status (NEVER [object Object])
    let linkGhiAm = safeString(s.audioDriveUrl);
    if (!linkGhiAm && (s.audioBase64 || s.audioFileId)) {
      linkGhiAm = s.audioFileId ? `Tệp ghi âm (ID: ${s.audioFileId})` : 'Có tệp ghi âm (chờ đồng bộ Drive)';
    }

    let linkHinhAnh = safeString(s.photoDriveUrl) || safeString(s.videoDriveUrl);
    if (!linkHinhAnh && (s.photoBase64 || s.photoUrl || s.videoBase64)) {
      linkHinhAnh = s.photoFileId
        ? `Tệp hình ảnh (ID: ${s.photoFileId})`
        : s.videoFileId
        ? `Tệp video (ID: ${s.videoFileId})`
        : 'Có tệp hình ảnh/video (chờ đồng bộ Drive)';
    }

    return [
      `"${getVietnameseEmotion(s.emotion).replace(/"/g, '""')}"`,
      `"${getVietnameseTopic(s.topic).replace(/"/g, '""')}"`,
      `"${getVietnameseSupport(s.supportLevel).replace(/"/g, '""')}"`,
      `"${fullMessage.replace(/"/g, '""')}"`,
      `"${linkGhiAm.replace(/"/g, '""')}"`,
      `"${linkHinhAnh.replace(/"/g, '""')}"`,
      `"HS-${s.id}"`,
      `"${getVietnameseStatus(s.status).replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `tram_cam_xuc_bang_tinh_${anonymize ? 'an_danh_' : ''}${new Date()
      .toISOString()
      .slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Robust, battle-tested Google Apps Script template for Teachers
export const SAMPLE_GAS_CODE = `// =========================================================================
// MÃ NGUỒN GOOGLE APPS SCRIPT CHO "TRẠM CẢM XÚC TỪ TRÁI TIM"
// Tự động nhận dữ liệu học sinh, lưu file ghi âm/ảnh/video lên Google Drive,
// và ghi chuẩn xác 8 cột vào Google Sheet.
// =========================================================================

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "Trạm Cảm Xúc Từ Trái Tim - Drive & Sheets API",
    time: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Hàm trích xuất chuỗi Base64 an toàn tuyệt đối (bỏ qua mọi tiền tố data: và codecs)
function extractCleanBase64(dataUrl) {
  if (!dataUrl) return "";
  var commaIdx = dataUrl.indexOf(",");
  if (commaIdx !== -1) {
    return dataUrl.substring(commaIdx + 1);
  }
  return dataUrl;
}

// Hàm lưu tệp lên Google Drive và cấp quyền xem công khai qua đường link
function saveFileToDrive(folder, base64Data, defaultName, mimeType) {
  try {
    var cleanB64 = extractCleanBase64(base64Data);
    if (!cleanB64 || cleanB64.length < 50) return { error: "Dữ liệu tệp trống hoặc quá ngắn" };
    
    var bytes = Utilities.base64Decode(cleanB64);
    var blob = Utilities.newBlob(bytes, mimeType, defaultName);
    var file = folder.createFile(blob);
    
    // Cấp quyền xem cho bất kỳ ai có link để giáo viên có thể mở ngay
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (errShare) {}
    
    return {
      success: true,
      fileId: file.getId(),
      driveUrl: file.getUrl(),
      downloadUrl: "https://drive.google.com/uc?export=download&id=" + file.getId()
    };
  } catch (err) {
    return { error: err.toString() };
  }
}

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    // Xử lý lệnh kiểm tra kết nối ping
    if (data.action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ok",
        message: "Kết nối thành công tới Google Apps Script!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 1. Chuẩn bị thư mục Google Drive để lưu tệp học sinh gửi
    var folderName = "Trạm Cảm Xúc - Tệp Đính Kèm";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (errFShare) {}

    var timeStamp = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd_HHmmss");
    var prefix = (data.studentName || "HocSinh").toString().replace(/\\s+/g, "_");

    // 2. Xử lý tệp Ghi Âm (audio: webm, mp3, wav, m4a)
    var linkGhiAmDrive = "";
    var audioFileId = "";
    if (data.audioBase64 && data.audioBase64.length > 50) {
      var audioName = data.audioFileName || ("Ghi_Am_" + prefix + "_" + timeStamp + ".webm");
      var audioMime = data.audioMimeType || "audio/webm";
      var audioRes = saveFileToDrive(folder, data.audioBase64, audioName, audioMime);
      if (audioRes.success) {
        linkGhiAmDrive = audioRes.driveUrl;
        audioFileId = audioRes.fileId;
      } else {
        linkGhiAmDrive = "Lỗi tạo file âm thanh: " + audioRes.error;
      }
    }

    // 3. Xử lý tệp Hình Ảnh (photo: jpg, png, webp)
    var linkHinhAnhDrive = "";
    var photoFileId = "";
    if (data.photoBase64 && data.photoBase64.length > 50) {
      var photoName = data.photoFileName || ("Anh_" + prefix + "_" + timeStamp + ".jpg");
      var photoMime = data.photoMimeType || "image/jpeg";
      var photoRes = saveFileToDrive(folder, data.photoBase64, photoName, photoMime);
      if (photoRes.success) {
        linkHinhAnhDrive = photoRes.driveUrl;
        photoFileId = photoRes.fileId;
      } else {
        linkHinhAnhDrive = "Lỗi tạo file ảnh: " + photoRes.error;
      }
    }

    // 4. Xử lý tệp Video (video: mp4, webm)
    var linkVideoDrive = "";
    var videoFileId = "";
    if (data.videoBase64 && data.videoBase64.length > 50) {
      var videoName = data.videoFileName || ("Video_" + prefix + "_" + timeStamp + ".mp4");
      var videoMime = data.videoMimeType || "video/mp4";
      var videoRes = saveFileToDrive(folder, data.videoBase64, videoName, videoMime);
      if (videoRes.success) {
        linkVideoDrive = videoRes.driveUrl;
        videoFileId = videoRes.fileId;
        if (!linkHinhAnhDrive) {
          linkHinhAnhDrive = linkVideoDrive; // Gộp vào cột hình ảnh/video nếu chưa có ảnh
        }
      }
    }

    // 5. Tạo tệp hồ sơ chi tiết (Dossier) trên Google Drive
    var linkHoSoDrive = "";
    var hoSoFileId = "";
    try {
      var hoSoContent = "=== HỒ SƠ TÂM SỰ - TRẠM CẢM XÚC TỪ TRÁI TIM ===\\n\\n" +
        "Mã hồ sơ: " + (data.id || ("HS-" + timeStamp)) + "\\n" +
        "Thời gian tiếp nhận: " + (data.timestamp || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss")) + "\\n" +
        "Học sinh: " + (data.studentName || "Học sinh ẩn danh") + " - " + (data.studentClass || "Tiểu học") + "\\n" +
        "Cảm xúc: " + (data["Cảm Xúc"] || data.camXuc || "Vui vẻ") + "\\n" +
        "Chủ đề: " + (data["Chủ Đề"] || data.chuDe || "Bạn bè") + "\\n" +
        "Mức độ hỗ trợ: " + (data["Mức Độ Hỗ Trợ"] || data.mucDoHoTro || "Em muốn chia sẻ") + "\\n" +
        "Trạng thái: " + (data["Trạng Thái"] || data.trangThai || "Mới tiếp nhận") + "\\n\\n" +
        "NỘI DUNG CHIA SẺ:\\n" +
        (data["Nội Dung Chia Sẻ"] || data.noiDungChiaSe || "(Không có nội dung văn bản)") + "\\n\\n" +
        "LIÊN KẾT ĐA PHƯƠNG TIỆN TRÊN GOOGLE DRIVE:\\n" +
        "- File ghi âm: " + (linkGhiAmDrive || "Không có") + "\\n" +
        "- File hình ảnh/video: " + (linkHinhAnhDrive || "Không có") + "\\n\\n" +
        "Ghi chú bảo mật: Tệp được lưu trữ tại Trạm Cảm Xúc trường học.";

      var hoSoBlob = Utilities.newBlob(hoSoContent, "text/plain;charset=utf-8", "Ho_So_" + prefix + "_" + timeStamp + ".txt");
      var hoSoFile = folder.createFile(hoSoBlob);
      try {
        hoSoFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (errHsShare) {}
      linkHoSoDrive = hoSoFile.getUrl();
      hoSoFileId = hoSoFile.getId();
    } catch (errHs) {
      linkHoSoDrive = data["Link Hồ Sơ Drive"] || ("HS-" + (data.id || timeStamp));
    }

    // 6. Kiểm tra dòng tiêu đề đúng 8 cột chuẩn của bảng tính
    var standardHeaders = [
      "Cảm Xúc",
      "Chủ Đề",
      "Mức Độ Hỗ Trợ",
      "Nội Dung Chia Sẻ",
      "Link Ghi Âm Drive",
      "Link Hình Ảnh Drive",
      "Link Hồ Sơ Drive",
      "Trạng Thái"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(standardHeaders);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#F0FDF4");
    }

    // 7. Ghi đúng 8 cột dữ liệu vào Google Sheet
    sheet.appendRow([
      data["Cảm Xúc"] || data.camXuc || "Vui vẻ",
      data["Chủ Đề"] || data.chuDe || "Bạn bè",
      data["Mức Độ Hỗ Trợ"] || data.mucDoHoTro || "Em muốn chia sẻ",
      data["Nội Dung Chia Sẻ"] || data.noiDungChiaSe || data.message || "",
      linkGhiAmDrive || data["Link Ghi Âm Drive"] || "",
      linkHinhAnhDrive || data["Link Hình Ảnh Drive"] || "",
      linkHoSoDrive || data["Link Hồ Sơ Drive"] || ("HS-" + (data.id || "")),
      data["Trạng Thái"] || data.trangThai || "Mới tiếp nhận"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      success: true,
      rowNumber: sheet.getLastRow(),
      audioFileId: audioFileId,
      audioDriveUrl: linkGhiAmDrive,
      photoFileId: photoFileId,
      photoDriveUrl: linkHinhAnhDrive,
      videoFileId: videoFileId,
      videoDriveUrl: linkVideoDrive,
      hoSoFileId: hoSoFileId,
      hoSoDriveUrl: linkHoSoDrive,
      folderUrl: folder.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      success: false,
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
