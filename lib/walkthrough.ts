const STORAGE_KEY = "unmark_walkthrough_v1";

export function isWalkthroughDone(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(STORAGE_KEY) === "done";
}

export function completeWalkthrough(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "done");
}

export function resetWalkthrough(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function shouldForceWalkthrough(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("guide") === "1";
}
