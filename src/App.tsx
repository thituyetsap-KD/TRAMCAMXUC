/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavPage } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StudentHome } from './components/StudentHome';
import { StudentShareForm } from './components/StudentShareForm';
import { KindMessagesWall } from './components/KindMessagesWall';
import { TeacherDashboard } from './components/TeacherDashboard';
import { UrgentHelpModal } from './components/UrgentHelpModal';
import { SuccessConfirmationModal } from './components/SuccessConfirmationModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { TeacherFeedbackView } from './components/TeacherFeedbackView';

import { EmotionType, Submission, CaseStatus } from './types';
import {
  getSubmissions,
  addSubmission,
  updateSubmissionStatus,
  updateSubmissionPlan,
  deleteSubmission,
  getKindMessages,
  addKindMessage,
  likeKindMessage,
} from './services/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('happy');
  const [initialFormMode, setInitialFormMode] = useState<'all' | 'audio' | 'text' | 'image'>('all');

  // Teacher Mode
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState(false);

  // Modals
  const [isUrgentHelpOpen, setIsUrgentHelpOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App data state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [kindMessages, setKindMessages] = useState(getKindMessages());

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  const handleSelectEmotionFromHome = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
    setInitialFormMode('all');
    setCurrentPage('share');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModeFromHome = (mode: 'all' | 'audio' | 'text' | 'image') => {
    setInitialFormMode(mode);
    if (mode === 'audio') setCurrentPage('audio');
    else if (mode === 'text') setCurrentPage('text');
    else if (mode === 'image') setCurrentPage('image');
    else setCurrentPage('share');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSubmission = async (data: any): Promise<void> => {
    await addSubmission(data);
    setSubmissions(getSubmissions());
  };

  const handleUrgentAlert = async (data: { studentName: string; studentClass: string; note: string; directMeet: boolean }) => {
    await addSubmission({
      emotion: 'anxious',
      topic: 'worry',
      supportLevel: 'urgent',
      textMessage: `[YÊU CẦU HỖ TRỢ KHẨN] ${data.note} (Học sinh mong muốn: ${data.directMeet ? 'Nói chuyện trực tiếp' : 'Hỗ trợ sớm'})`,
      studentName: data.studentName,
      studentClass: data.studentClass,
      isAnonymous: !data.studentName || data.studentName === 'Học sinh ẩn danh',
      sticker: 'heart',
      isUrgentAlert: true,
    });
    setSubmissions(getSubmissions());
  };

  const handleAddKindMessage = (msg: any) => {
    addKindMessage(msg);
    setKindMessages(getKindMessages());
  };

  const handleLikeKindMessage = (id: string) => {
    likeKindMessage(id);
    setKindMessages(getKindMessages());
  };

  const handleUpdateStatus = (id: string, status: CaseStatus, note?: string, author?: string) => {
    updateSubmissionStatus(id, status, note, author);
    setSubmissions(getSubmissions());
  };

  const handleUpdatePlan = (id: string, plan: string) => {
    updateSubmissionPlan(id, plan);
    setSubmissions(getSubmissions());
  };

  const handleDelete = (id: string) => {
    deleteSubmission(id);
    setSubmissions(getSubmissions());
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col font-['Nunito',sans-serif]">
      {/* Left Sidebar */}
      {!isTeacherLoggedIn && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all ${!isTeacherLoggedIn ? 'lg:pl-64 md:lg:pl-72' : ''}`}>
        {/* Sticky Header */}
        <TopBar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
          isTeacherMode={isTeacherLoggedIn}
          onOpenKindness={() => setCurrentPage('kindness')}
          onExitTeacherMode={() => {
            setIsTeacherLoggedIn(false);
            setCurrentPage('home');
          }}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {isTeacherLoggedIn ? (
            <TeacherDashboard
              submissions={submissions}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePlan={handleUpdatePlan}
              onDeleteSubmission={handleDelete}
              onLogout={() => {
                setIsTeacherLoggedIn(false);
                setCurrentPage('home');
              }}
            />
          ) : currentPage === 'home' ? (
            <StudentHome
              onSelectEmotion={handleSelectEmotionFromHome}
              onOpenMode={handleOpenModeFromHome}
              onOpenUrgentHelp={() => setIsUrgentHelpOpen(true)}
            />
          ) : currentPage === 'kindness' ? (
            <KindMessagesWall
              messages={kindMessages}
              onAddMessage={handleAddKindMessage}
              onLikeMessage={handleLikeKindMessage}
            />
          ) : currentPage === 'feedback' ? (
            <TeacherFeedbackView onBackToHome={() => setCurrentPage('home')} />
          ) : (
            // Diary / Audio / Text / Image sharing forms
            <div className="space-y-4">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  ← Quay lại trang chủ
                </button>
                <button
                  onClick={() => setIsUrgentHelpOpen(true)}
                  className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  🤝 Em cần thầy cô giúp đỡ
                </button>
              </div>

              <StudentShareForm
                initialEmotion={selectedEmotion}
                initialMode={initialFormMode}
                onSaveSubmission={handleSaveSubmission}
                onSubmitSuccess={() => setIsSuccessOpen(true)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Emergency Assistance Modal */}
      <UrgentHelpModal
        isOpen={isUrgentHelpOpen}
        onClose={() => setIsUrgentHelpOpen(false)}
        onRequestHelp={handleUrgentAlert}
      />

      {/* Success Confirmation Modal */}
      <SuccessConfirmationModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onGoHome={() => {
          setIsSuccessOpen(false);
          setCurrentPage('home');
        }}
      />

      {/* Teacher PIN Login Modal */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onSuccess={() => {
          setIsTeacherAuthOpen(false);
          setIsTeacherLoggedIn(true);
        }}
      />
    </div>
  );
}
