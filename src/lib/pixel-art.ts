/**
 * Pixel art drawn as rows of `#` (filled) and `.` (empty). The brand mark,
 * wordmark, logotype, and isometric mark all derive from these grids, so a
 * glyph only ever needs editing in one place.
 */
export type PixelGrid = readonly string[]

export type PixelRect = {
  x: number
  y: number
  width: number
  height: number
}

/** 8-row glyphs on the logotype's 32px grid. */
// prettier-ignore
export const PIXEL_FONT: Record<string, PixelGrid> = {
  A: [
    ".###.",
    "#...#",
    "#...#",
    "#...#",
    "#####",
    "#...#",
    "#...#",
    "#...#",
  ],
  I: [
    "###",
    ".#.",
    ".#.",
    ".#.",
    ".#.",
    ".#.",
    ".#.",
    "###",
  ],
  M: [
    "##...##",
    "#.#.#.#",
    "#..#..#",
    "#.....#",
    "#.....#",
    "#.....#",
    "#.....#",
    "#.....#",
  ],
  R: [
    "####.",
    "#...#",
    "#...#",
    "#...#",
    "####.",
    "#..#.",
    "#...#",
    "#...#",
  ],
  Y: [
    "#...#",
    "#...#",
    "#...#",
    ".###.",
    "..#..",
    "..#..",
    "..#..",
    "..#..",
  ],
  Z: [
    "#####",
    "....#",
    "...#.",
    "..#..",
    "..#..",
    ".#...",
    "#....",
    "#####",
  ],
}

export function isFilled(grid: PixelGrid, col: number, row: number) {
  return grid[row]?.[col] === "#"
}

/** Joins glyphs side by side with `gap` empty columns between them. */
export function textToGrid(text: string, gap = 1): PixelGrid {
  const glyphs = [...text.toUpperCase()].map((char) => {
    const glyph = PIXEL_FONT[char]
    if (!glyph) throw new Error(`No pixel glyph for "${char}"`)
    return glyph
  })

  const spacer = ".".repeat(gap)

  return glyphs[0].map((_, row) =>
    glyphs.map((glyph) => glyph[row]).join(spacer)
  )
}

/**
 * Splits a grid into rectangles: horizontal runs first, then runs stacked
 * with the same span in consecutive rows are merged into one rectangle.
 */
export function gridToRects(
  grid: PixelGrid,
  unit: number,
  offset = { x: 0, y: 0 }
): PixelRect[] {
  const open = new Map<string, PixelRect>()
  const rects: PixelRect[] = []

  grid.forEach((line, row) => {
    const runs: { start: number; end: number }[] = []

    for (let col = 0; col < line.length; col++) {
      if (line[col] !== "#") continue
      const last = runs.at(-1)
      if (last && last.end === col) last.end++
      else runs.push({ start: col, end: col + 1 })
    }

    const next = new Map<string, PixelRect>()

    for (const { start, end } of runs) {
      const key = `${start}:${end}`
      const rect = open.get(key)

      if (rect) {
        rect.height += unit
        next.set(key, rect)
      } else {
        const created = {
          x: offset.x + start * unit,
          y: offset.y + row * unit,
          width: (end - start) * unit,
          height: unit,
        }
        rects.push(created)
        next.set(key, created)
      }
    }

    open.clear()
    next.forEach((rect, key) => open.set(key, rect))
  })

  return rects
}

export function rectsToPath(rects: PixelRect[]) {
  return rects
    .map(
      ({ x, y, width, height }) => `M${x} ${y}h${width}v${height}h-${width}Z`
    )
    .join("")
}

export function gridSize(grid: PixelGrid, unit: number) {
  return { width: grid[0].length * unit, height: grid.length * unit }
}
