import { useCall } from '../context/CallContext.jsx';
import { useTranslation } from '../context/TranslationContext.jsx';
import styles from './CallControls.module.css';

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const MicOnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const MicOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const CamOnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const CamOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ScreenShareIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <polyline points="8 21 12 17 16 21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const CaptionsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M7 15h3m-3-4h4m6 4h3m-3-4h4"/>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const SpeakerIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const TranscriptIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const PhoneOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.43 9.88a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.32 8.91"/>
    <line x1="23" y1="1" x2="1" y2="23"/>
  </svg>
);

/* ── Component ──────────────────────────────────────────────────────────── */
export default function CallControls({
  onLeave,
  onOpenTranslateSettings,
  onToggleTranscript,
  isTranscriptOpen,
}) {
  const {
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isAudioMuted,
    isVideoOff,
    isSharingScreen,
  } = useCall();

  const {
    captionsEnabled,
    toggleCaptions,
    targetLanguageObj,
    speakTranslations,
    toggleSpeakTranslations,
    isTranscribing,
  } = useTranslation();

  return (
    <div className={styles.bar} role="toolbar" aria-label="Call controls">
      {/* Mic */}
      <ControlBtn
        id="btn-toggle-mic"
        onClick={toggleAudio}
        active={isAudioMuted}
        label={isAudioMuted ? 'Unmute' : 'Mute'}
        icon={isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
        tooltip={isAudioMuted ? 'Unmute microphone' : 'Mute microphone'}
      />

      {/* Camera */}
      <ControlBtn
        id="btn-toggle-camera"
        onClick={toggleVideo}
        active={isVideoOff}
        label={isVideoOff ? 'Cam On' : 'Cam Off'}
        icon={isVideoOff ? <CamOffIcon /> : <CamOnIcon />}
        tooltip={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
      />

      {/* Screen share */}
      <ControlBtn
        id="btn-screen-share"
        onClick={toggleScreenShare}
        active={isSharingScreen}
        activeColor="blue"
        label={isSharingScreen ? 'Stop Share' : 'Share'}
        icon={<ScreenShareIcon active={isSharingScreen} />}
        tooltip={isSharingScreen ? 'Stop sharing' : 'Share your screen'}
      />

      {/* CC Live Captions Toggle */}
      <ControlBtn
        id="btn-toggle-captions"
        onClick={toggleCaptions}
        active={captionsEnabled}
        activeColor="purple"
        label={isTranscribing ? '● AI Live' : captionsEnabled ? 'CC On' : 'CC Off'}
        icon={<CaptionsIcon />}
        tooltip={captionsEnabled ? 'Turn off live subtitles' : 'Turn on live subtitles'}
      />

      {/* Translation Settings */}
      <ControlBtn
        id="btn-translation-settings"
        onClick={onOpenTranslateSettings}
        active={false}
        label={`➔ ${targetLanguageObj.code.toUpperCase()}`}
        icon={<GlobeIcon />}
        tooltip="AI Translation & Language Settings"
      />

      {/* TTS Read Aloud Quick Toggle */}
      <ControlBtn
        id="btn-toggle-tts"
        onClick={toggleSpeakTranslations}
        active={speakTranslations}
        activeColor="purple"
        label={speakTranslations ? 'TTS On' : 'TTS Off'}
        icon={<SpeakerIcon active={speakTranslations} />}
        tooltip={speakTranslations ? 'Disable audio read-aloud' : 'Enable audio read-aloud for incoming translations'}
      />

      {/* Transcript Drawer Toggle */}
      <ControlBtn
        id="btn-toggle-transcript"
        onClick={onToggleTranscript}
        active={isTranscriptOpen}
        activeColor="purple"
        label="Transcript"
        icon={<TranscriptIcon />}
        tooltip="Open conversation transcript history"
      />

      {/* Hang up */}
      <button
        id="btn-leave-call"
        className={`${styles.btn} ${styles.danger}`}
        onClick={onLeave}
        aria-label="Leave call"
        title="Leave call"
      >
        <span className={styles.icon}><PhoneOffIcon /></span>
        <span className={styles.label}>Leave</span>
      </button>
    </div>
  );
}

function ControlBtn({ id, onClick, active, activeColor = 'red', label, icon, tooltip }) {
  return (
    <button
      id={id}
      className={`${styles.btn} ${active ? styles[`active_${activeColor}`] : ''}`}
      onClick={onClick}
      aria-label={tooltip}
      aria-pressed={active}
      title={tooltip}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
