import { useTranslation } from '../context/TranslationContext.jsx';
import { getLanguageByCode } from '../lib/languages.js';
import styles from './LiveCaptionsOverlay.module.css';

/**
 * Floating real-time subtitles overlay.
 * Renders:
 * - Line 1: Original Spoken Transcript (with live streaming cursor)
 * - Line 2: Translated Subtitle (Prominently displayed below)
 */
export default function LiveCaptionsOverlay({ targetSocketId }) {
  const { liveCaptions, captionsEnabled, targetLanguage } = useTranslation();

  if (!captionsEnabled) return null;

  let caption = null;
  if (targetSocketId) {
    caption =
      liveCaptions[targetSocketId] ||
      (targetSocketId === socket.id ? liveCaptions['local'] : null) ||
      (targetSocketId === 'local' && socket.id ? liveCaptions[socket.id] : null);
  }
  
  if (!caption && !targetSocketId) {
    // Global mode: pick the most recent active caption
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
          <span className={styles.langPill}>
            {sourceLangObj.flag} {sourceLangObj.name}
            {isDifferentLang && (
              <>
                <span className={styles.arrow}>➔</span>
                {targetLangObj.flag} {targetLangObj.name}
              </>
            )}
          </span>
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
