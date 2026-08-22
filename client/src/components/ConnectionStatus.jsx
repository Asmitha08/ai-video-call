import styles from './ConnectionStatus.module.css';

/**
 * Shows the current WebRTC call status and elapsed time.
 * @param {{ status: string, elapsed: number }} props
 */
export default function ConnectionStatus({ status, elapsed }) {
  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className={styles.container}>
      <span className={`${styles.dot} ${styles[status]}`} aria-hidden="true" />
      <span className={styles.label}>
        {status === 'idle'       && 'Not connected'}
        {status === 'connecting' && 'Connecting…'}
        {status === 'connected'  && fmt(elapsed)}
      </span>
    </div>
  );
}
