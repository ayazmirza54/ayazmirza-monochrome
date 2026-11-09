import { describe, expect, it } from "vitest"

import {
  floatingCarbonAdsTransition,
  type FloatingCarbonAdsState,
} from "./floating-carbon-ads-machine"

describe("floatingCarbonAdsTransition", () => {
  it("loads on reveal and records when the ad is shown", () => {
    const loading = floatingCarbonAdsTransition(
      { status: "idle" },
      { type: "reveal" }
    )
    expect(loading).toEqual({ status: "loading" })
    expect(
      floatingCarbonAdsTransition(loading, { type: "fill", at: 42 })
    ).toEqual({ status: "shown", shownAt: 42 })
  })

  it("keeps the first shownAt when carbon.js mutates the slot again", () => {
    const shown: FloatingCarbonAdsState = { status: "shown", shownAt: 1 }
    expect(floatingCarbonAdsTransition(shown, { type: "fill", at: 2 })).toBe(
      shown
    )
  })

  it("does not reload on later reveals", () => {
    const shown: FloatingCarbonAdsState = { status: "shown", shownAt: 1 }
    expect(floatingCarbonAdsTransition(shown, { type: "reveal" })).toBe(shown)
  })

  it("stays dismissed", () => {
    const dismissed = floatingCarbonAdsTransition(
      { status: "shown", shownAt: 1 },
      { type: "dismiss" }
    )
    expect(dismissed).toEqual({ status: "dismissed" })
    expect(floatingCarbonAdsTransition(dismissed, { type: "reveal" })).toBe(
      dismissed
    )
    expect(
      floatingCarbonAdsTransition(dismissed, { type: "fill", at: 3 })
    ).toBe(dismissed)
  })
})
