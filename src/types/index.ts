/**
 * Type definitions for Trạm Cảm Xúc Từ Trái Tim
 */

export type EmotionType = 'happy' | 'sad' | 'anxious' | 'angry' | 'speechless' | 'just_listen';

export interface EmotionInfo {
  id: EmotionType;
  label: string;
  subLabel: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  emoji: string;
  illustration: string;
  themeGradient: string;
}

export type TopicType =
  | 'friends'
  | 'study'
  | 'teachers'
  | 'family'
  | 'worry'
  | 'joy'
  | 'other';

export interface TopicInfo {
  id: TopicType;
  label: string;
  icon: string;
  desc: string;
}

export type SupportLevel =
  | 'share_only'
  | 'chat'
  | 'urgent';

export interface SupportLevelInfo {
  id: SupportLevel;
  label: string;
  desc: string;
  color: string;
}

export type CaseStatus =
  | 'new'
  | 'reviewing'
  | 'direct_chat'
  | 'helped'
  | 'closed';

export interface TeacherNote {
  id: string;
  date: string;
  author: string;
  content: string;
}

export type MediaFileType = 'none' | 'audio' | 'image' | 'video';

export interface MediaDetails {
  type: MediaFileType;
  fileName: string;
  mimeType: string;
  fileSize?: number;
  durationSec?: number;
  base64Data?: string;
  blobUrl?: string;
  driveFileId?: string;
  driveUrl?: string;
  driveDownloadUrl?: string;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'failed';
  uploadError?: string;
}

export interface Submission {
  id: string;
  createdAt: string; // Valid ISO 8601 string
  studentName: string;
  studentClass: string;
  isAnonymous: boolean;
  emotion: EmotionType;
  topic: TopicType;
  supportLevel: SupportLevel;
  textMessage: string;

  // Audio media
  audioBlobUrl?: string;
  audioBase64?: string;
  audioDuration?: number;
  audioFileName?: string;
  audioMimeType?: string;
  audioFileId?: string;
  audioDriveUrl?: string;

  // Photo media
  photoUrl?: string;
  photoBase64?: string;
  photoFileName?: string;
  photoMimeType?: string;
  photoFileId?: string;
  photoDriveUrl?: string;

  // Video media
  videoBlobUrl?: string;
  videoBase64?: string;
  videoDuration?: number;
  videoFileName?: string;
  videoMimeType?: string;
  videoFileId?: string;
  videoDriveUrl?: string;

  // Drive profile link
  driveProfileUrl?: string;

  sticker?: string;
  status: CaseStatus;
  teacherNotes: TeacherNote[];
  supportPlan?: string;

  // Sync state
  syncedToGoogle: boolean;
  syncStatus?: 'pending' | 'syncing' | 'synced' | 'failed';
  syncError?: string;
  lastSyncedAt?: string;
  isUrgentAlert?: boolean;
}

export interface KindMessage {
  id: string;
  createdAt: string;
  author: string;
  promptTemplate: string;
  content: string;
  likes: number;
  sticker: string;
}

export interface SyncStatus {
  lastSyncTime?: string;
  isSyncing: boolean;
  pendingCount: number;
  lastError?: string;
  googleScriptUrl: string;
}

export interface GasSyncResponse {
  success: boolean;
  message?: string;
  code?: string;
  audioFileId?: string;
  audioDriveUrl?: string;
  photoFileId?: string;
  photoDriveUrl?: string;
  videoFileId?: string;
  videoDriveUrl?: string;
  hoSoFileId?: string;
  hoSoDriveUrl?: string;
  rowNumber?: number;
}
