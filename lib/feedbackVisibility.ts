"use client";

import { useEffect, useSyncExternalStore } from "react";

// Lets a game hide the floating Feedback tab while a player is mid-round,
// so the tab never sits on top of answers, keypad keys or game controls.
// Menu and results screens simply don't call the hook, so the tab shows there.

let hideRequests = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Call from a game screen: while `hide` is true the Feedback tab is not rendered. */
export function useHideFeedbackTab(hide: boolean) {
  useEffect(() => {
    if (!hide) return;
    hideRequests++;
    emit();
    return () => {
      hideRequests--;
      emit();
    };
  }, [hide]);
}

/** Read by the Feedback tab itself. */
export function useFeedbackTabHidden() {
  return useSyncExternalStore(
    subscribe,
    () => hideRequests > 0,
    () => false
  );
}
