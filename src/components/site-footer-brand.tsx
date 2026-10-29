import { gridSize, gridToRects, rectsToPath, textToGrid } from "@/lib/pixel-art"

const UNIT = 32
const GRID = textToGrid("ayazmirza")

// 1px of padding on every side keeps the 2px outline inside the viewBox.
const VIEWBOX_WIDTH = gridSize(GRID, UNIT).width + 2
const VIEWBOX_HEIGHT = gridSize(GRID, UNIT).height + 2
const LOGOTYPE_PATH = rectsToPath(gridToRects(GRID, UNIT, { x: 1, y: 1 }))

export function SiteFooterInteractiveLogotype() {
  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
      <div className="flex w-full items-center justify-center py-6 sm:py-8">
        <svg
          className="container size-full"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Ayaz Mirza"
        >
          <path className="fill-foreground" d={LOGOTYPE_PATH} />
          {/* Outlines every construction rectangle, so the pixel grid shows
              through the fill. */}
          <path
            className="stroke-background/40"
            d={LOGOTYPE_PATH}
            strokeWidth="2"
          />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden
      />
    </div>
  )
}
