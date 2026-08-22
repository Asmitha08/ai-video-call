import { useRef, useEffect, useState } from 'react';
import { useCall } from '../context/CallContext.jsx';
import { socket } from '../lib/socket.js';
import LiveCaptionsOverlay from './LiveCaptionsOverlay.jsx';
import styles from './VideoGrid.module.css';

/**
 * Renders the local video tile plus one tile per remote participant.
 * Supports up to 9 participants with a CSS-grid auto-layout.
 */
export default function VideoGrid() {
  const { localStream, remoteParticipants, room, isAudioMuted, isVideoOff } = useCall();
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const remoteEntries = Object.entries(remoteParticipants);
  const totalTiles = 1 + remoteEntries.length;

  return (
    <div
      className={styles.grid}
      data-tiles={Math.min(totalTiles, 9)}
      style={{ '--tile-count': totalTiles }}
    >
      {/* ── Local tile ─────────────────────────────────────────────────────── */}
      <div className={`${styles.tile} ${styles.local}`}>
        {isVideoOff ? (
          <div className={styles.avatarBox}>
            <span className={styles.avatarInitial}>
              {room?.displayName?.[0]?.toUpperCase() ?? 'Y'}
            </span>
          </div>
        ) : (
          <video
            id="video-local"
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={styles.video}
          />
        )}

        {/* Overlay indicators */}
        <div className={styles.tileOverlay}>
          <span className={styles.nameTag}>
            {room?.displayName ?? 'You'}
            {isAudioMuted && <span className={styles.mutedIcon} title="Muted">🔇</span>}
          </span>
        </div>

        {/* Live Subtitle Overlay */}
        <LiveCaptionsOverlay targetSocketId={socket.id} />

        {isVideoOff && (
          <div className={styles.videoOffBadge} title="Camera off">📷</div>
        )}
      </div>

      {/* ── Remote tiles ───────────────────────────────────────────────────── */}
      {remoteEntries.map(([socketId, participant]) => (
        <RemoteTile key={socketId} socketId={socketId} participant={participant} />
      ))}

      {/* ── Invite panel — shown when alone in the room ─────────────────── */}
      {remoteEntries.length === 0 && room && (
        <InvitePanel roomId={room.roomId} />
      )}
    </div>
  );
}

function RemoteTile({ socketId, participant }) {
  const videoRef = useRef(null);
  const { stream, displayName, audioEnabled, videoEnabled } = participant;

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={styles.tile}>
      {!videoEnabled || !stream ? (
        <div className={styles.avatarBox}>
          <span className={styles.avatarInitial}>
            {displayName?.[0]?.toUpperCase() ?? '?'}
          </span>
        </div>
      ) : (
        <video
          id={`video-remote-${socketId}`}
          ref={videoRef}
          autoPlay
          playsInline
          className={styles.video}
        />
      )}

      <div className={styles.tileOverlay}>
        <span className={styles.nameTag}>
          {displayName ?? socketId.slice(0, 6)}
          {!audioEnabled && <span className={styles.mutedIcon} title="Muted">🔇</span>}
        </span>
      </div>

      {/* Live Subtitle Overlay */}
      <LiveCaptionsOverlay targetSocketId={socketId} />

      {!stream && (
        <div className={styles.connectingBadge}>
          <span className={styles.connectingDot} />
          Connecting…
        </div>
      )}
    </div>
  );
}

/**
 * Full-tile invite card shown when the local user is alone in the room.
 * Detects if the page is running on localhost and warns that the link
 * won't work for remote users — shows the LAN IP link instead.
 */
function InvitePanel({ roomId }) {
  const [copied, setCopied] = useState(false);

  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  // If on localhost, build a LAN IP link the other person can actually use.
  // The LAN IP is baked in at build/dev time via the env variable.
  const lanIp = import.meta.env.VITE_LAN_IP || window.location.hostname;
  const shareHost = isLocalhost ? `${lanIp}:${window.location.port}` : window.location.host;
  const shareOrigin = `${window.location.protocol}//${shareHost}`;
  const joinUrl = `${shareOrigin}/join/${roomId}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(joinUrl);
    } catch {
      const el = document.createElement('textarea');
      el.value = joinUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function share() {
    try {
      await navigator.share({ title: 'Join my AICall', text: `Join with code: ${roomId}`, url: joinUrl });
    } catch {
      copyLink();
    }
  }

  return (
    <div className={`${styles.tile} ${styles.invitePanel}`}>
      {/* Animated ring */}
      <div className={styles.waitingPulse}>
        <div className={styles.waitingRing} />
        <span className={styles.waitingIcon}>👥</span>
      </div>

      <p className={styles.waitingText}>You're the only one here</p>

      {/* ── Localhost warning ─────────────────────────────────────────────── */}
      {isLocalhost && (
        <div className={styles.localhostWarning}>
          <span className={styles.warnIcon}>⚠</span>
          <span>
            <strong>localhost links only work on your own machine.</strong><br />
            Share the link below — it uses your network IP so others on the same WiFi can join.
          </span>
        </div>
      )}

      <p className={styles.waitingHint}>
        {isLocalhost
          ? `Send this link (requires same Wi-Fi network):`
          : `Send this link to invite others:`}
      </p>

      {/* Shareable link row */}
      <div className={styles.linkRow}>
        <input
          id="invite-link-input"
          className={styles.linkInput}
          type="text"
          readOnly
          value={joinUrl}
          onFocus={(e) => e.target.select()}
          aria-label="Invite link"
        />
        <button
          id="btn-invite-copy"
          className={`${styles.linkCopyBtn} ${copied ? styles.linkCopySuccess : ''}`}
          onClick={copyLink}
          aria-label="Copy invite link"
        >
          {copied ? '✓ Copied!' : '⎘ Copy'}
        </button>
      </div>

      {/* Room code badge */}
      <div className={styles.codeRow}>
        <span className={styles.codeLabel}>Room code:</span>
        <code className={styles.codeChip}>{roomId}</code>
      </div>

      {/* Native share */}
      {typeof navigator.share === 'function' && (
        <button id="btn-invite-share" className={styles.shareBtn} onClick={share}>
          ↗ Share Invite
        </button>
      )}
    </div>
  );
}

