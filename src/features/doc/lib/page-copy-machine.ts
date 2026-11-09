import type { CopyState } from "@/hooks/use-copy-to-clipboard"

/**
 * Lifecycle of the "Copy page" button.
 *
 *   idle --start--> pending --slow--> loading
 *   pending | loading --succeed--> done
 *   pending | loading --fail-----> error
 *   done | error --reset--> idle
 *
 * `pending` exists so fast (cached) copies never flash a busy state: the
 * button only reports busy once `slow` fires.
 */
export type PageCopyPhase = "idle" | "pending" | "loading" | "done" | "error"

export type PageCopyEvent =
  | { type: "start" }
  | { type: "slow" }
  | { type: "succeed" }
  | { type: "fail" }
  | { type: "reset" }

export const PAGE_COPY_SLOW_DELAY_MS = 150
export const PAGE_COPY_RESET_DELAY_MS = 1500

/** Returns the same phase for events that do not apply, so React bails out. */
export function pageCopyTransition(
  phase: PageCopyPhase,
  event: PageCopyEvent
): PageCopyPhase {
  switch (event.type) {
    case "start":
      return phase === "idle" ? "pending" : phase
    case "slow":
      return phase === "pending" ? "loading" : phase
    case "succeed":
      return phase === "pending" || phase === "loading" ? "done" : phase
    case "fail":
      return phase === "pending" || phase === "loading" ? "error" : phase
    case "reset":
      return phase === "done" || phase === "error" ? "idle" : phase
  }
}

export function pageCopyIconState(phase: PageCopyPhase): CopyState {
  return phase === "done" || phase === "error" ? phase : "idle"
}
