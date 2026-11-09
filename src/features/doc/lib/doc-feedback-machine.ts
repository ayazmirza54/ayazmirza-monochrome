/**
 * Session-local step of the "Was this helpful?" widget. The vote itself is
 * persisted separately; a returning visitor who already voted stays in
 * `prompt` and only sees their disabled choice.
 *
 *   prompt --vote--> note --noteConfirmed--> done
 *
 * `note` shows the thanks message and the optional note form. `done` keeps
 * the thanks message after the send button has finished its success state.
 */
export type DocFeedbackStep = "prompt" | "note" | "done"

export type DocFeedbackEvent = "vote" | "noteConfirmed"

export function docFeedbackTransition(
  step: DocFeedbackStep,
  event: DocFeedbackEvent
): DocFeedbackStep {
  switch (event) {
    case "vote":
      return step === "prompt" ? "note" : step
    case "noteConfirmed":
      return step === "note" ? "done" : step
  }
}
