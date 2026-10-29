"use client"

import { useEffect, useId, useRef } from "react"
import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import type { PixelGrid } from "@/lib/pixel-art"
import { isFilled, textToGrid } from "@/lib/pixel-art"
import { metalClickSound } from "@/lib/soundcn/metal-click"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/soundcn/use-sound"
import { MARK_GRID } from "@/components/site-mark"

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

const PADDING = 0.5

type Point = { x: number; y: number }
type Cell = { col: number; row: number }

function project(x: number, y: number, z: number): Point {
  return {
    x: (x + y) * Math.cos(Math.PI / 6),
    y: (y - x) * Math.sin(Math.PI / 6) - z,
  }
}

const fmt = (p: Point) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`
const polygon = (points: Point[]) => `M${points.map(fmt).join(" L")} Z`
const segment = (a: Point, b: Point) => `M${fmt(a)} L${fmt(b)}`
const ISOMETRIC_ANGLE = Math.PI / 6
const ANGLE_RADIUS = 88
// Tip at the origin, pointing left, so each use only translates and rotates.
const ANGLE_ARROW = "M0 0 8-3v6Z"

/**
 * Extrudes a pixel grid into an isometric drawing. The extrusion scales with
 * the cell size so any grid keeps the same proportions as the header mark.
 */
function buildIsometric(grid: PixelGrid, unit: number) {
  const restHeight = unit / 2
  const pressedHeight = unit / 4

  const CELLS: Cell[] = grid
    .flatMap((line, row) =>
      [...line].flatMap((_, col) =>
        isFilled(grid, col, row) ? [{ col, row }] : []
      )
    )
    // Back to front: a cell can only hide cells above it or to its right.
    .sort((a, b) => a.row - a.col - (b.row - b.col))

  const filled = (col: number, row: number) => isFilled(grid, col, row)

  const BOUNDS = (() => {
    const points = CELLS.flatMap(({ col, row }) =>
      [0, restHeight].flatMap((z) => [
        project(col * unit, row * unit, z),
        project((col + 1) * unit, row * unit, z),
        project(col * unit, (row + 1) * unit, z),
        project((col + 1) * unit, (row + 1) * unit, z),
      ])
    )
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs) + PADDING * 2,
      height: Math.max(...ys) - Math.min(...ys) + PADDING * 2,
    }
  })()

  function toView(x: number, y: number, z: number): Point {
    const p = project(x, y, z)
    return {
      x: p.x - BOUNDS.minX + PADDING,
      y: p.y - BOUNDS.minY + PADDING,
    }
  }

  /**
   * Faces and edges of one extruded cell. Only the faces pointing at the viewer
   * (left and front) can show, and only where no neighbor covers them; edges
   * between coplanar neighbors are skipped so letters read as solid shapes.
   */
  function getCellGeometry({ col, row }: Cell, height: number) {
    const x0 = col * unit
    const x1 = x0 + unit
    const y0 = row * unit
    const y1 = y0 + unit
    const top = (x: number, y: number) => toView(x, y, height)
    const base = (x: number, y: number) => toView(x, y, 0)

    const hasLeftFace = !filled(col - 1, row)
    const hasFrontFace = !filled(col, row + 1)

    const sides: string[] = []
    const edges: string[] = []

    if (!filled(col, row - 1)) edges.push(segment(top(x0, y0), top(x1, y0)))
    if (!filled(col + 1, row)) edges.push(segment(top(x1, y0), top(x1, y1)))
    if (hasFrontFace) edges.push(segment(top(x1, y1), top(x0, y1)))
    if (hasLeftFace) edges.push(segment(top(x0, y1), top(x0, y0)))

    if (hasLeftFace) {
      sides.push(
        polygon([top(x0, y0), top(x0, y1), base(x0, y1), base(x0, y0)])
      )
      edges.push(segment(base(x0, y0), base(x0, y1)))

      const continuesUp = filled(col, row - 1) && !filled(col - 1, row - 1)
      if (!continuesUp) edges.push(segment(top(x0, y0), base(x0, y0)))
    }

    if (hasFrontFace) {
      sides.push(
        polygon([top(x0, y1), top(x1, y1), base(x1, y1), base(x0, y1)])
      )
      edges.push(segment(base(x0, y1), base(x1, y1)))

      const continuesRight = filled(col + 1, row) && !filled(col + 1, row + 1)
      if (!continuesRight) edges.push(segment(top(x1, y1), base(x1, y1)))
    }

    if (hasLeftFace || hasFrontFace) {
      // The corner shared by both visible faces, or where either face ends.
      const continuesLeft =
        !hasLeftFace && filled(col - 1, row) && !filled(col - 1, row + 1)
      const continuesDown =
        !hasFrontFace && filled(col, row + 1) && !filled(col - 1, row + 1)
      if (!continuesLeft && !continuesDown) {
        edges.push(segment(top(x0, y1), base(x0, y1)))
      }
    }

    return {
      sides,
      top: polygon([top(x0, y0), top(x1, y0), top(x1, y1), top(x0, y1)]),
      edges: edges.join(""),
    }
  }

  const GEOMETRY = CELLS.map((cell) => ({
    key: `${cell.col}-${cell.row}`,
    rest: getCellGeometry(cell, restHeight),
    pressed: getCellGeometry(cell, pressedHeight),
  }))

  // The topmost vertex (back-right corner of the back-right cell): its wedge to
  // the horizontal is always empty, so the 30° label never overlaps the mark.
  const ANGLE_VERTEX = (() => {
    const { col, row } = CELLS.reduce((best, cell) =>
      cell.col - cell.row > best.col - best.row ? cell : best
    )
    return toView((col + 1) * unit, row * unit, restHeight)
  })()
  const ANGLE_START = { x: ANGLE_VERTEX.x + ANGLE_RADIUS, y: ANGLE_VERTEX.y }
  const ANGLE_END = {
    x: ANGLE_VERTEX.x + ANGLE_RADIUS * Math.cos(ISOMETRIC_ANGLE),
    y: ANGLE_VERTEX.y + ANGLE_RADIUS * Math.sin(ISOMETRIC_ANGLE),
  }
  const ANGLE_LABEL = {
    x: ANGLE_VERTEX.x + (ANGLE_RADIUS + 18) * Math.cos(ISOMETRIC_ANGLE / 2),
    y: ANGLE_VERTEX.y + (ANGLE_RADIUS + 18) * Math.sin(ISOMETRIC_ANGLE / 2),
  }

  // Isometric guide lines along the ground plane, through the mark's front
  // edge and the left edge of each letter.
  const GUIDES = (() => {
    const rows = grid.length
    const reach = 40 * unit
    const letterStarts = grid[0]
      .split("")
      .map((_, col) => col)
      .filter(
        (col) =>
          grid.some((_, row) => filled(col, row)) &&
          !grid.some((_, row) => filled(col - 1, row))
      )

    return [
      segment(toView(-reach, rows * unit, 0), toView(reach, rows * unit, 0)),
      ...letterStarts.map((col) =>
        segment(toView(col * unit, -reach, 0), toView(col * unit, reach, 0))
      ),
    ]
  })()

  const TOP_FACE_VARIANTS = {
    normal: { y: 0 },
    pressed: { y: restHeight - pressedHeight },
  }

  const VIEWBOX_WIDTH = Math.ceil(BOUNDS.width)
  const VIEWBOX_HEIGHT = Math.ceil(BOUNDS.height)

  return {
    GEOMETRY,
    ANGLE_VERTEX,
    ANGLE_START,
    ANGLE_END,
    ANGLE_LABEL,
    GUIDES,
    TOP_FACE_VARIANTS,
    VIEWBOX_WIDTH,
    VIEWBOX_HEIGHT,
  }
}

const MARK_ISOMETRIC = buildIsometric(MARK_GRID, 64)

export function SiteMarkIsometric() {
  return <PixelIsometric drawing={MARK_ISOMETRIC} annotated />
}

export function PixelIsometric({
  drawing,
  annotated = false,
  solid = false,
  className,
}: {
  drawing: ReturnType<typeof buildIsometric>
  /** Shows the 30° angle and the ground-plane guide lines. */
  annotated?: boolean
  /** Fills top faces with the foreground color instead of the hatch. */
  solid?: boolean
  className?: string
}) {
  const {
    GEOMETRY,
    ANGLE_VERTEX,
    ANGLE_START,
    ANGLE_END,
    ANGLE_LABEL,
    GUIDES,
    TOP_FACE_VARIANTS,
    VIEWBOX_WIDTH,
    VIEWBOX_HEIGHT,
  } = drawing
  const id = useId()
  const ids = {
    facePattern: `site-mark-face-pattern-${id}`,
    radialGradient: `site-mark-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)

  const [play] = useSound(metalClickSound)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, VIEWBOX_WIDTH]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, VIEWBOX_HEIGHT]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return
    }

    if (window.matchMedia("(hover: none)").matches) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className={cn(
        "h-auto w-full touch-manipulation overflow-visible [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]",
        className
      )}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      {annotated && (
        <g className="stroke-line" strokeWidth="1" strokeDasharray="4 2">
          {GUIDES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}

      {/* Painted back to front, so nearer cells cover the faces and edges
          they hide. */}
      {GEOMETRY.map(({ key, rest, pressed }) => (
        <g key={key}>
          {rest.sides.map((d, index) => (
            <motion.path
              key={index}
              className="fill-background"
              variants={{
                normal: { d },
                pressed: { d: pressed.sides[index] },
              }}
              transition={transition}
            />
          ))}

          {/* y, not d: the hatch is in user space, so the face must move
              as a whole for the pattern to travel with it. */}
          <motion.path
            d={rest.top}
            className={solid ? "fill-foreground" : "fill-background"}
            variants={TOP_FACE_VARIANTS}
            transition={transition}
          />
          {!solid && (
            <motion.path
              d={rest.top}
              fill={`url(#${ids.facePattern})`}
              variants={TOP_FACE_VARIANTS}
              transition={transition}
            />
          )}

          <motion.path
            stroke="var(--stroke)"
            vectorEffect="non-scaling-stroke"
            variants={{
              normal: { d: rest.edges },
              pressed: { d: pressed.edges },
            }}
            transition={transition}
          />
          <motion.path
            stroke={`url(#${ids.radialGradient})`}
            vectorEffect="non-scaling-stroke"
            variants={{
              normal: { d: rest.edges },
              pressed: { d: pressed.edges },
            }}
            transition={transition}
          />
        </g>
      ))}

      {/* Hidden below sm, where it is unreadable. */}
      {annotated && (
        <g
          className="pointer-events-none text-dimension max-sm:hidden"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        >
          {/* A reference line, not an extension line, so no gap at the vertex. */}
          <path
            d={`M${ANGLE_VERTEX.x} ${ANGLE_VERTEX.y}H${ANGLE_START.x + 12}`}
          />
          <path
            d={`M${ANGLE_START.x} ${ANGLE_START.y}A${ANGLE_RADIUS} ${ANGLE_RADIUS} 0 0 1 ${ANGLE_END.x} ${ANGLE_END.y}`}
          />
          {/* Filled so the arc stops at each arrow's base. */}
          <path
            className="fill-background"
            d={ANGLE_ARROW}
            transform={`translate(${ANGLE_START.x} ${ANGLE_START.y}) rotate(90)`}
          />
          <path
            className="fill-background"
            d={ANGLE_ARROW}
            transform={`translate(${ANGLE_END.x} ${ANGLE_END.y}) rotate(-60)`}
          />
          <text
            className="fill-dimension-foreground font-mono select-none"
            x={ANGLE_LABEL.x}
            y={ANGLE_LABEL.y}
            stroke="none"
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="central"
          >
            30°
          </text>
        </g>
      )}
    </motion.svg>
  )
}

const NAME_ISOMETRIC = buildIsometric(textToGrid("ayazmirza"), 32)

export function NameIsometric({ className }: { className?: string }) {
  return <PixelIsometric drawing={NAME_ISOMETRIC} solid className={className} />
}
