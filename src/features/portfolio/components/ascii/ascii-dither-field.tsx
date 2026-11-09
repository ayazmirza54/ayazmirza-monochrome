"use client"

import { useCallback, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { useAnimationLoop } from "@/hooks/use-animation-loop"
import { ditherGlyph, flowField } from "@/features/portfolio/lib/ascii-dither"

const FONT_SIZE = 11
const LINE_HEIGHT = 13
const POINTER_RADIUS = 110

/**
 * Decorative background: a slow flow field drawn as dithered ASCII, brighter
 * around the cursor. Colour and font come from CSS (`text-*`, `font-mono`),
 * so it follows the theme without any props.
 */
export function AsciiDitherField({
  className,
  speed = 1,
  intensity = 0.5,
  interactive = true,
}: {
  className?: string
  speed?: number
  /** Caps how far up the glyph ramp the idle field reaches. */
  intensity?: number
  interactive?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!interactive) return

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      pointerRef.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener("pointermove", handleMove, { passive: true })
    return () => window.removeEventListener("pointermove", handleMove)
  }, [interactive])

  const draw = useCallback(
    (seconds: number) => {
      const canvas = canvasRef.current
      const context = canvas?.getContext("2d")
      if (!canvas || !context) return

      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rect.width * dpr)
      const height = Math.round(rect.height * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      const style = getComputedStyle(canvas)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, rect.width, rect.height)
      context.font = `${FONT_SIZE}px ${style.fontFamily}`
      context.textBaseline = "top"
      context.fillStyle = style.color

      const cellWidth = context.measureText("M").width
      const cols = Math.ceil(rect.width / cellWidth)
      // Whole rows only, centred, so short bands never show clipped glyphs.
      const rows = Math.max(1, Math.floor(rect.height / LINE_HEIGHT))
      const offsetY = (rect.height - rows * LINE_HEIGHT) / 2
      const pointer = pointerRef.current
      const time = seconds * speed

      for (let row = 0; row < rows; row++) {
        let line = ""
        for (let col = 0; col < cols; col++) {
          let value = flowField(col, row, time) * intensity
          if (pointer) {
            const dx = rect.left + col * cellWidth - pointer.x
            const dy = rect.top + offsetY + row * LINE_HEIGHT - pointer.y
            value += 0.45 * Math.exp(-(dx * dx + dy * dy) / POINTER_RADIUS ** 2)
          }
          line += ditherGlyph(value, col, row)
        }
        context.fillText(line, 0, offsetY + row * LINE_HEIGHT)
      }
    },
    [speed, intensity]
  )

  useAnimationLoop(canvasRef, draw, 18)

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none font-mono", className)}
      aria-hidden
    />
  )
}
