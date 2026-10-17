import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Send, AlertCircle, Volume2, Sparkles } from 'lucide-react';

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob, base64: string, durationSec: number) => void;
  onCancel?: () => void;
  onSwitchToText?: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioReady,
  onSwitchToText,
}) => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'recorded'>('idle');
  const [duration, setDuration] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playProgress, setPlayProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    setDuration(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ ghi âm trực tiếp.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        recordedBlobRef.current = audioBlob;
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioBase64(base64data);
        };

        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setRecordingState('recording');

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      let msg = 'Không thể truy cập micro. Em hãy kiểm tra xem đã cho phép quyền micro chưa nhé!';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Em chưa cấp quyền micro cho trang web. Em có thể bật lại quyền hoặc chọn viết lời nhắn nhé!';
      }
      setErrorMessage(msg);
      setRecordingState('idle');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingState('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      setRecordingState('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (recordingState === 'recording' || recordingState === 'paused')) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingState('recorded');
    }
  };

  const resetRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBase64(null);
    recordedBlobRef.current = null;
    setDuration(0);
    setIsPlaying(false);
    setPlayProgress(0);
    setRecordingState('idle');
  };

  const togglePlayback = () => {
    if (!audioElementRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setPlayProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setPlayProgress(0);
      };
    }

    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleConfirmAudio = () => {
    if (recordedBlobRef.current && audioBase64) {
      onAudioReady(recordedBlobRef.current, audioBase64, duration);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-sky-100 flex flex-col items-center max-w-xl mx-auto">
      {/* Friendly Header Prompt */}
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-sky-500 animate-spin" style={{ animationDuration: '10s' }} />
        <h3 className="text-xl md:text-2xl font-black text-sky-900 text-center">Góc Ghi Âm Tâm Sự</h3>
      </div>
      <p className="text-sm md:text-base text-slate-600 text-center mb-6 max-w-md">
        Em hãy nói những điều trong lòng một cách tự nhiên nhất. Chỉ có thầy cô phụ trách mới được lắng nghe em thôi nhé!
      </p>

      {/* Error Alert if micro permission denied */}
      {errorMessage && (
        <div className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Thông báo micro</span>
          </div>
          <p className="text-sm text-amber-700">{errorMessage}</p>
          {onSwitchToText && (
            <button
              onClick={onSwitchToText}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm active:scale-95"
            >
              Chuyển sang viết lời nhắn ✍️
            </button>
          )}
        </div>
      )}

      {/* Main Big Microphone Visual */}
      <div className="relative mb-6">
        {/* Pulsing ring during recording */}
        {recordingState === 'recording' && (
          <div className="absolute inset-0 -m-4 rounded-full bg-rose-400/30 animate-ping pointer-events-none" />
        )}
        <div
          className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            recordingState === 'recording'
              ? 'bg-rose-500 text-white scale-105 shadow-rose-200'
              : recordingState === 'paused'
              ? 'bg-amber-500 text-white shadow-amber-200'
              : recordingState === 'recorded'
              ? 'bg-emerald-500 text-white shadow-emerald-200'
              : 'bg-sky-500 hover:bg-sky-600 text-white cursor-pointer active:scale-95 shadow-sky-200'
          }`}
          onClick={recordingState === 'idle' ? startRecording : undefined}
        >
          {recordingState === 'recording' ? (
            <div className="flex flex-col items-center">
              <Mic className="w-14 h-14 animate-pulse" />
              <span className="text-xs font-bold mt-1 tracking-wider uppercase">Đang ghi...</span>
            </div>
          ) : recordingState === 'paused' ? (
            <div className="flex flex-col items-center">
              <Pause className="w-12 h-12" />
              <span className="text-xs font-bold mt-1">Đang tạm dừng</span>
            </div>
          ) : recordingState === 'recorded' ? (
            <div className="flex flex-col items-center">
              <Volume2 className="w-12 h-12" />
              <span className="text-xs font-bold mt-1">Đã ghi âm xong</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Mic className="w-14 h-14" />
              <span className="text-xs font-bold mt-1">Bấm để ghi âm</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Duration Counter & Visualizer */}
      <div className="text-center mb-6">
        <div className="text-3xl font-black text-slate-800 tracking-wider font-mono">
          {formatTime(duration)}
        </div>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          {recordingState === 'recording' && '🔴 Đang lắng nghe giọng nói của em...'}
          {recordingState === 'paused' && '⏸️ Bản ghi đang tạm dừng'}
          {recordingState === 'recorded' && '✅ Em có thể nghe lại trước khi gửi'}
          {recordingState === 'idle' && 'Bấm nút tròn phía trên để bắt đầu tâm sự nhé!'}
        </p>

        {/* Fake Sound Waveform Animation */}
        {recordingState === 'recording' && (
          <div className="flex items-center justify-center gap-1.5 mt-3 h-8">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 60].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-rose-500 rounded-full animate-bounce"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + (i % 4) * 0.15}s`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Playback bar when recorded */}
      {recordingState === 'recorded' && audioUrl && (
        <div className="w-full bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-800 flex items-center gap-1">
              <Volume2 className="w-4 h-4 text-sky-600" /> Bản ghi âm của em ({formatTime(duration)})
            </span>
            <button
              onClick={togglePlayback}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Dừng nghe' : 'Nghe lại'}
            </button>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-sky-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-full transition-all duration-150"
              style={{ width: `${playProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        {recordingState === 'idle' && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-base"
          >
            <Mic className="w-5 h-5" />
            Bắt đầu ghi âm
          </button>
        )}

        {recordingState === 'recording' && (
          <>
            <button
              onClick={pauseRecording}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-2xl shadow-sm transition-all active:scale-95 text-sm"
            >
              <Pause className="w-4 h-4" />
              Tạm dừng
            </button>
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
            >
              <Square className="w-4 h-4" />
              Hoàn thành ghi âm
            </button>
          </>
        )}

        {recordingState === 'paused' && (
          <>
            <button
              onClick={resumeRecording}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 text-sm"
            >
              <Play className="w-4 h-4" />
              Ghi âm tiếp
            </button>
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
            >
              <Square className="w-4 h-4" />
              Hoàn thành
            </button>
          </>
        )}

        {recordingState === 'recorded' && (
          <>
            <button
              onClick={resetRecording}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm transition-all active:scale-95 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Ghi âm lại
            </button>
            <button
              onClick={handleConfirmAudio}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
            >
              <Send className="w-4 h-4" />
              Gửi lời tâm sự bằng giọng nói
            </button>
          </>
        )}
      </div>
    </div>
  );
};
