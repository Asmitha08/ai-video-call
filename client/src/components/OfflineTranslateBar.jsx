import { useState, useMemo, useRef } from 'react';
import { useTranslation } from '../context/TranslationContext.jsx';
import { DATASET_PHRASES, DATASET_VOCABULARY, OFFLINE_CATEGORIES, RESEARCH_BENCHMARKS } from '../lib/offlineDataset.js';
import { DATASET_STATS, translateOffline, getPhoneticFallback } from '../lib/offlineTranslator.js';
import { WavRecorder, blobToBase64 } from '../lib/wavRecorder.js';
import styles from './OfflineTranslateBar.module.css';

export default function OfflineTranslateBar() {
  const {
    myLanguage,
    setMyLanguage,
    targetLanguage,
    setTargetLanguage,
    myLanguageObj,
    targetLanguageObj,
    supportedLanguages,
    sendManualCaption,
    testVoice,
    unlockTTS,
    speakText,
  } = useTranslation();

  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [datasetSearch, setDatasetSearch] = useState('');
  const [modalTab, setModalTab] = useState('sentences'); // 'sentences' | 'vocab' | 'research'

  // Offline Voice Recognition (STT) states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('');
  const [recognizedResult, setRecognizedResult] = useState(null);
  const recorderRef = useRef(null);
  const stopTimerRef = useRef(null);

  // Stop recording and send audio to local offline STT service
  async function stopVoiceRecording() {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    if (!recorderRef.current) return;

    setIsRecording(false);
    setRecordingStatus('⚡ Transcribing speech offline...');

    try {
      const blob = recorderRef.current.stop();
      recorderRef.current = null;

      if (!blob || blob.size < 500) {
        setRecordingStatus('No audio detected. Please speak closer to mic.');
        setTimeout(() => setRecordingStatus(''), 3000);
        return;
      }

      const base64 = await blobToBase64(blob);
      const res = await fetch('/api/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType: 'audio/wav',
          sourceLang: myLanguage,
        }),
      });

      if (!res.ok) {
        throw new Error(`STT server returned ${res.status}`);
      }

      const data = await res.json();
      const rawText = data?.transcript ? data.transcript.trim() : '';

      if (!rawText) {
        setRecordingStatus('No speech recognized. Try speaking louder or closer to mic.');
        setTimeout(() => setRecordingStatus(''), 3500);
        return;
      }

      setRecordingStatus('');
      setInputVal(rawText);

      // Translate offline
      const tgt = translateOffline(rawText, myLanguage, targetLanguage);
      const pho = getPhoneticFallback(tgt, targetLanguage);
      setRecognizedResult({
        original: rawText,
        translated: tgt,
        phonetic: pho,
      });

      // Send caption & speak out loud
      handleSend(rawText);
    } catch (err) {
      console.warn('[OfflineTranslateBar:stt] failed:', err);
      setRecordingStatus('Recognition error: ' + err.message);
      setTimeout(() => setRecordingStatus(''), 3500);
    }
  }

  // Toggle voice recording (Start / Stop)
  async function handleToggleVoiceRecord() {
    if (isRecording) {
      await stopVoiceRecording();
      return;
    }

    try {
      unlockTTS();
      setRecognizedResult(null);
      setRecordingStatus('🎙️ Listening... Speak now (e.g. "eighty nine")');

      const recorder = new WavRecorder();
      await recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);

      // Auto-stop after 3.8s of speech capture
      stopTimerRef.current = setTimeout(() => {
        stopVoiceRecording();
      }, 3800);
    } catch (err) {
      console.warn('[OfflineTranslateBar:mic] error starting recorder:', err);
      setRecordingStatus('Microphone error: ' + err.message);
      setIsRecording(false);
      setTimeout(() => setRecordingStatus(''), 3500);
    }
  }


  // Extract phrases based on selected category
  const filteredPhrases = useMemo(() => {
    const entries = Object.entries(DATASET_PHRASES);
    if (selectedCategory === 'All') return entries;
    return entries.filter(([_, item]) => item.category === selectedCategory);
  }, [selectedCategory]);

  function handleSend(text) {
    if (!text || !text.trim()) return;
    unlockTTS();
    sendManualCaption(text.trim());
    setInputVal('');
  }

  function handleSwapLanguages() {
    const currentSrc = myLanguage;
    const currentTgt = targetLanguage;
    setMyLanguage(currentTgt);
    setTargetLanguage(currentSrc);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.bar}>
          {/* Header Bar */}
          <div className={styles.header}>
            <div className={styles.badgeGroup}>
              <span className={styles.badgePulse} />
              <span className={styles.badgeTitle}>⚡ Offline AI Translator</span>
              <span className={styles.datasetPill} title="Embedded offline translation datasets">
                📚 25 Languages · 625 Pairs
              </span>
            </div>

            {/* Quick Language Switcher & Controls */}
            <div className={styles.headerActions}>
              <div className={styles.langSelector}>
                <select
                  className={styles.inlineSelect}
                  value={myLanguage}
                  onChange={(e) => setMyLanguage(e.target.value)}
                  title="Source Language"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.code.toUpperCase()}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className={styles.swapBtn}
                  onClick={handleSwapLanguages}
                  title="Swap source and target language"
                >
                  ⇄
                </button>

                <select
                  className={styles.inlineSelect}
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  title="Target Language"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className={styles.datasetBtn}
                onClick={() => setShowDatasetModal(true)}
                title="Browse all stored offline phrase datasets"
              >
                📖 Dataset ({DATASET_STATS.totalPhrases})
              </button>

              <button
                type="button"
                className={styles.voiceTestBtn}
                onClick={() => {
                  unlockTTS();
                  testVoice(targetLanguage);
                }}
                title="Test offline voice synthesis in target language"
              >
                🔊 {targetLanguageObj.name.split(' ')[0]}
              </button>

              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-label={isExpanded ? 'Collapse translator' : 'Expand translator'}
              >
                {isExpanded ? '▾' : '▴'}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className={styles.content}>
              {/* Category Filter Pills */}
              <div className={styles.categoryRow}>
                {['All', 'Greetings & Pleasantries', 'Video Calling & Meetings', 'Questions & Clarifications', 'Courtesy & Common Phrases'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.catPill} ${selectedCategory === cat ? styles.catPillActive : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Quick-tap common conversational chips in current source language */}
              <div className={styles.chipRow}>
                {filteredPhrases.slice(0, 10).map(([enKey, langMap]) => {
                  const displayText = (myLanguage === 'en' || !langMap[myLanguage]) ? (langMap.en || enKey) : langMap[myLanguage];
                  return (
                    <button
                      key={enKey}
                      type="button"
                      className={styles.chip}
                      onClick={() => handleSend(displayText)}
                      title={`Translate "${displayText}" into ${targetLanguageObj.name} and speak offline`}
                    >
                      {displayText}
                    </button>
                  );
                })}
              </div>

              {/* Custom translation input bar with Offline Speech Recognition (STT) */}
              <form
                className={styles.formRow}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputVal);
                }}
              >
                <input
                  id="input-offline-translate"
                  type="text"
                  className={styles.input}
                  placeholder={`Translate any ${myLanguageObj.name} text into ${targetLanguageObj.name} & speak offline...`}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />

                <button
                  id="btn-offline-speech-record"
                  type="button"
                  className={`${styles.micBtn} ${isRecording ? styles.micBtnRecording : ''}`}
                  onClick={handleToggleVoiceRecord}
                  title={isRecording ? 'Click to stop recording' : 'Record voice in offline mode (e.g., speak "eighty nine")'}
                >
                  {isRecording ? '🔴 Listening...' : '🎙️ Voice Input'}
                </button>

                <button
                  id="btn-offline-translate-submit"
                  type="submit"
                  className={styles.submitBtn}
                  disabled={!inputVal.trim() || isRecording}
                >
                  ➔ Translate &amp; Speak
                </button>
              </form>

              {/* Offline Voice Recognition Status & Live Output */}
              {recordingStatus && (
                <div className={styles.voiceStatusRow}>
                  <span>{recordingStatus}</span>
                </div>
              )}

              {recognizedResult && !recordingStatus && (
                <div className={styles.voiceStatusRow}>
                  <div className={styles.voiceResultChip}>
                    <span className={styles.voiceResultOriginal}>🎙️ &ldquo;{recognizedResult.original}&rdquo;</span>
                    <span>➔</span>
                    <span>{recognizedResult.translated}</span>
                    {recognizedResult.phonetic && (
                      <span className={styles.voiceResultPhonetic}>[{recognizedResult.phonetic}]</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.voiceCloseBtn}
                    onClick={() => setRecognizedResult(null)}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dataset Explorer Modal */}
      {showDatasetModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDatasetModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>📚 Stored Offline Multilingual Datasets</h3>
                <p className={styles.modalSubtitle}>
                  {DATASET_STATS.totalPhrases} full conversational phrases · {DATASET_STATS.totalVocabulary} vocabulary tokens · 25 languages · 100% Offline
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowDatasetModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className={styles.modalTabsRow}>
              <button
                type="button"
                className={`${styles.modalTabBtn} ${modalTab === 'sentences' ? styles.modalTabBtnActive : ''}`}
                onClick={() => setModalTab('sentences')}
              >
                💬 Sentences ({DATASET_STATS.totalPhrases})
              </button>
              <button
                type="button"
                className={`${styles.modalTabBtn} ${modalTab === 'vocab' ? styles.modalTabBtnActive : ''}`}
                onClick={() => setModalTab('vocab')}
              >
                📖 Vocabulary ({DATASET_STATS.totalVocabulary})
              </button>
              <button
                type="button"
                className={`${styles.modalTabBtn} ${modalTab === 'research' ? styles.modalTabBtnActive : ''}`}
                onClick={() => setModalTab('research')}
              >
                🏛️ Research Papers
              </button>
            </div>

            {modalTab !== 'research' && (
              <div className={styles.modalSearchRow}>
                <input
                  type="text"
                  className={styles.modalSearchInput}
                  placeholder={
                    modalTab === 'sentences'
                      ? 'Search dataset sentences in any language...'
                      : 'Search vocabulary words in any language...'
                  }
                  value={datasetSearch}
                  onChange={(e) => setDatasetSearch(e.target.value)}
                />
              </div>
            )}

            {/* Tab 1: Sentences */}
            {modalTab === 'sentences' && (
              <div className={styles.datasetList}>
                {Object.entries(DATASET_PHRASES)
                  .filter(([enKey, map]) => {
                    if (!datasetSearch.trim()) return true;
                    const q = datasetSearch.toLowerCase();
                    return (
                      enKey.includes(q) ||
                      (map[myLanguage] && map[myLanguage].toLowerCase().includes(q)) ||
                      (map[targetLanguage] && map[targetLanguage].toLowerCase().includes(q))
                    );
                  })
                  .map(([enKey, map]) => {
                    const srcText = map[myLanguage] || map.en || enKey;
                    const tgtText = map[targetLanguage] || map.en || enKey;
                    return (
                      <div key={enKey} className={styles.datasetItem}>
                        <div className={styles.datasetTextCol}>
                          <div className={styles.datasetCategoryTag}>{map.category}</div>
                          <div className={styles.datasetSrc}>
                            <span className={styles.itemLangTag}>{myLanguageObj.flag} {myLanguage.toUpperCase()}:</span> {srcText}
                          </div>
                          <div className={styles.datasetTgt}>
                            <span className={styles.itemLangTag}>{targetLanguageObj.flag} {targetLanguage.toUpperCase()}:</span> {tgtText}
                          </div>
                        </div>

                        <div className={styles.datasetActions}>
                          <button
                            type="button"
                            className={styles.datasetSpeakBtn}
                            onClick={() => {
                              unlockTTS();
                              speakText(tgtText, targetLanguage);
                            }}
                            title="Speak translated text offline"
                          >
                            🔊 Speak
                          </button>
                          <button
                            type="button"
                            className={styles.datasetSendBtn}
                            onClick={() => {
                              handleSend(srcText);
                              setShowDatasetModal(false);
                            }}
                            title="Send as live call subtitle"
                          >
                            ➔ Send
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Tab 2: Vocabulary */}
            {modalTab === 'vocab' && (
              <div className={styles.datasetList}>
                {Object.entries(DATASET_VOCABULARY)
                  .filter(([enWord, map]) => {
                    if (!datasetSearch.trim()) return true;
                    const q = datasetSearch.toLowerCase();
                    return (
                      enWord.includes(q) ||
                      (map[myLanguage] && map[myLanguage].toLowerCase().includes(q)) ||
                      (map[targetLanguage] && map[targetLanguage].toLowerCase().includes(q))
                    );
                  })
                  .map(([enWord, map]) => {
                    const srcText = map[myLanguage] || map.en || enWord;
                    const tgtText = map[targetLanguage] || map.en || enWord;
                    return (
                      <div key={enWord} className={styles.datasetItem}>
                        <div className={styles.datasetTextCol}>
                          <div className={styles.datasetSrc}>
                            <span className={styles.itemLangTag}>{myLanguageObj.flag} {myLanguage.toUpperCase()}:</span> {srcText}
                          </div>
                          <div className={styles.datasetTgt}>
                            <span className={styles.itemLangTag}>{targetLanguageObj.flag} {targetLanguage.toUpperCase()}:</span> {tgtText}
                          </div>
                        </div>

                        <div className={styles.datasetActions}>
                          <button
                            type="button"
                            className={styles.datasetSpeakBtn}
                            onClick={() => {
                              unlockTTS();
                              speakText(tgtText, targetLanguage);
                            }}
                            title="Speak word offline"
                          >
                            🔊 Speak
                          </button>
                          <button
                            type="button"
                            className={styles.datasetSendBtn}
                            onClick={() => {
                              handleSend(srcText);
                              setShowDatasetModal(false);
                            }}
                            title="Send as live subtitle"
                          >
                            ➔ Send
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Tab 3: Research Papers */}
            {modalTab === 'research' && (
              <div className={styles.datasetList}>
                <div className={styles.researchIntro}>
                  <p>
                    All offline datasets in this application are directly derived and curated from leading open-access NLP research publications.
                    These datasets are bundled directly into the browser and require <strong>zero internet connectivity</strong> to translate.
                  </p>
                </div>
                {RESEARCH_BENCHMARKS.map((bench, idx) => (
                  <div key={idx} className={styles.researchCard}>
                    <div className={styles.researchTitle}>{bench.name}</div>
                    <div className={styles.researchPaper}>📄 {bench.paper}</div>
                    <div className={styles.researchDomain}>🎯 <strong>Focus:</strong> {bench.domain}</div>
                    <div className={styles.researchMeta}>
                      ✓ 25 Languages · 625 Any-to-Any Directions · 100% Offline Embed
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
}
