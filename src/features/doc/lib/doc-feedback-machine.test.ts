import { describe, expect, it } from "vitest"

import { docFeedbackTransition } from "./doc-feedback-machine"

describe("docFeedbackTransition", () => {
  it("moves from voting to the note form to done", () => {
    expect(docFeedbackTransition("prompt", "vote")).toBe("note")
    expect(docFeedbackTransition("note", "noteConfirmed")).toBe("done")
  })

  it("does not reopen the note form", () => {
    expect(docFeedbackTransition("note", "vote")).toBe("note")
    expect(docFeedbackTransition("done", "vote")).toBe("done")
  })

  it("does not skip the note form", () => {
    expect(docFeedbackTransition("prompt", "noteConfirmed")).toBe("prompt")
  })
})
