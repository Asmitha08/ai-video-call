import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCall } from '../context/CallContext.jsx';
import { useTranslation } from '../context/TranslationContext.jsx';
import VideoGrid from '../components/VideoGrid.jsx';
import CallControls from '../components/CallControls.jsx';
import RoomInfo from '../components/RoomInfo.jsx';
import ConnectionStatus from '../components/ConnectionStatus.jsx';
import LiveCaptionsOverlay from '../components/LiveCaptionsOverlay.jsx';
import TranslationSettingsModal from '../components/TranslationSettingsModal.jsx';
import TranscriptDrawer from '../components/TranscriptDrawer.jsx';
import styles from './CallPage.module.css';

export default function CallPage() {
  const { roomId } = useParams();
  const { room, callStatus, callError, remoteParticipants, leaveRoom } = useCall();
  const { sttError, unlockTTS } = useTranslation();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);

  // Modals / Drawer state
  const [isTranslateSettingsOpen, setIsTranslateSettingsOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  // Redirect home if no active call
  useEffect(() => {
    if (callStatus === 'idle') navigate('/', { replace: true });
  }, [callStatus, navigate]);

  // Call duration timer — starts once connected
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callStatus]);

  function handleLeave() {
    leaveRoom();
    navigate('/');
  }

  const participantCount = Object.keys(remoteParticipants).length + 1;

  return (
    <main className={styles.callPage} onClick={unlockTTS}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>✦ AICall</span>
          <ConnectionStatus status={callStatus} elapsed={elapsed} />
        </div>

        <div className={styles.headerCenter}>
          {room && <RoomInfo roomId={room.roomId} />}
        </div>

        <div className={styles.headerRight}>
          <span className={styles.participantCount}>
            👤 {participantCount} participant{participantCount !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      {/* ── Error / Notice banners ─────────────────────────────────────────── */}
      {callError && (
        <div className={styles.errorBanner} role="alert">
          ⚠ {callError}
        </div>
      )}

      {sttError && (
        <div className={styles.sttNoticeBanner} role="status">
          <span>ℹ️ {sttError}</span>
          <button
            className={styles.sttNoticeBtn}
            onClick={() => setIsTranscriptOpen(true)}
          >
            Open Transcript
          </button>
        </div>
      )}

      {/* ── Video area ──────────────────────────────────────────────────────── */}
      <section className={styles.videoArea}>
        <VideoGrid />
      </section>

      {/* ── Floating Global Subtitles Banner ────────────────────────────────── */}
      <LiveCaptionsOverlay />

      {/* ── Controls ────────────────────────────────────────────────────────── */}
      <footer className={styles.controls}>
        <CallControls
          onLeave={handleLeave}
          onOpenTranslateSettings={() => setIsTranslateSettingsOpen(true)}
          onToggleTranscript={() => setIsTranscriptOpen((prev) => !prev)}
          isTranscriptOpen={isTranscriptOpen}
        />
      </footer>

      {/* ── Modals & Drawers ────────────────────────────────────────────────── */}
      <TranslationSettingsModal
        isOpen={isTranslateSettingsOpen}
        onClose={() => setIsTranslateSettingsOpen(false)}
      />

      <TranscriptDrawer
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
      />
    </main>
  );
}
