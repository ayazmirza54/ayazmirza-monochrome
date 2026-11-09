import { describe, expect, it } from "vitest"

import {
  ASCII_RAMP,
  ditherGlyph,
  flowField,
  rotate,
  unrotate,
} from "./ascii-dither"

describe("ditherGlyph", () => {
  it("maps the extremes to the ends of the ramp", () => {
    expect(ditherGlyph(0, 0, 0)).toBe(" ")
    expect(ditherGlyph(1, 1, 0)).toBe(ASCII_RAMP.at(-1))
  })

  it("clamps out-of-range values", () => {
    expect(ditherGlyph(-3, 2, 2)).toBe(" ")
    expect(ditherGlyph(7, 2, 2)).toBe(ASCII_RAMP.at(-1))
  })

  it("varies a mid value across neighbouring cells", () => {
    const glyphs = new Set<string>()
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        glyphs.add(ditherGlyph(0.5, col, row))
      }
    }
    expect(glyphs.size).toBeGreaterThan(1)
  })
})

describe("flowField", () => {
  it("stays within 0..1", () => {
    for (let i = 0; i < 500; i++) {
      const value = flowField(i * 3, i * 7, i * 0.37)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)
    }
  })
})

describe("rotate", () => {
  it("is undone by unrotate", () => {
    const point = [1.5, -2, 0.75] as const
    const back = unrotate(rotate(point, 0.4, 1.1), 0.4, 1.1)
    back.forEach((value, i) => expect(value).toBeCloseTo(point[i]))
  })
})
