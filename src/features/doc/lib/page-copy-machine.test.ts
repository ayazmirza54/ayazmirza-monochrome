import { describe, expect, it } from "vitest"

import {
  pageCopyIconState,
  pageCopyTransition,
  type PageCopyEvent,
  type PageCopyPhase,
} from "./page-copy-machine"

const run = (phase: PageCopyPhase, ...events: PageCopyEvent["type"][]) =>
  events.reduce((p, type) => pageCopyTransition(p, { type }), phase)

describe("pageCopyTransition", () => {
  it("completes a fast copy without entering loading", () => {
    expect(run("idle", "start", "succeed")).toBe("done")
    expect(run("idle", "start", "succeed", "reset")).toBe("idle")
  })

  it("enters loading when the copy is slow", () => {
    expect(run("idle", "start", "slow")).toBe("loading")
    expect(run("idle", "start", "slow", "fail")).toBe("error")
  })

  it("ignores a second start while a copy is in flight or settling", () => {
    for (const phase of ["pending", "loading", "done", "error"] as const) {
      expect(pageCopyTransition(phase, { type: "start" })).toBe(phase)
    }
  })

  it("ignores stale timer events", () => {
    expect(run("done", "slow")).toBe("done")
    expect(run("idle", "reset")).toBe("idle")
    expect(run("loading", "reset")).toBe("loading")
  })

  it("ignores results that arrive without a copy in flight", () => {
    expect(run("idle", "succeed")).toBe("idle")
    expect(run("done", "fail")).toBe("done")
  })
})

describe("pageCopyIconState", () => {
  it("only shows a result icon once the copy settles", () => {
    expect(pageCopyIconState("pending")).toBe("idle")
    expect(pageCopyIconState("loading")).toBe("idle")
    expect(pageCopyIconState("done")).toBe("done")
    expect(pageCopyIconState("error")).toBe("error")
  })
})
