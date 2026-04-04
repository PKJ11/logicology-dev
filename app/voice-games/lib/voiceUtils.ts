"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

// ─── Browser Support ──────────────────────────────────────────────────────────

const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  if (typeof window === "undefined") return null;
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  return SR ? (SR as SpeechRecognitionConstructor) : null;
};

export const isBrowserSupported = (): boolean =>
  getSpeechRecognition() !== null;

// ─── Beep ─────────────────────────────────────────────────────────────────────

export const playBeep = (
  frequency = 880,
  durationMs = 200,
  volume = 0.4
): Promise<void> =>
  new Promise((resolve) => {
    try {
      const ctx = new (
        (window as any).AudioContext || (window as any).webkitAudioContext
      )();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000
      );
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
      osc.onended = () => { ctx.close(); resolve(); };
    } catch {
      resolve();
    }
  });

// ─── Listening Session ────────────────────────────────────────────────────────

export interface ListeningSessionCallbacks {
  onTranscript: (transcript: string, isFinal: boolean) => void;
  onTick: (secondsLeft: number) => void;
  onComplete: (finalTranscript: string) => void;
  onError: (error: string) => void;
}

/**
 * Full structured flow:
 *  1. Play a beep
 *  2. Open a N-second speech recognition window (continuous=true)
 *  3. Tick down each second via onTick
 *  4. On end / timeout → onComplete with best transcript captured
 *
 * Returns cancel() — safe to call at any time including on unmount.
 */
export const startListeningSession = (
  callbacks: ListeningSessionCallbacks,
  language = "en-US",
  windowSeconds = 10
): (() => void) => {
  const { onTranscript, onTick, onComplete, onError } = callbacks;

  let cancelled = false;
  let recognition: SpeechRecognitionInstance | null = null;
  let tickInterval: ReturnType<typeof setInterval> | null = null;
  let sessionTimeout: ReturnType<typeof setTimeout> | null = null;
  let bestTranscript = "";
  let sessionEnded = false;

  const cleanup = () => {
    if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
    if (sessionTimeout) { clearTimeout(sessionTimeout); sessionTimeout = null; }
  };

  const finish = (transcript: string) => {
    if (sessionEnded) return;
    sessionEnded = true;
    cleanup();

    if (recognition) {
      try {
        recognition.onend = null;   // prevent double-finish
        recognition.onerror = null; // suppress abort error
        recognition.stop();
      } catch { /* ignore */ }
      recognition = null;
    }

    onComplete(transcript.trim());
  };

  const cancel = () => { cancelled = true; finish(bestTranscript); };

  // Step 1 — beep, then open recognition
  playBeep().then(() => {
    if (cancelled) return;

    const SR = getSpeechRecognition();
    if (!SR) { onError("Speech recognition not supported."); return; }

    recognition = new SR();
    recognition.continuous = true;      // keep mic open for full window
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t + " ";
        else interim += t;
      }
      if (final) bestTranscript = final;
      onTranscript(final || interim, !!final);
    };

    // "aborted" and "no-speech" are harmless — swallow them
    recognition.onerror = (event: any) => {
      const err: string = event.error ?? "";
      if (err === "aborted" || err === "no-speech") return;
      onError(`Recognition error: ${err}`);
      finish(bestTranscript);
    };

    // Browser closed session early — finalise with what we have
    recognition.onend = () => finish(bestTranscript);

    try { recognition.start(); } catch (e: any) {
      onError(`Could not start: ${e?.message ?? e}`);
      return;
    }

    // Step 2 — countdown tick
    let secondsLeft = windowSeconds;
    onTick(secondsLeft);
    tickInterval = setInterval(() => {
      secondsLeft -= 1;
      onTick(secondsLeft);
      if (secondsLeft <= 0) { clearInterval(tickInterval!); tickInterval = null; }
    }, 1000);

    // Step 3 — hard cut-off
    sessionTimeout = setTimeout(() => finish(bestTranscript), windowSeconds * 1000);
  });

  return cancel;
};

// ─── TTS ─────────────────────────────────────────────────────────────────────

export const speakText = (text: string, language = "en-US"): void => {
  if (typeof window === "undefined") return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

// ─── Number Extraction ────────────────────────────────────────────────────────

export const extractNumberFromTranscript = (transcript: string): number | null => {
  const cleaned = transcript.toLowerCase().trim();

  const digitMatch = cleaned.match(/\d+/);
  if (digitMatch) return parseInt(digitMatch[0], 10);

  const wordMap: Record<string, number> = {
    zero: 0, oh: 0,
    one: 1, won: 1,
    two: 2, to: 2, too: 2,
    three: 3, tree: 3,
    four: 4, for: 4, fore: 4,
    five: 5, six: 6, seven: 7,
    eight: 8, ate: 8,
    nine: 9, ten: 10,
    eleven: 11, twelve: 12,
    thirteen: 13, fourteen: 14, fifteen: 15,
    sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fifty: 50,
    sixty: 60, seventy: 70, eighty: 80, ninety: 90,
    hundred: 100,
  };

  // Handle compound: "twenty five" → 25
  const words = cleaned.split(/\s+/);
  let tens = 0, ones = 0;
  for (const w of words) {
    const v = wordMap[w];
    if (v === undefined) continue;
    if (v >= 20) tens = v;
    else ones = v;
  }
  if (tens > 0 || ones > 0) return tens + ones;

  return null;
};

export const parseAnswer = (answer: string): { numbers: number[]; sum: number } => {
  const numbers = answer
    .split(/[\s+,；、and&]+/)
    .map((p) => parseInt(p.trim(), 10))
    .filter((n) => !isNaN(n));
  return { numbers, sum: numbers.reduce((a, b) => a + b, 0) };
};