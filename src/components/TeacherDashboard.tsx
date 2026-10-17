import React, { useState } from 'react';
import { Submission, CaseStatus } from '../types';
import { EMOTIONS, TOPICS } from '../constants/emotions';
import {
  exportSubmissionsToCsv,
  syncAllSubmissionsToGas,
  getStoredGasUrl,
  setStoredGasUrl,
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
  CheckCircle,
  Clock,
  MessageSquare,
  Lock,
  LogOut,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Code2,
  Copy,
  Eye,
  X,
  Play,
  Pause,
} from 'lucide-react';

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

  // New note form state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('Cô Lan (Tư vấn học đường)');
  const [editingPlan, setEditingPlan] = useState('');

  // Audio player state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Lightbox
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [gasUrl, setGasUrl] = useState(getStoredGasUrl());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = item.studentName.toLowerCase().includes(q);
      const matchClass = (item.studentClass || '').toLowerCase().includes(q);
      const matchText = (item.textMessage || '').toLowerCase().includes(q);
      if (!matchName && !matchClass && !matchText) return false;
    }
    return true;
  });

  const selectedCase = submissions.find((s) => s.id === selectedCaseId) || filteredList[0] || null;

  const handleTogglePlayAudio = (subId: string, audioSrc?: string) => {
    if (!audioSrc) return;
    if (playingAudioId === subId && audioElement) {
      audioElement.pause();
      setPlayingAudioId(null);
      return;
    }
    if (audioElement) {
      audioElement.pause();
    }
    const audio = new Audio(audioSrc);
    audio.onended = () => setPlayingAudioId(null);
    audio.play();
    setAudioElement(audio);
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

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncFeedback('Đang đồng bộ dữ liệu lên Google Apps Script...');
    const res = await syncAllSubmissionsToGas();
    setIsSyncing(false);
    setSyncFeedback(`Hoàn tất đồng bộ: ${res.success} mục thành công!`);
    setTimeout(() => setSyncFeedback(null), 5000);
  };

  const handleSaveGasUrl = () => {
    setStoredGasUrl(gasUrl);
    alert('Đã lưu cấu hình đường link Google Apps Script!');
  };

  const gasSampleCode = `// Google Apps Script kết nối "Trạm Cảm Xúc Từ Trái Tim"
// Dán toàn bộ mã này vào Extensions (Tiện ích mở rộng) > Apps Script trong Google Sheet của trường

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // 1. Chuẩn bị thư mục trên Google Drive để lưu tệp ghi âm và ảnh học sinh
    var folderName = "Trạm Cảm Xúc - Tệp Đính Kèm";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    // Cấp quyền xem cho người có link để giáo viên có thể nghe và xem
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (errShare) {}

    // 2. Xử lý tệp Ghi Âm (nếu học sinh có gửi ghi âm)
    var linkGhiAmDrive = "";
    if (data.audioBase64 && data.audioBase64.length > 50) {
      try {
        var cleanAudio = data.audioBase64.replace(/^data:audio\\/[^;]+;base64,/, "");
        var audioBytes = Utilities.base64Decode(cleanAudio);
        var audioFileName = data.audioFileName || ("Ghi_Am_" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd_HHmmss") + ".webm");
        var audioBlob = Utilities.newBlob(audioBytes, data.audioMimeType || "audio/webm", audioFileName);
        var audioFile = folder.createFile(audioBlob);
        audioFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        linkGhiAmDrive = audioFile.getUrl();
      } catch (errAudio) {
        linkGhiAmDrive = "Lỗi tạo file âm thanh: " + errAudio.toString();
      }
    }

    // 3. Xử lý tệp Hình Ảnh (nếu học sinh có gửi ảnh/chụp ảnh)
    var linkHinhAnhDrive = "";
    if (data.photoBase64 && data.photoBase64.length > 50) {
      try {
        var cleanPhoto = data.photoBase64.replace(/^data:image\\/[^;]+;base64,/, "");
        var photoBytes = Utilities.base64Decode(cleanPhoto);
        var photoFileName = data.photoFileName || ("Hinh_Anh_" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd_HHmmss") + ".jpg");
        var photoBlob = Utilities.newBlob(photoBytes, data.photoMimeType || "image/jpeg", photoFileName);
        var photoFile = folder.createFile(photoBlob);
        photoFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        linkHinhAnhDrive = photoFile.getUrl();
      } catch (errPhoto) {
        linkHinhAnhDrive = "Lỗi tạo file ảnh: " + errPhoto.toString();
      }
    }

    // 4. Kiểm tra dòng tiêu đề đúng 8 cột chuẩn của bảng tính
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Cảm Xúc",
        "Chủ Đề",
        "Mức Độ Hỗ Trợ",
        "Nội Dung Chia Sẻ",
        "Link Ghi Âm Drive",
        "Link Hình Ảnh Drive",
        "Link Hồ Sơ Drive",
        "Trạng Thái"
      ]);
      // Định dạng dòng tiêu đề in đậm
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#F0FDF4");
    }

    // 5. Ghi dòng dữ liệu mới vào đúng 8 cột trong Google Sheet
    sheet.appendRow([
      data["Cảm Xúc"] || data.camXuc || "Vui vẻ",
      data["Chủ Đề"] || data.chuDe || "Bạn bè",
      data["Mức Độ Hỗ Trợ"] || data.mucDoHoTro || "Em muốn chia sẻ",
      data["Nội Dung Chia Sẻ"] || data.noiDungChiaSe || data.message || "",
      linkGhiAmDrive,
      linkHinhAnhDrive,
      data["Link Hồ Sơ Drive"] || ("Hồ sơ #" + (data.id || "")),
      data["Trạng Thái"] || data.trangThai || "Mới tiếp nhận"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      linkGhiAmDrive: linkGhiAmDrive,
      linkHinhAnhDrive: linkHinhAnhDrive
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    app: "Trạm Cảm Xúc Từ Trái Tim",
    time: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}`;

  const copyAppsScript = () => {
    navigator.clipboard.writeText(gasSampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar for Teachers */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-900 font-black rounded-lg text-xs">
              DÀNH CHO GIÁO VIÊN & TƯ VẤN HỌC ĐƯỜNG
            </span>
            <span className="text-xs text-slate-500 font-medium">Bảo mật thông tin nội bộ</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Hộp Thư Tâm Sự & Hỗ Trợ Học Sinh</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-4 h-4 text-slate-600" />
            Cấu hình Google Sheet
          </button>

          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Đồng bộ dữ liệu
          </button>

          <div className="flex items-center gap-1 border-l pl-2 border-slate-200">
            <button
              onClick={() => exportSubmissionsToCsv(submissions, false)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất CSV
            </button>
            <button
              onClick={() => exportSubmissionsToCsv(submissions, true)}
              title="Xuất CSV loại bỏ họ tên học sinh phục vụ báo cáo"
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors"
            >
              Ẩn danh
            </button>
          </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Thoát
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
          <span>{syncFeedback}</span>
          <button onClick={() => setSyncFeedback(null)} className="text-indigo-500 hover:text-indigo-800">✕</button>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalCount}</div>
            <div className="text-xs font-bold text-slate-500">Tổng lời chia sẻ</div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-pink-600">{newCount}</div>
            <div className="text-xs font-bold text-slate-500">Mới tiếp nhận</div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700">{urgentCount}</div>
            <div className="text-xs font-bold text-amber-900">Cần hỗ trợ sớm</div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{helpedCount}</div>
            <div className="text-xs font-bold text-slate-500">Đã đồng hành/xử lý</div>
          </div>
        </div>
      </div>

      {/* Emotion Distribution Visual Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Phân bố cảm xúc học sinh
          </span>
          <span className="text-xs text-slate-400">Không xếp hạng tiêu cực - hỗ trợ kịp thời</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {(['happy', 'sad', 'anxious', 'angry', 'speechless', 'just_listen'] as const).map((key) => {
            const count = emotionStats[key] || 0;
            const emo = EMOTIONS[key];
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div key={key} className={`p-2.5 rounded-xl border ${emo.borderColor} ${emo.bgColor}`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{emo.emoji} {emo.label}</span>
                  <span className="font-mono">{count}</span>
                </div>
                <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-slate-700 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout: Cases List & Case Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Filter and List of cases */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên học sinh, lớp, từ khóa..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-hidden focus:border-indigo-400"
              />
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="new">Mới tiếp nhận</option>
                <option value="reviewing">Đang xem xét</option>
                <option value="direct_chat">Cần trao đổi</option>
                <option value="helped">Đã hỗ trợ</option>
                <option value="closed">Đã đóng</option>
              </select>

              <select
                value={filterEmotion}
                onChange={(e) => setFilterEmotion(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white"
              >
                <option value="all">Tất cả cảm xúc</option>
                <option value="happy">Vui vẻ</option>
                <option value="sad">Buồn bã</option>
                <option value="anxious">Lo lắng</option>
                <option value="angry">Tức giận</option>
                <option value="speechless">Khó nói</option>
                <option value="just_listen">Muốn lắng nghe</option>
              </select>

              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white"
              >
                <option value="all">Tất cả chủ đề</option>
                {TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setFilterUrgentOnly(!filterUrgentOnly)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  filterUrgentOnly
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Chỉ xem cần hỗ trợ sớm ({urgentCount})
              </button>
              <span className="text-[11px] text-slate-400 font-medium">
                Hiển thị {filteredList.length}/{totalCount}
              </span>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
                Không tìm thấy lời nhắn nào phù hợp với bộ lọc.
              </div>
            ) : (
              filteredList.map((item) => {
                const isSelected = selectedCase?.id === item.id;
                const emo = EMOTIONS[item.emotion] || EMOTIONS.happy;
                const isUrgent = item.supportLevel === 'urgent' || item.isUrgentAlert;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                        : isUrgent
                        ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
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
                        {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2 font-medium">
                      {item.textMessage || '(Học sinh gửi tin nhắn bằng giọng nói hoặc hình ảnh)'}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        {isUrgent && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-black rounded-md text-[10px]">
                            Cần hỗ trợ sớm
                          </span>
                        )}
                        {(item.audioBase64 || item.audioBlobUrl) && (
                          <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 font-bold rounded-md text-[10px] flex items-center gap-0.5">
                            <Volume2 className="w-2.5 h-2.5" /> Ghi âm
                          </span>
                        )}
                        {item.photoUrl && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 font-bold rounded-md text-[10px] flex items-center gap-0.5">
                            <ImageIcon className="w-2.5 h-2.5" /> Ảnh
                          </span>
                        )}
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
                        {item.status === 'new'
                          ? 'Mới'
                          : item.status === 'helped'
                          ? 'Đã hỗ trợ'
                          : item.status === 'direct_chat'
                          ? 'Cần gặp'
                          : 'Đang xem'}
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
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{EMOTIONS[selectedCase.emotion]?.emoji}</span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        {selectedCase.isAnonymous ? 'Học sinh ẩn danh' : selectedCase.studentName}
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          {selectedCase.studentClass || 'Tiểu học'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Gửi lúc {new Date(selectedCase.createdAt).toLocaleString('vi-VN')}
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
                  Cảm xúc: {EMOTIONS[selectedCase.emotion]?.label}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-bold border border-sky-200">
                  Chủ đề: {TOPICS.find((t) => t.id === selectedCase.topic)?.label || selectedCase.topic}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold border ${
                    selectedCase.supportLevel === 'urgent'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  Mong muốn: {selectedCase.supportLevel === 'urgent' ? 'Cần giúp đỡ sớm' : selectedCase.supportLevel === 'chat' ? 'Muốn trò chuyện' : 'Chỉ chia sẻ'}
                </span>
              </div>

              {/* Message text content */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 mb-1">Nội dung học sinh gửi:</div>
                <p className="text-sm text-slate-900 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedCase.textMessage || '(Học sinh không để lại tin nhắn chữ)'}
                </p>
              </div>

              {/* Audio playback if present */}
              {(selectedCase.audioBase64 || selectedCase.audioBlobUrl) && (
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-sky-950">Bản ghi âm giọng nói học sinh</div>
                      <div className="text-xs text-sky-700">
                        Thời lượng: {selectedCase.audioDuration || 0} giây
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePlayAudio(selectedCase.id, selectedCase.audioBase64 || selectedCase.audioBlobUrl)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    {playingAudioId === selectedCase.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {playingAudioId === selectedCase.id ? 'Dừng phát' : 'Nghe ghi âm'}
                  </button>
                </div>
              )}

              {/* Attached Photo if present */}
              {selectedCase.photoUrl && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-600" /> Hình ảnh học sinh đính kèm
                    </span>
                    <button
                      onClick={() => setViewingPhoto(selectedCase.photoUrl || null)}
                      className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem kích thước lớn
                    </button>
                  </div>
                  <img
                    src={selectedCase.photoUrl}
                    alt="Ảnh học sinh gửi"
                    onClick={() => setViewingPhoto(selectedCase.photoUrl || null)}
                    className="max-h-48 rounded-xl object-contain border border-purple-200 cursor-pointer hover:opacity-95"
                  />
                </div>
              )}

              {/* Support Plan Box */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" /> Kế hoạch hỗ trợ của nhà trường
                  </span>
                  <button
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
                          <span className="text-slate-400">{new Date(note.date).toLocaleString('vi-VN')}</span>
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
                        if (confirm('Em có chắc chắn muốn xóa lời nhắn này khỏi hệ thống theo quy định lưu trữ?')) {
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
              Chọn một lời nhắn ở cột bên trái để xem chi tiết và xử lý.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for student photo */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setViewingPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img src={viewingPhoto} alt="Kích thước lớn" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
            <button
              onClick={() => setViewingPhoto(null)}
              className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Google Apps Script & Sheet Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-black text-slate-900">Cấu Hình Kết Nối Google Sheet</h3>
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gasUrl}
                    onChange={(e) => setGasUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    onClick={handleSaveGasUrl}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shrink-0"
                  >
                    Lưu
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="font-black text-slate-900">Hướng dẫn cấu hình kết nối Google Sheet chuẩn 8 cột:</div>
                <div className="text-[11px] bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 leading-relaxed font-semibold">
                  📌 <strong>Bảng tính gồm 8 cột chuẩn:</strong><br />
                  1. Cảm Xúc | 2. Chủ Đề | 3. Mức Độ Hỗ Trợ | 4. Nội Dung Chia Sẻ | 5. Link Ghi Âm Drive | 6. Link Hình Ảnh Drive | 7. Link Hồ Sơ Drive | 8. Trạng Thái<br />
                  💡 <em>Mã nguồn đã tích hợp sẵn tính năng tự động tạo file ghi âm (.webm) và ảnh (.jpg) lên Google Drive rồi tạo đường link điền vào Cột 5 & Cột 6!</em>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>Tạo một Google Sheet mới trên Google Drive của trường.</li>
                  <li>Vào menu <strong>Tiện ích mở rộng (Extensions)</strong> &gt; chọn <strong>Apps Script</strong>.</li>
                  <li>Xóa mã cũ và dán toàn bộ đoạn mã bên dưới vào tệp <code>Code.gs</code>.</li>
                  <li>Bấm <strong>Triển khai (Deploy)</strong> &gt; chọn <strong>Tùy chọn triển khai mới (New deployment)</strong> &gt; Loại: <strong>Ứng dụng web (Web app)</strong>.</li>
                  <li>Mục <em>Ai có quyền truy cập (Who has access)</em>: chọn <strong>Bất kỳ ai (Anyone)</strong>.</li>
                  <li>Sao chép URL web app và dán vào ô bên trên để đồng bộ trực tiếp!</li>
                </ol>
              </div>

              {/* Code block with copy button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">Mã nguồn Code.gs mẫu chuẩn:</span>
                  <button
                    onClick={copyAppsScript}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedCode ? 'Đã sao chép!' : 'Sao chép mã'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto text-[11px] font-mono max-h-48">
                  {gasSampleCode}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
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
    </div>
  );
};
