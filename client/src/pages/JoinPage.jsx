import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCall } from '../context/CallContext.jsx';
import styles from './JoinPage.module.css';

export default function JoinPage() {
  const { roomId: paramRoomId } = useParams();
  const [roomId, setRoomId] = useState(paramRoomId || '');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  const { joinRoom, startLocalStream, stopLocalStream, callError } = useCall();
  const navigate = useNavigate();
  const joinedRef = useRef(false);

  // Acquire camera + mic in the background while the user fills in the form.
  // This means by the time they hit "Join", the stream is already live and
  // joinRoom() will reuse it via the idempotency guard — no second getUserMedia call.
  useEffect(() => {
    startLocalStream().catch(() => {});
    return () => {
      if (!joinedRef.current) stopLocalStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleJoin(e) {
    e.preventDefault();
    if (!roomId.trim()) { setError('Enter a room code'); return; }
    if (!displayName.trim()) { setError('Enter your display name'); return; }

    setError('');
    setJoining(true);
    try {
      await joinRoom(roomId.trim().toUpperCase(), displayName.trim());
      joinedRef.current = true;
      navigate(`/call/${roomId.trim().toUpperCase()}`);
    } catch (err) {
      setError(err.message || 'Failed to join. Check the room code.');
      setJoining(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back</button>
        <h1 className={styles.title}>Join a Call</h1>
        <p className={styles.subtitle}>Enter your room code and display name to connect.</p>

        <form className={styles.form} onSubmit={handleJoin} noValidate>
          <label className={styles.label} htmlFor="input-room-code">Room Code</label>
          <input
            id="input-room-code"
            className={styles.input}
            type="text"
            placeholder="e.g. A1B2C3D4"
            maxLength={8}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          />

          <label className={styles.label} htmlFor="input-display-name">Your Name</label>
          <input
            id="input-display-name"
            className={styles.input}
            type="text"
            placeholder="Your display name"
            maxLength={32}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin(e)}
          />

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button
            id="btn-join-submit"
            className={styles.btnJoin}
            type="submit"
            disabled={joining}
          >
            {joining ? (
              <><span className={styles.spinner} aria-hidden="true" /> Connecting…</>
            ) : 'Join Call'}
          </button>
        </form>
      </div>
    </main>
  );
}
