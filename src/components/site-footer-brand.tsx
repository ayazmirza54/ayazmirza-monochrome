"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { gridSize, gridToRects, rectsToPath, textToGrid } from "@/lib/pixel-art"
import {
  Dimension,
  DimensionExtensionLine,
  DimensionLine,
} from "@/components/dimension"

const UNIT = 32
const GRID = textToGrid("ayazmirza")
const GRADIENT_ID = "site-footer-logotype-gradient"

// 1px of padding on every side keeps the 2px outline inside the viewBox.
const VIEWBOX_WIDTH = gridSize(GRID, UNIT).width + 2
const VIEWBOX_HEIGHT = gridSize(GRID, UNIT).height + 2
const LOGOTYPE_PATH = rectsToPath(gridToRects(GRID, UNIT, { x: 1, y: 1 }))

export function SiteFooterInteractiveLogotype() {
  const shouldReduceMotion = useReducedMotion()

  const gradientX1Raw = useMotionValue(0.5)
  const gradientX1 = useSpring(
    useTransform(gradientX1Raw, [0, 1], [0, VIEWBOX_WIDTH]),
    {
      stiffness: 150,
      damping: 25,
    }
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

    const containerRect = event.currentTarget.getBoundingClientRect()
    gradientX1Raw.set(
      (event.clientX - containerRect.left) / containerRect.width
    )
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return
    gradientX1Raw.set(0.5)
  }

  return (
    <>
      <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
        <div
          className="overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex w-full translate-y-[37.5%] items-center justify-center">
            <svg
              className="container size-full"
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={LOGOTYPE_PATH} fill={`url(#${GRADIENT_ID})`} />
              {/* Outlines every construction rectangle, so the pixel grid
                  shows through the gradient. */}
              <path
                className="stroke-foreground/10"
                d={LOGOTYPE_PATH}
                strokeWidth="2"
              />
              <defs>
                <motion.linearGradient
                  id={GRADIENT_ID}
                  x1={gradientX1}
                  y1="1"
                  x2={VIEWBOX_WIDTH / 2}
                  y2={VIEWBOX_HEIGHT - 1}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset="0.625"
                    stopColor="var(--foreground)"
                    stopOpacity="0"
                  />
                  <stop offset="1" stopColor="var(--foreground)" />
                </motion.linearGradient>
              </defs>
            </svg>
          </div>
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

      <LogotypeWidthDimension />
    </>
  )
}

function LogotypeWidthDimension() {
  return (
    <Dimension className="relative container mx-auto h-8">
      <DimensionExtensionLine className="top-1 bottom-0 left-0" />
      <DimensionExtensionLine className="top-1 right-0 bottom-0" />

      <DimensionLine className="absolute inset-x-0 bottom-0">
        {VIEWBOX_WIDTH}
      </DimensionLine>
    </Dimension>
  )
}
