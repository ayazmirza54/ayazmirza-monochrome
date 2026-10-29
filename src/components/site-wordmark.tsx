import { gridSize, gridToRects, rectsToPath, textToGrid } from "@/lib/pixel-art"

import { MARK_GRID } from "./site-mark"

// The mark sits on a 64px grid and the text on a 32px grid, so both share
// the same 256px height; the gap matches four text columns.
const MARK_UNIT = 64
const TEXT_UNIT = 32
const TEXT_GRID = textToGrid("ayazmirza")

const markSize = gridSize(MARK_GRID, MARK_UNIT)
const textOffsetX = markSize.width + 4 * TEXT_UNIT
const textSize = gridSize(TEXT_GRID, TEXT_UNIT)

const WIDTH = textOffsetX + textSize.width
const HEIGHT = markSize.height
const PATH =
  rectsToPath(gridToRects(MARK_GRID, MARK_UNIT)) +
  rectsToPath(gridToRects(TEXT_GRID, TEXT_UNIT, { x: textOffsetX, y: 0 }))

export function SiteWordmark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      {...props}
    >
      <path fill="currentColor" d={PATH} />
    </svg>
  )
}

export function getWordmarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 ${WIDTH} ${HEIGHT}"><path fill="currentColor" d="${PATH}"/></svg>`
}
