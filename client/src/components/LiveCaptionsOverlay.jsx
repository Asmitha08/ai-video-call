import { useTranslation } from '../context/TranslationContext.jsx';
import { getLanguageByCode } from '../lib/languages.js';
import { socket } from '../lib/socket.js';
import styles from './LiveCaptionsOverlay.module.css';

/**
 * Floating real-time subtitles overlay.
 * Renders:
 * - Line 1: Original Spoken Transcript (with live streaming cursor)
 * - Line 2: Translated Subtitle (Prominently displayed below)
 */
export default function LiveCaptionsOverlay({ targetSocketId }) {
  const { liveCaptions, captionsEnabled, targetLanguage, speakText, unlockTTS } = useTranslation();

  if (!captionsEnabled) return null;

  let caption = null;
  if (targetSocketId && liveCaptions[targetSocketId]) {
    caption = liveCaptions[targetSocketId];
  } else if (liveCaptions['local']) {
    caption = liveCaptions['local'];
  } else if (socket?.id && liveCaptions[socket.id]) {
    caption = liveCaptions[socket.id];
  }

  if (!caption) {
    const entries = Object.values(liveCaptions);
    if (entries.length > 0) {
      caption = entries.sort((a, b) => b.timestamp - a.timestamp)[0];
    }
  }

  if (!caption || !caption.originalText) return null;

  const sourceLangObj = getLanguageByCode(caption.sourceLang);
  const targetLangObj = getLanguageByCode(caption.targetLang || targetLanguage);
  const isDifferentLang =
    caption.sourceLang?.toLowerCase() !== (caption.targetLang || targetLanguage)?.toLowerCase();

  return (
    <div className={styles.captionContainer} aria-live="polite">
      <div className={styles.captionCard}>
        {/* Header: Speaker Name & Language Indicator */}
        <div className={styles.headerRow}>
          <span className={styles.speakerBadge}>
            <span className={styles.pulseDot} />
            {caption.displayName}
            {!caption.isFinal && <span className={styles.liveTag}>LIVE</span>}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className={styles.langPill}>
              {sourceLangObj.flag} {sourceLangObj.name}
              {isDifferentLang && (
                <>
                  <span className={styles.arrow}>➔</span>
                  {targetLangObj.flag} {targetLangObj.name}
                </>
              )}
            </span>
            <button
              type="button"
              title="Speak translation aloud"
              style={{
                background: 'rgba(139, 92, 246, 0.25)',
                color: '#e9d5ff',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '6px',
                padding: '0.15rem 0.4rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                pointerEvents: 'auto',
              }}
              onClick={(e) => {
                e.stopPropagation();
                unlockTTS();
                speakText(caption.translatedText || caption.originalText, caption.targetLang || targetLanguage);
              }}
            >
              🔊
            </button>
          </div>
        </div>

        {/* ── Line 1: Original Spoken Transcript ──────────────────────────────── */}
        <div className={styles.originalLine}>
          <span className={styles.lineTag}>Original:</span> {caption.originalText}
          {!caption.isFinal && <span className={styles.cursor}>▌</span>}
        </div>

        {/* ── Line 2: Translated Subtitle (Below) ──────────────────────────────── */}
        <div className={styles.translatedLine}>
          <span className={styles.translateTag}>Translated:</span> {caption.translatedText || caption.originalText}
        </div>
      </div>
    </div>
  );
}
