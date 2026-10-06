import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// Pre-compiled PowerShell script for ultra-fast Windows offline speech recognition
const SCRIPT_PATH = path.join(os.tmpdir(), 'offline_sapi_recognizer.ps1');

const PS_SCRIPT = `
param (
    [string]$WavPath,
    [string]$Culture = "en-US"
)

Add-Type -AssemblyName System.Speech

try {
    $engine = New-Object System.Speech.Recognition.SpeechRecognitionEngine

    # 1. Load dictation grammar for free-form continuous speech
    $dictGrammar = New-Object System.Speech.Recognition.DictationGrammar
    $engine.LoadGrammar($dictGrammar)

    # 2. Configure audio input file
    $engine.SetInputToWaveFile($WavPath)

    # 3. Perform synchronous recognition
    $result = $engine.Recognize([TimeSpan]::FromSeconds(8))
    if ($result -and $result.Text) {
        Write-Output $result.Text
    } else {
        Write-Output ""
    }
} catch {
    Write-Output ""
} finally {
    if ($engine) { $engine.Dispose() }
}
`;

// Ensure PowerShell script is written to disk
try {
  fs.writeFileSync(SCRIPT_PATH, PS_SCRIPT, 'utf-8');
} catch (err) {
  console.warn('[offlineStt] failed to write temp script:', err.message);
}

/**
 * Transcribes a WAV audio buffer on Windows using built-in System.Speech.Recognition.
 * Operates 100% offline with ZERO internet connection.
 * @param {Buffer} audioBuffer - WAV audio buffer
 * @param {string} sourceLang - Language code (e.g., 'en', 'en-US')
 * @returns {Promise<string>}
 */
export async function transcribeOfflineWav(audioBuffer, sourceLang = 'en-US') {
  if (!audioBuffer || audioBuffer.length < 500) return '';

  const tempWav = path.join(os.tmpdir(), `stt_${Date.now()}_${Math.random().toString(36).substring(7)}.wav`);

  try {
    // Write buffer to temporary WAV file
    await fs.promises.writeFile(tempWav, audioBuffer);

    // Execute PowerShell offline recognizer
    const { stdout } = await execFileAsync(
      'powershell',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', SCRIPT_PATH, '-WavPath', tempWav],
      { timeout: 7000 }
    );

    const text = stdout ? stdout.trim() : '';
    console.log(`[offlineStt:windows] transcribed offline: "${text}"`);
    return text;
  } catch (err) {
    console.warn('[offlineStt:windows] recognition error:', err.message);
    return '';
  } finally {
    try {
      if (fs.existsSync(tempWav)) {
        await fs.promises.unlink(tempWav);
      }
    } catch {}
  }
}
