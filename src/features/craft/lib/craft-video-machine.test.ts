import { describe, expect, it } from "vitest"

import { craftVideoMediaTransition } from "./craft-video-machine"

describe("craftVideoMediaTransition", () => {
  it("toggles between playing and paused", () => {
    expect(craftVideoMediaTransition("paused", "play")).toBe("playing")
    expect(craftVideoMediaTransition("playing", "pause")).toBe("paused")
  })

  it("leaves blocked only through a successful play", () => {
    expect(craftVideoMediaTransition("paused", "blocked")).toBe("blocked")
    expect(craftVideoMediaTransition("blocked", "pause")).toBe("blocked")
    expect(craftVideoMediaTransition("blocked", "play")).toBe("playing")
  })

  it("never reports blocked while playing", () => {
    expect(craftVideoMediaTransition("playing", "blocked")).toBe("playing")
  })
})
