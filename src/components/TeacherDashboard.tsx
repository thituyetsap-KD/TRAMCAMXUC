import React, { useState, useRef, useEffect } from 'react';
import { Submission, CaseStatus } from '../types';
import { EMOTIONS, TOPICS } from '../constants/emotions';
import {
  exportSubmissionsToCsv,
  syncAllSubmissionsToGas,
  syncSingleSubmissionToGas,
  getStoredGasUrl,
  setStoredGasUrl,
  formatSafeDateTime,
  formatSafeTimeOnly,
  getVietnameseEmotion,
  getVietnameseTopic,
  getVietnameseSupport,
  getVietnameseStatus,
  safeString,
  SAMPLE_GAS_CODE,
} from '../services/storage';
import {
  ShieldAlert,
  Inbox,
  BarChart3,
  Search,
  Filter,
  Download,
  RefreshCw,
  Trash2,
  FileText,
  Volume2,
  Image as ImageIcon,
  Video,
  CheckCircle,
  Clock,
  MessageSquare,
  Lock,
  LogOut,
  Sparkles,
  ExternalLink,
  Code2,
  Copy,
  Eye,
  X,
  Play,
  Pause,
  AlertCircle,
  CloudUpload,
  CloudCheck,
  KeyRound,
} from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';

interface TeacherDashboardProps {
  submissions: Submission[];
  onUpdateStatus: (id: string, status: CaseStatus, note?: string, author?: string) => void;
  onUpdatePlan: (id: string, plan: string) => void;
  onDeleteSubmission: (id: string) => void;
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  submissions,
  onUpdateStatus,
  onUpdatePlan,
  onDeleteSubmission,
  onLogout,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmotion, setFilterEmotion] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);
  const [filterMediaType, setFilterMediaType] = useState<'all' | 'audio' | 'photo' | 'video'>('all');

  // New note form state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('Cô Lan (Tư vấn học đường)');
  const [editingPlan, setEditingPlan] = useState('');

  // Audio player state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDurationTime, setAudioDurationTime] = useState(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Lightboxes
  const [viewingPhoto, setViewingPhoto] = useState<{ url: string; title: string; fileId?: string } | null>(null);
  const [viewingVideo, setViewingVideo] = useState<{ url: string; title: string; fileId?: string } | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [isSingleSyncing, setIsSingleSyncing] = useState(false);
  const [gasUrl, setGasUrl] = useState(getStoredGasUrl());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingGas, setIsTestingGas] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Statistics calculation
  const totalCount = submissions.length;
  const newCount = submissions.filter((s) => s.status === 'new').length;
  const urgentCount = submissions.filter((s) => s.supportLevel === 'urgent' || s.isUrgentAlert).length;
  const helpedCount = submissions.filter((s) => s.status === 'helped' || s.status === 'closed').length;

  // Emotion counts
  const emotionStats: Record<string, number> = {
    happy: 0,
    sad: 0,
    anxious: 0,
    angry: 0,
    speechless: 0,
    just_listen: 0,
  };
  submissions.forEach((s) => {
    if (emotionStats[s.emotion] !== undefined) {
      emotionStats[s.emotion]++;
    }
  });

  // Filtered submissions
  const filteredList = submissions.filter((item) => {
    if (filterUrgentOnly && item.supportLevel !== 'urgent' && !item.isUrgentAlert) return false;
    if (filterEmotion !== 'all' && item.emotion !== filterEmotion) return false;
    if (filterTopic !== 'all' && item.topic !== filterTopic) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;

    if (filterMediaType === 'audio' && !item.audioBase64 && !item.audioBlobUrl && !item.audioDriveUrl) return false;
    if (filterMediaType === 'photo' && !item.photoUrl && !item.photoBase64 && !item.photoDriveUrl) return false;
    if (filterMediaType === 'video' && !item.videoBase64 && !item.videoBlobUrl && !item.videoDriveUrl) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = (item.studentName || '').toLowerCase().includes(q);
      const matchClass = (item.studentClass || '').toLowerCase().includes(q);
      const matchText = (item.textMessage || '').toLowerCase().includes(q);
      if (!matchName && !matchClass && !matchText) return false;
    }
    return true;
  });

  const selectedCase = submissions.find((s) => s.id === selectedCaseId) || filteredList[0] || null;

  useEffect(() => {
    // Reset audio when case changes
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setPlayingAudioId(null);
    setAudioCurrentTime(0);
    setAudioDurationTime(0);
  }, [selectedCaseId]);

  const handleTogglePlayAudio = (subId: string, audioSrc?: string) => {
    if (!audioSrc) {
      alert('Không tìm thấy nguồn tệp âm thanh này.');
      return;
    }

    if (playingAudioId === subId && audioPlayerRef.current) {
      if (audioPlayerRef.current.paused) {
        audioPlayerRef.current.play();
      } else {
        audioPlayerRef.current.pause();
        setPlayingAudioId(null);
      }
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(audioSrc);
    audioPlayerRef.current = audio;

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setAudioDurationTime(audio.duration);
      }
    };

    audio.onended = () => {
      setPlayingAudioId(null);
      setAudioCurrentTime(0);
    };

    audio.onerror = () => {
      alert('Không thể phát tệp âm thanh trực tiếp. Thầy cô có thể bấm nút "Mở tệp Google Drive" hoặc "Tải tệp" để nghe nhé!');
      setPlayingAudioId(null);
    };

    audio.play().catch((e) => {
      console.warn('Playback error:', e);
      alert('Trình duyệt cần tương tác để phát âm thanh. Vui lòng bấm lại nút Phát.');
      setPlayingAudioId(null);
    });

    setPlayingAudioId(subId);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newNoteContent.trim()) return;
    onUpdateStatus(selectedCase.id, selectedCase.status, newNoteContent.trim(), newNoteAuthor.trim());
    setNewNoteContent('');
  };

  const handleSavePlan = () => {
    if (!selectedCase) return;
    onUpdatePlan(selectedCase.id, editingPlan);
    alert('Đã cập nhật kế hoạch hỗ trợ cho học sinh!');
  };

  const handleSyncAllNow = async () => {
    setIsSyncing(true);
    setSyncFeedback('Đang đồng bộ toàn bộ lời nhắn và tải tệp lên Google Drive...');
    const res = await syncAllSubmissionsToGas();
    setIsSyncing(false);
    if (res.failed === 0) {
      setSyncFeedback(`Đồng bộ thành công trọn vẹn ${res.success} mục lên Google Drive và Sheet!`);
    } else {
      setSyncFeedback(`Hoàn tất: ${res.success} thành công, ${res.failed} mục có lỗi (${res.errors.join('; ')})`);
    }
    setTimeout(() => setSyncFeedback(null), 6000);
  };

  const handleSyncSingleCase = async (item: Submission) => {
    setIsSingleSyncing(true);
    const res = await syncSingleSubmissionToGas(item);
    setIsSingleSyncing(false);
    if (res.success) {
      alert('Đồng bộ tệp của học sinh lên Google Drive và Sheet thành công!');
    } else {
      alert(`Đồng bộ chưa thành công: ${res.message || 'Lỗi kết nối'}`);
    }
  };

  const handleSaveGasUrl = () => {
    setStoredGasUrl(gasUrl);
    alert('Đã lưu cấu hình đường link Google Apps Script!');
  };

  const handleTestGasConnection = async () => {
    setIsTestingGas(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gasUrl: gasUrl.trim() }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, message: `Lỗi kết nối: ${err.message}` });
    } finally {
      setIsTestingGas(false);
    }
  };

  const copyAppsScript = () => {
    navigator.clipboard.writeText(SAMPLE_GAS_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const formatSeconds = (sec: number) => {
    const s = Math.round(sec || 0);
    const mins = Math.floor(s / 60);
    const remaining = s % 60;
    return `${mins}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Teacher Admin Console */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-full">
              Khu Vực Bảo Mật
            </span>
            <span className="text-xs text-slate-400">Dành riêng cho Ban Giám Hiệu & Giáo Viên</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Trang Quản Trị & Hỗ Trợ Học Sinh
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Tiếp nhận, lắng nghe ghi âm, xem ảnh, phân loại mức độ cần hỗ trợ và đồng bộ 8 cột dữ liệu vào Google Sheet và Drive.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Code2 className="w-4 h-4" />
            Cấu hình Google Sheet
          </button>

          <button
            onClick={handleSyncAllNow}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Google Drive'}
          </button>

          <button
            onClick={() => exportSubmissionsToCsv(submissions, false)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Xuất Excel/CSV (8 cột)
          </button>

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="px-3.5 py-2 bg-amber-600/90 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            Đổi mật khẩu
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Thoát
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalCount}</div>
            <div className="text-xs font-semibold text-slate-500">Tổng lượt tâm sự</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600">{newCount}</div>
            <div className="text-xs font-semibold text-slate-500">Mới tiếp nhận</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700">{urgentCount}</div>
            <div className="text-xs font-semibold text-slate-500">Cần giúp đỡ sớm</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{helpedCount}</div>
            <div className="text-xs font-semibold text-slate-500">Đã hỗ trợ xong</div>
          </div>
        </div>
      </div>

      {/* Main Workspace: 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter and Submissions List */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 md:p-5 border border-slate-200 shadow-sm space-y-4">
          {/* Search & Filter Header */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên học sinh, lớp hoặc nội dung..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 bg-slate-50"
              />
            </div>

            {/* Media Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterMediaType('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterMediaType === 'all' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tất cả ({submissions.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMediaType('audio')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  filterMediaType === 'audio' ? 'bg-white text-sky-900 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-sky-600" /> Ghi âm
              </button>
              <button
                type="button"
                onClick={() => setFilterMediaType('photo')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  filterMediaType === 'photo' ? 'bg-white text-purple-900 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" /> Ảnh
              </button>
              <button
                type="button"
                onClick={() => setFilterMediaType('video')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  filterMediaType === 'video' ? 'bg-white text-rose-900 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-rose-600" /> Video
              </button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={filterEmotion}
                onChange={(e) => setFilterEmotion(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="all">Tất cả cảm xúc</option>
                <option value="happy">😊 Vui vẻ</option>
                <option value="sad">😢 Buồn bã</option>
                <option value="anxious">😟 Lo lắng</option>
                <option value="angry">😡 Tức giận</option>
                <option value="speechless">😶 Khó nói</option>
                <option value="just_listen">💗 Chỉ muốn lắng nghe</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="new">Mới tiếp nhận</option>
                <option value="reviewing">Đang xem xét</option>
                <option value="direct_chat">Cần trao đổi</option>
                <option value="helped">Đã hỗ trợ</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-900 bg-amber-50/80 border border-amber-200 px-3 py-1.5 rounded-xl">
              <input
                type="checkbox"
                checked={filterUrgentOnly}
                onChange={(e) => setFilterUrgentOnly(e.target.checked)}
                className="rounded-sm text-amber-600 focus:ring-amber-500"
              />
              <span>Chỉ xem trường hợp cần giúp đỡ sớm (SOS)</span>
            </label>
          </div>

          {/* Submissions List View */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Không tìm thấy lời nhắn nào phù hợp với bộ lọc.
              </div>
            ) : (
              filteredList.map((item) => {
                const isSelected = selectedCase?.id === item.id;
                const emo = EMOTIONS[item.emotion] || EMOTIONS.happy;
                const isUrgent = item.supportLevel === 'urgent' || item.isUrgentAlert;
                const hasAudio = Boolean(item.audioBase64 || item.audioBlobUrl || item.audioDriveUrl);
                const hasPhoto = Boolean(item.photoUrl || item.photoBase64 || item.photoDriveUrl);
                const hasVideo = Boolean(item.videoBase64 || item.videoBlobUrl || item.videoDriveUrl);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/40 shadow-xs'
                        : isUrgent
                        ? 'border-amber-200 bg-amber-50/30 hover:bg-amber-50/60'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{emo.emoji}</span>
                        <div>
                          <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            <span>{item.isAnonymous ? 'Học sinh ẩn danh' : item.studentName}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                              {item.studentClass || 'Tiểu học'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatSafeTimeOnly(item.createdAt)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2 font-medium">
                      {item.textMessage || '(Học sinh gửi tin nhắn bằng tệp âm thanh, video hoặc ảnh)'}
                    </p>

                    {/* Media Badges & Drive Sync Indicator */}
                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1">
                        {isUrgent && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-black rounded-md text-[10px]">
                            SOS
                          </span>
                        )}
                        {hasAudio && (
                          <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 font-bold rounded-md text-[10px] flex items-center gap-0.5">
                            <Volume2 className="w-2.5 h-2.5" /> Ghi âm
                          </span>
                        )}
                        {hasPhoto && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 font-bold rounded-md text-[10px] flex items-center gap-0.5">
                            <ImageIcon className="w-2.5 h-2.5" /> Ảnh
                          </span>
                        )}
                        {hasVideo && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-md text-[10px] flex items-center gap-0.5">
                            <Video className="w-2.5 h-2.5" /> Video
                          </span>
                        )}
                        {item.audioDriveUrl || item.photoDriveUrl || item.videoDriveUrl ? (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md text-[10px] flex items-center gap-0.5" title="Đã có link Google Drive">
                            <CloudCheck className="w-2.5 h-2.5 text-emerald-600" /> Drive
                          </span>
                        ) : null}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'new'
                            ? 'bg-rose-100 text-rose-700'
                            : item.status === 'helped'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {getVietnameseStatus(item.status)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Details & Teacher Action Console */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-5">
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{EMOTIONS[selectedCase.emotion]?.emoji || '💖'}</span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        {selectedCase.isAnonymous ? 'Học sinh ẩn danh' : selectedCase.studentName}
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          {selectedCase.studentClass || 'Tiểu học'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Mã hồ sơ: <span className="font-mono font-bold text-slate-600">HS-{selectedCase.id}</span> • Gửi lúc {formatSafeDateTime(selectedCase.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Trạng thái:</span>
                  <select
                    value={selectedCase.status}
                    onChange={(e) => onUpdateStatus(selectedCase.id, e.target.value as CaseStatus)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="new">Mới tiếp nhận</option>
                    <option value="reviewing">Đang xem xét</option>
                    <option value="direct_chat">Cần trao đổi trực tiếp</option>
                    <option value="helped">Đã hỗ trợ</option>
                    <option value="closed">Đã đóng trường hợp</option>
                  </select>
                </div>
              </div>

              {/* Tags & Support Preference */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-pink-50 text-pink-800 font-bold border border-pink-200">
                  Cảm xúc: {getVietnameseEmotion(selectedCase.emotion)}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-bold border border-sky-200">
                  Chủ đề: {getVietnameseTopic(selectedCase.topic)}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold border ${
                    selectedCase.supportLevel === 'urgent'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  Mong muốn: {getVietnameseSupport(selectedCase.supportLevel)}
                </span>
              </div>

              {/* Message text content */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 mb-1">Nội dung học sinh chia sẻ:</div>
                <p className="text-sm text-slate-900 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedCase.textMessage || '(Học sinh không để lại tin nhắn chữ mà gửi tệp đa phương tiện)'}
                </p>
              </div>

              {/* 1. AUDIO SECTION: Dedicated audio player & Google Drive links */}
              {(selectedCase.audioBase64 || selectedCase.audioBlobUrl || selectedCase.audioDriveUrl) && (
                <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Volume2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-sky-950 flex items-center gap-2">
                          <span>Bản ghi âm giọng nói học sinh</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sky-200 text-sky-800 rounded">
                            {selectedCase.audioMimeType || 'audio/webm'}
                          </span>
                        </div>
                        <div className="text-xs text-sky-700">
                          Tệp: {selectedCase.audioFileName || `Ghi_am_${selectedCase.id}.webm`} • Thời lượng: {selectedCase.audioDuration || formatSeconds(audioDurationTime)}s
                          {selectedCase.audioFileId && (
                            <span className="ml-2 text-slate-500">ID: {selectedCase.audioFileId}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: Phát âm thanh, Mở Drive, Tải về */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePlayAudio(
                            selectedCase.id,
                            selectedCase.audioBlobUrl || selectedCase.audioBase64 || selectedCase.audioDriveUrl
                          )
                        }
                        className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                      >
                        {playingAudioId === selectedCase.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {playingAudioId === selectedCase.id ? 'Dừng phát' : 'Phát âm thanh'}
                      </button>

                      {selectedCase.audioDriveUrl && (
                        <a
                          href={selectedCase.audioDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-white hover:bg-sky-100 text-sky-800 border border-sky-300 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Mở tệp Google Drive
                        </a>
                      )}

                      {(selectedCase.audioBlobUrl || selectedCase.audioBase64) && (
                        <a
                          href={selectedCase.audioBlobUrl || selectedCase.audioBase64}
                          download={selectedCase.audioFileName || `Ghi_am_${selectedCase.id}.webm`}
                          className="px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold rounded-xl text-xs flex items-center gap-1"
                          title="Tải tệp âm thanh về máy tính"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Tải về
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Playback progress bar */}
                  {playingAudioId === selectedCase.id && (
                    <div className="space-y-1 pt-1">
                      <div className="w-full bg-sky-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-600 h-full transition-all duration-100"
                          style={{
                            width: `${audioDurationTime > 0 ? (audioCurrentTime / audioDurationTime) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-sky-700 font-mono font-bold">
                        <span>{formatSeconds(audioCurrentTime)}</span>
                        <span>{formatSeconds(audioDurationTime || selectedCase.audioDuration || 0)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. PHOTO SECTION: Dedicated image preview, modal, & Drive links */}
              {(selectedCase.photoUrl || selectedCase.photoBase64 || selectedCase.photoDriveUrl) && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-purple-950 flex items-center gap-2">
                          <span>Hình ảnh học sinh đính kèm</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded">
                            {selectedCase.photoMimeType || 'image/jpeg'}
                          </span>
                        </div>
                        <div className="text-xs text-purple-700">
                          Tệp: {selectedCase.photoFileName || `Anh_${selectedCase.id}.jpg`}
                          {selectedCase.photoFileId && (
                            <span className="ml-2 text-slate-500">ID: {selectedCase.photoFileId}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setViewingPhoto({
                            url: selectedCase.photoUrl || selectedCase.photoBase64 || selectedCase.photoDriveUrl || '',
                            title: `Ảnh của ${selectedCase.isAnonymous ? 'Học sinh ẩn danh' : selectedCase.studentName}`,
                            fileId: selectedCase.photoFileId,
                          })
                        }
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-4 h-4" />
                        Xem ảnh
                      </button>

                      {selectedCase.photoDriveUrl && (
                        <a
                          href={selectedCase.photoDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-white hover:bg-purple-100 text-purple-800 border border-purple-300 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Mở tệp Google Drive
                        </a>
                      )}

                      {(selectedCase.photoUrl || selectedCase.photoBase64) && (
                        <a
                          href={selectedCase.photoUrl || selectedCase.photoBase64}
                          download={selectedCase.photoFileName || `Hinh_anh_${selectedCase.id}.jpg`}
                          className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl text-xs flex items-center gap-1"
                          title="Tải ảnh về máy tính"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Tải về
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail preview */}
                  {(selectedCase.photoUrl || selectedCase.photoBase64) && (
                    <div className="relative rounded-xl overflow-hidden border border-purple-200 bg-white inline-block">
                      <img
                        src={selectedCase.photoUrl || selectedCase.photoBase64}
                        alt="Ảnh đính kèm"
                        onClick={() =>
                          setViewingPhoto({
                            url: selectedCase.photoUrl || selectedCase.photoBase64 || '',
                            title: `Ảnh của ${selectedCase.isAnonymous ? 'Học sinh ẩn danh' : selectedCase.studentName}`,
                            fileId: selectedCase.photoFileId,
                          })
                        }
                        className="max-h-48 rounded-xl object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 3. VIDEO SECTION: Dedicated video player & Drive links */}
              {(selectedCase.videoBase64 || selectedCase.videoBlobUrl || selectedCase.videoDriveUrl) && (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-rose-950 flex items-center gap-2">
                          <span>Video học sinh đính kèm</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-200 text-rose-800 rounded">
                            {selectedCase.videoMimeType || 'video/mp4'}
                          </span>
                        </div>
                        <div className="text-xs text-rose-700">
                          Tệp: {selectedCase.videoFileName || `Video_${selectedCase.id}.mp4`} • Thời lượng: {selectedCase.videoDuration || 0}s
                          {selectedCase.videoFileId && (
                            <span className="ml-2 text-slate-500">ID: {selectedCase.videoFileId}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setViewingVideo({
                            url: selectedCase.videoBase64 || selectedCase.videoBlobUrl || selectedCase.videoDriveUrl || '',
                            title: `Video của ${selectedCase.isAnonymous ? 'Học sinh ẩn danh' : selectedCase.studentName}`,
                            fileId: selectedCase.videoFileId,
                          })
                        }
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Play className="w-4 h-4" />
                        Xem video
                      </button>

                      {selectedCase.videoDriveUrl && (
                        <a
                          href={selectedCase.videoDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Mở tệp Google Drive
                        </a>
                      )}

                      {(selectedCase.videoBlobUrl || selectedCase.videoBase64) && (
                        <a
                          href={selectedCase.videoBlobUrl || selectedCase.videoBase64}
                          download={selectedCase.videoFileName || `Video_${selectedCase.id}.mp4`}
                          className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold rounded-xl text-xs flex items-center gap-1"
                          title="Tải video về máy tính"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Tải về
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Inline Video Player */}
                  {(selectedCase.videoBase64 || selectedCase.videoBlobUrl) && (
                    <div className="rounded-xl overflow-hidden border border-rose-200 bg-black max-w-md">
                      <video
                        src={selectedCase.videoBase64 || selectedCase.videoBlobUrl}
                        controls
                        playsInline
                        className="w-full max-h-56 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 4. GOOGLE DRIVE SYNC STATUS BOX */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    {selectedCase.syncedToGoogle ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      Trạng thái đồng bộ Drive: {selectedCase.syncedToGoogle ? 'Đã đồng bộ lên Google Drive & Sheet' : 'Đang lưu trữ trên máy (Chờ đồng bộ Drive)'}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {selectedCase.lastSyncedAt
                      ? `Lần đồng bộ gần nhất: ${formatSafeDateTime(selectedCase.lastSyncedAt)}`
                      : selectedCase.syncError
                      ? `Thông báo: ${selectedCase.syncError}`
                      : 'Tệp đã được lưu an toàn trong hệ thống.'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSyncSingleCase(selectedCase)}
                  disabled={isSingleSyncing}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  {isSingleSyncing ? 'Đang gửi...' : 'Đồng bộ hồ sơ này lên Drive'}
                </button>
              </div>

              {/* Support Plan Box */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" /> Kế hoạch hỗ trợ của nhà trường
                  </span>
                  <button
                    type="button"
                    onClick={handleSavePlan}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
                  >
                    Lưu kế hoạch
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={editingPlan || selectedCase.supportPlan || ''}
                  onChange={(e) => setEditingPlan(e.target.value)}
                  placeholder="Ghi lại các bước hỗ trợ (ví dụ: gặp riêng vào giờ ra chơi, trao đổi thêm với giáo viên bộ môn...)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-hidden focus:border-indigo-400"
                />
              </div>

              {/* Teacher Notes & History Log */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-600" /> Nhật ký xử lý & Ghi chú nội bộ
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {(selectedCase.teacherNotes || []).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Chưa có ghi chú nào cho trường hợp này.</p>
                  ) : (
                    selectedCase.teacherNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>{note.author}</span>
                          <span className="text-slate-400">{formatSafeDateTime(note.date)}</span>
                        </div>
                        <p className="text-slate-800 font-medium">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new note */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteAuthor}
                      onChange={(e) => setNewNoteAuthor(e.target.value)}
                      placeholder="Người ghi chú..."
                      className="w-1/3 px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-hidden"
                    />
                    <input
                      type="text"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Thêm ghi chú xử lý mới..."
                      className="w-2/3 px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-hidden"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Thầy cô có chắc chắn muốn xóa hồ sơ này khỏi hệ thống?')) {
                          onDeleteSubmission(selectedCase.id);
                        }
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa hồ sơ này
                    </button>

                    <button
                      type="submit"
                      disabled={!newNoteContent.trim()}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Thêm ghi chú
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400 text-sm">
              Chọn một lời nhắn ở cột bên trái để xem chi tiết và lắng nghe ghi âm / xem ảnh / video.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Photo */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] bg-slate-900 rounded-3xl p-4 flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                {viewingPhoto.title}
              </span>
              <button
                onClick={() => setViewingPhoto(null)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={viewingPhoto.url}
              alt={viewingPhoto.title}
              className="max-w-full max-h-[75vh] rounded-2xl object-contain border border-slate-700"
            />
            <div className="w-full pt-3 flex justify-end gap-2">
              <a
                href={viewingPhoto.url}
                download="hinh_anh_hoc_sinh.jpg"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Tải ảnh về máy
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Video */}
      {viewingVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingVideo(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl p-4 flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="text-sm font-bold flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-400" />
                {viewingVideo.title}
              </span>
              <button
                onClick={() => setViewingVideo(null)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <video
              src={viewingVideo.url}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[72vh] rounded-2xl object-contain border border-slate-700 bg-black"
            />
            <div className="w-full pt-3 flex justify-end gap-2">
              <a
                href={viewingVideo.url}
                download="video_hoc_sinh.mp4"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Tải video về máy
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Google Apps Script & Sheet Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-black text-slate-900">
                  Cấu Hình Kết Nối Google Sheet & Google Drive
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Đường dẫn Web App (Google Apps Script URL):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={gasUrl}
                    onChange={(e) => setGasUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-300"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveGasUrl}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shrink-0"
                    >
                      Lưu URL
                    </button>
                    <button
                      type="button"
                      onClick={handleTestGasConnection}
                      disabled={isTestingGas}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl shrink-0"
                    >
                      {isTestingGas ? 'Đang thử...' : 'Kiểm tra kết nối'}
                    </button>
                  </div>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-2xl border ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {testResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                    <span>{testResult.message}</span>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="font-black text-slate-900">
                  Hướng dẫn cấu hình kết nối Google Sheet chuẩn 8 cột & Google Drive:
                </div>
                <div className="text-[11px] bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 leading-relaxed font-semibold">
                  📌 <strong>Bảng tính gồm đúng 8 cột chuẩn:</strong><br />
                  1. Cảm Xúc | 2. Chủ Đề | 3. Mức Độ Hỗ Trợ | 4. Nội Dung Chia Sẻ | 5. Link Ghi Âm Drive | 6. Link Hình Ảnh Drive | 7. Link Hồ Sơ Drive | 8. Trạng Thái<br />
                  💡 <em>Mã nguồn bên dưới đã tự động tạo thư mục "Trạm Cảm Xúc - Tệp Đính Kèm" trên Google Drive và điền đường link xem công khai vào đúng Cột 5 và Cột 6!</em>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>Tạo một Google Sheet mới trên Google Drive của trường.</li>
                  <li>Vào menu <strong>Tiện ích mở rộng (Extensions)</strong> &gt; chọn <strong>Apps Script</strong>.</li>
                  <li>Xóa toàn bộ mã cũ và dán toàn bộ đoạn mã bên dưới vào tệp <code>Code.gs</code>.</li>
                  <li>Bấm <strong>Triển khai (Deploy)</strong> &gt; chọn <strong>Tùy chọn triển khai mới (New deployment)</strong> &gt; Loại: <strong>Ứng dụng web (Web app)</strong>.</li>
                  <li>
                    <strong>QUAN TRỌNG:</strong> Mục <em>Ai có quyền truy cập (Who has access)</em>, thầy cô phải chọn <strong>Bất kỳ ai (Anyone)</strong> để ứng dụng có thể truyền file vào Drive.
                  </li>
                  <li>Sao chép URL Web App (kết thúc bằng <code>/exec</code>) và dán vào ô bên trên để đồng bộ!</li>
                </ol>
              </div>

              {/* Code block with copy button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">Mã nguồn Code.gs chuẩn hỗ trợ Ghi âm, Ảnh & Video:</span>
                  <button
                    type="button"
                    onClick={copyAppsScript}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedCode ? 'Đã sao chép!' : 'Sao chép mã'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto text-[11px] font-mono max-h-52">
                  {SAMPLE_GAS_CODE}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thay Đổi Mật Khẩu Giáo Viên */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};
