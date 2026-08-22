import { useState } from 'react';
import styles from './RoomInfo.module.css';

/**
 * Shows the room code with buttons to copy the full join link or share it.
 * @param {{ roomId: string }} props
 */
export default function RoomInfo({ roomId }) {
  const [copied, setCopied] = useState(false);

  const joinUrl = `${window.location.origin}/join/${roomId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers that block clipboard without interaction
      const el = document.createElement('textarea');
      el.value = joinUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: 'Join my AICall video call',
        text: `Join my video call with room code: ${roomId}`,
        url: joinUrl,
      });
    } catch {
      // Share cancelled or not supported — fall back to copy
      handleCopy();
    }
  }

  const canShare = typeof navigator.share === 'function';

  return (
    <div className={styles.container}>
      <span className={styles.label}>Room</span>
      <code id="room-code-display" className={styles.code}>{roomId}</code>

      <button
        id="btn-copy-room-link"
        className={`${styles.btn} ${copied ? styles.btnSuccess : ''}`}
        onClick={handleCopy}
        aria-label="Copy invite link"
        title={`Copy: ${joinUrl}`}
      >
        {copied ? (
          <><CheckIcon /> Copied!</>
        ) : (
          <><LinkIcon /> Copy Link</>
        )}
      </button>

      {canShare && (
        <button
          id="btn-share-room"
          className={styles.btn}
          onClick={handleShare}
          aria-label="Share room link"
          title="Share invite"
        >
          <ShareIcon /> Share
        </button>
      )}
    </div>
  );
}

const LinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
