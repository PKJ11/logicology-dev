"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  startListeningSession,
  extractNumberFromTranscript,
  isBrowserSupported,
} from "./voiceUtils";
import { GamePhase } from "./types";

export interface UseVoiceGameOptions {
  language?: string;
  listenWindowSeconds?: number;
  /** ms to show result before resetting to idle */
  resultDisplayMs?: number;
  onCorrect?: (answer: number) => void;
  onWrong?: (userAnswer: number | null, correctAnswer: number) => void;
}

export interface UseVoiceGameReturn {
  phase: GamePhase;
  transcript: string;
  secondsLeft: number;
  isSupported: boolean;
  /** Kick off a full question cycle */
  askQuestion: (questionText: string, correctAnswer: number) => void;
  /** Safe cleanup — call on unmount or "Back" */
  abort: () => void;
}

export function useVoiceGame(opts: UseVoiceGameOptions = {}): UseVoiceGameReturn {
  const {
    language = "en-US",
    listenWindowSeconds = 10,
    resultDisplayMs = 1800,
    onCorrect,
    onWrong,
  } = opts;

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [transcript, setTranscript] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(listenWindowSeconds);
  const [isSupported] = useState(isBrowserSupported);

  const cancelRef = useRef<(() => void) | null>(null);
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelRef.current?.();
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, []);

  const abort = useCallback(() => {
    cancelRef.current?.();
    if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    if (mountedRef.current) {
      setPhase("idle");
      setTranscript("");
      setSecondsLeft(listenWindowSeconds);
    }
  }, [listenWindowSeconds]);

  const askQuestion = useCallback(
    (questionText: string, correctAnswer: number) => {
      if (!mountedRef.current) return;

      cancelRef.current?.();
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);

      setTranscript("");
      setSecondsLeft(listenWindowSeconds);
      setPhase("speaking");

      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.lang = language;
      utterance.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);

      utterance.onend = () => {
        if (!mountedRef.current) return;
        setPhase("listening");

        cancelRef.current = startListeningSession(
          {
            // Only update transcript on FINAL results — no interim flicker
            onTranscript: (t, isFinal) => {
              if (mountedRef.current && isFinal) setTranscript(t.trim());
            },
            onTick: (s) => {
              if (mountedRef.current) setSecondsLeft(s);
            },
            onComplete: (finalT) => {
              if (!mountedRef.current) return;
              const userAnswer = extractNumberFromTranscript(finalT);
              const isCorrect = userAnswer !== null && userAnswer === correctAnswer;

              setTranscript(finalT || "…(no answer)…");
              setPhase("result");

              if (isCorrect) onCorrect?.(userAnswer!);
              else onWrong?.(userAnswer, correctAnswer);

              resultTimerRef.current = setTimeout(() => {
                if (mountedRef.current) {
                  setPhase("idle");
                  setTranscript("");
                  setSecondsLeft(listenWindowSeconds);
                }
              }, resultDisplayMs);
            },
            onError: () => {
              if (!mountedRef.current) return;
              setPhase("result");
              onWrong?.(null, correctAnswer);
              resultTimerRef.current = setTimeout(() => {
                if (mountedRef.current) {
                  setPhase("idle");
                  setTranscript("");
                  setSecondsLeft(listenWindowSeconds);
                }
              }, resultDisplayMs);
            },
          },
          language,
          listenWindowSeconds
        );
      };
    },
    [language, listenWindowSeconds, resultDisplayMs, onCorrect, onWrong]
  );

  return { phase, transcript, secondsLeft, isSupported, askQuestion, abort };
}