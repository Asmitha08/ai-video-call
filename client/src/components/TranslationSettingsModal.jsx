import { useTranslation } from '../context/TranslationContext.jsx';
import styles from './TranslationSettingsModal.module.css';

export default function TranslationSettingsModal({ isOpen, onClose }) {
  const {
    myLanguage,
    setMyLanguage,
    targetLanguage,
    setTargetLanguage,
    speakTranslations,
    setSpeakTranslations,
    captionsEnabled,
    toggleCaptions,
    supportedLanguages,
  } = useTranslation();

  if (!isOpen) return null;

  const quickPresets = [
    { label: '🇺🇸 English ➔ 🇮🇳 Telugu', speak: 'en', translate: 'te' },
    { label: '🇺🇸 English ➔ 🇮🇳 Hindi', speak: 'en', translate: 'hi' },
    { label: '🇺🇸 English ➔ 🇪🇸 Spanish', speak: 'en', translate: 'es' },
    { label: '🇺🇸 English ➔ 🇮🇳 Tamil', speak: 'en', translate: 'ta' },
    { label: '🇮🇳 Telugu ➔ 🇺🇸 English', speak: 'te', translate: 'en' },
    { label: '🇮🇳 Hindi ➔ 🇺🇸 English', speak: 'hi', translate: 'en' },
  ];

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.icon}>🌐</span>
            <h2 className={styles.title}>AI Speech & Translation Settings</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {/* Quick Presets */}
          <div className={styles.settingGroup}>
            <label className={styles.fieldLabel}>⚡ Quick Translation Pairs:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
              {quickPresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  style={{
                    background:
                      myLanguage === p.speak && targetLanguage === p.translate
                        ? 'linear-gradient(135deg, hsl(265, 80%, 55%), hsl(220, 80%, 55%))'
                        : 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setMyLanguage(p.speak);
                    setTargetLanguage(p.translate);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          {/* Spoken Language (Speech to Text) */}
          <div className={styles.settingGroup}>
            <label className={styles.fieldLabel} htmlFor="select-my-lang">
              🗣️ I am speaking in:
            </label>
            <select
              id="select-my-lang"
              className={styles.select}
              value={myLanguage}
              onChange={(e) => setMyLanguage(e.target.value)}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
            <span className={styles.fieldHint}>
              Select the language you will speak into the microphone.
            </span>
          </div>

          {/* Target Language (Translation) */}
          <div className={styles.settingGroup}>
            <label className={styles.fieldLabel} htmlFor="select-target-lang">
              🎯 Translate incoming subtitles to:
            </label>
            <select
              id="select-target-lang"
              className={styles.select}
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
            <span className={styles.fieldHint}>
              Subtitles and Text-to-Speech voice will be translated into this language.
            </span>
          </div>

          <div className={styles.divider} />

          {/* Captions Toggle */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.label}>Live Subtitles (CC)</span>
              <span className={styles.desc}>
                Show floating two-line subtitles on screen during calls.
              </span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={captionsEnabled}
                onChange={toggleCaptions}
              />
              <span className={styles.slider} />
            </label>
          </div>

          {/* Speak translations aloud (TTS) */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.label}>🔊 Read Aloud Translations (TTS)</span>
              <span className={styles.desc}>
                Speak translated subtitles aloud into your headphones/speakers.
              </span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={speakTranslations}
                onChange={(e) => setSpeakTranslations(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.doneBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
