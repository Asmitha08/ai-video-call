import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCall } from '../context/CallContext.jsx';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const {
    createRoom,
    startLocalStream,
    stopLocalStream,
    localStream,
    callError,
  } = useCall();

  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [camReady, setCamReady] = useState(false);

  // Track whether the user actually started a call so we know whether to
  // stop the stream on unmount (we keep it alive if navigating to /call).
  const startedCallRef = useRef(false);

  // ── Acquire camera + mic once on mount ─────────────────────────────────────
  // Any permission/device error here is swallowed silently — the preview card
  // just shows the placeholder. The real error is surfaced at call-start time.
  useEffect(() => {
    startLocalStream()
      .then(() => setCamReady(true))
      .catch(() => {
        // Camera unavailable or permission not yet granted — that is fine.
        // The user will be prompted again when they click "Start a Call".
        setCamReady(false);
      });

    return () => {
      // Stop the stream only if the user left without starting a call
      if (!startedCallRef.current) stopLocalStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Wire context localStream → preview <video> element ─────────────────────
  const previewRef = useRef(null);
  useEffect(() => {
    if (previewRef.current && localStream) {
      previewRef.current.srcObject = localStream;
      setCamReady(true);
    }
  }, [localStream]);

  // ── Start a call ────────────────────────────────────────────────────────────
  async function handleStart() {
    if (!displayName.trim()) { setError('Enter your name first'); return; }
    setError('');
    setLoading(true);
    try {
      // createRoom internally calls startLocalStream which is idempotent —
      // if the stream is already live it reuses it; otherwise it requests
      // camera+mic now (showing the browser permission dialog if needed).
      const roomId = await createRoom(displayName.trim());
      startedCallRef.current = true;
      navigate(`/call/${roomId}`);
    } catch (err) {
      setError(err.message || 'Could not access camera/microphone. Check browser permissions.');
      setLoading(false);
    }
  }

  return (
    <main className={styles.landing}>
      {/* Animated background orbs */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={styles.content}>
        {/* ── Left: hero copy ─────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.badge}>✦ Powered by WebRTC</div>
          <h1 className={styles.title}>
            Crystal-clear calls,<br />
            <span className={styles.gradient}>AI-enhanced.</span>
          </h1>
          <p className={styles.subtitle}>
            Real-time peer-to-peer video calling with live AI translation — coming soon.
          </p>

          <div className={styles.nameRow}>
            <input
              id="input-landing-name"
              className={styles.nameInput}
              type="text"
              placeholder="Your display name"
              maxLength={32}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleStart()}
            />
          </div>

          {error && <p className={styles.errorMsg} role="alert">{error}</p>}

          <div className={styles.actions}>
            <button
              id="btn-start-call"
              className={styles.btnPrimary}
              onClick={handleStart}
              disabled={loading}
            >
              {loading && <span className={styles.spinner} aria-hidden="true" />}
              {loading ? 'Starting…' : 'Start a Call'}
            </button>
            <button
              id="btn-join-call"
              className={styles.btnSecondary}
              onClick={() => navigate('/join')}
              disabled={loading}
            >
              Join with Code
            </button>
          </div>

          <ul className={styles.featureList}>
            <li>🔒 End-to-end encrypted via WebRTC</li>
            <li>⚡ Zero plugin required — runs in browser</li>
            <li>🌐 AI translation overlay — coming next</li>
          </ul>
        </section>

        {/* ── Right: live camera preview ──────────────────────────────────── */}
        <div className={styles.previewCard}>
          <video
            ref={previewRef}
            id="video-preview"
            className={styles.previewVideo}
            autoPlay
            muted
            playsInline
          />
          {!camReady && (
            <div className={styles.previewPlaceholder}>
              <span className={styles.previewIcon}>📷</span>
              <p>Requesting camera…</p>
            </div>
          )}
          <div className={styles.previewLabel}>
            {camReady ? '● Live preview' : 'Waiting for camera'}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        AI Video Call · Built with WebRTC &amp; Socket.IO
      </footer>
    </main>
  );
}
