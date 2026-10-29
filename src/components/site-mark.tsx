import type { PixelGrid } from "@/lib/pixel-art"
import { gridSize, gridToRects, rectsToPath } from "@/lib/pixel-art"

/** "AM" on a 64px grid; also extruded by `SiteMarkIsometric`. */
export const MARK_GRID: PixelGrid = [
  ".#..#...#",
  "#.#.##.##",
  "###.#.#.#",
  "#.#.#...#",
]

const MARK_UNIT = 64
const MARK_SIZE = gridSize(MARK_GRID, MARK_UNIT)
const MARK_PATH = rectsToPath(gridToRects(MARK_GRID, MARK_UNIT))

export function SiteMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={`0 0 ${MARK_SIZE.width} ${MARK_SIZE.height}`}
      aria-hidden
      {...props}
    >
      <path fill="currentColor" d={MARK_PATH} />
    </svg>
  )
}

export function getMarkSVG() {
  const unit = MARK_UNIT / 2
  const { width, height } = gridSize(MARK_GRID, unit)
  const path = rectsToPath(gridToRects(MARK_GRID, unit))

  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 ${width} ${height}"><path fill="currentColor" d="${path}"/></svg>`
}
