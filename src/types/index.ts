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

export interface Submission {
  id: string;
  createdAt: string;
  studentName: string;
  studentClass: string;
  isAnonymous: boolean;
  emotion: EmotionType;
  topic: TopicType;
  supportLevel: SupportLevel;
  textMessage: string;
  audioBlobUrl?: string;
  audioBase64?: string;
  audioDuration?: number;
  photoUrl?: string;
  sticker?: string;
  status: CaseStatus;
  teacherNotes: TeacherNote[];
  supportPlan?: string;
  syncedToGoogle: boolean;
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
