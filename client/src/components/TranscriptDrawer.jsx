import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext.jsx';
import { getLanguageByCode } from '../lib/languages.js';
import styles from './TranscriptDrawer.module.css';

export default function TranscriptDrawer({ isOpen, onClose }) {
  const {
    transcriptHistory,
    clearTranscript,
    targetLanguage,
    sendManualCaption,
  } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcriptHistory, isOpen]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return transcriptHistory;
    const term = searchTerm.toLowerCase();
    return transcriptHistory.filter(
      (item) =>
        item.displayName.toLowerCase().includes(term) ||
        item.originalText.toLowerCase().includes(term) ||
        item.translatedText.toLowerCase().includes(term)
    );
  }, [transcriptHistory, searchTerm]);

  function handleCopyAll() {
    if (transcriptHistory.length === 0) return;

    const formatted = transcriptHistory
      .map((item) => {
        const time = new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return `[${time}] ${item.displayName} (${item.sourceLang?.toUpperCase()}): ${item.originalText}\n -> [${item.targetLang?.toUpperCase()}]: ${item.translatedText}\n`;
      })
      .join('\n');

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportFile() {
    if (transcriptHistory.length === 0) return;

    const formatted = transcriptHistory
      .map((item) => {
        const time = new Date(item.timestamp).toLocaleTimeString();
        return `[${time}] ${item.displayName}:\nOriginal (${item.sourceLang}): ${item.originalText}\nTranslated (${item.targetLang}): ${item.translatedText}\n`;
      })
      .join('\n---\n\n');

    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `call-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!isOpen) return null;

  return (
    <aside className={styles.drawer} aria-label="Call Transcript History">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>📝</span>
          <h2 className={styles.title}>Live Transcript</h2>
          <span className={styles.countBadge}>{transcriptHistory.length}</span>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close transcript">
          ✕
        </button>
      </div>

      {/* Action bar (search + export) */}
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search transcript..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={styles.actionsRow}>
          <button
            className={styles.toolBtn}
            onClick={handleCopyAll}
            disabled={transcriptHistory.length === 0}
            title="Copy full transcript to clipboard"
          >
            {copied ? '✓ Copied' : '⎘ Copy All'}
          </button>
          <button
            className={styles.toolBtn}
            onClick={handleExportFile}
            disabled={transcriptHistory.length === 0}
            title="Export as .txt file"
          >
            ⬇ Export
          </button>
          <button
            className={`${styles.toolBtn} ${styles.dangerBtn}`}
            onClick={clearTranscript}
            disabled={transcriptHistory.length === 0}
            title="Clear transcript history"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Transcript Items */}
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🎙️</span>
            <p className={styles.emptyText}>
              {transcriptHistory.length === 0
                ? 'Speak into your microphone or type a message below to test live translation & read-aloud.'
                : 'No matching entries found.'}
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const time = new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const sLang = getLanguageByCode(item.sourceLang);
            const tLang = getLanguageByCode(item.targetLang || targetLanguage);
            const isTranslated =
              item.sourceLang?.toLowerCase() !== (item.targetLang || targetLanguage)?.toLowerCase();

            return (
              <div key={item.id} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <span className={styles.entrySpeaker}>{item.displayName}</span>
                  <div className={styles.entryMeta}>
                    <span className={styles.entryLang}>
                      {sLang.flag} {sLang.code.toUpperCase()}
                      {isTranslated && ` ➔ ${tLang.flag} ${tLang.code.toUpperCase()}`}
                    </span>
                    <span className={styles.entryTime}>{time}</span>
                  </div>
                </div>

                {/* Translated text */}
                <p className={styles.entryTranslated}>
                  {item.translatedText || item.originalText}
                </p>

                {/* Original text */}
                {isTranslated && item.translatedText !== item.originalText && (
                  <p className={styles.entryOriginal}>
                    <span className={styles.originalTag}>Orig:</span> {item.originalText}
                  </p>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Manual message input */}
      <form
        className={styles.sendBox}
        onSubmit={(e) => {
          e.preventDefault();
          if (messageText.trim()) {
            sendManualCaption(messageText.trim());
            setMessageText('');
          }
        }}
      >
        <input
          type="text"
          className={styles.sendInput}
          placeholder="Type message to translate & speak..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!messageText.trim()}
          title="Send translated subtitle"
        >
          Send
        </button>
      </form>
    </aside>
  );
}
