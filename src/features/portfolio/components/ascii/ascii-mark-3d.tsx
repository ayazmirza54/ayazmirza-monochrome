"use client"

import { useCallback, useRef } from "react"

import { isFilled } from "@/lib/pixel-art"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "@/hooks/use-animation-loop"
import { MARK_GRID } from "@/components/site-mark"
import type { Vec3 } from "@/features/portfolio/lib/ascii-dither"
import { ditherGlyph, unrotate } from "@/features/portfolio/lib/ascii-dither"

const COLS = 56
const ROWS = 20
// 10px mono at line-height 1: a cell is 0.6em wide and 1em tall.
const CELL_ASPECT = 1 / 0.6
const VIEW_WIDTH = 10.5

const GRID_COLS = MARK_GRID[0].length
const GRID_ROWS = MARK_GRID.length
const DEPTH = 1.4
const HALF: Vec3 = [GRID_COLS / 2, GRID_ROWS / 2, DEPTH / 2]

const STEP = 0.06
const RAY_START = -8
const RAY_LENGTH = 16

// Fixed in view space, so the faces change shade as the mark turns.
const LIGHT: Vec3 = [-0.2, 0.5, -0.84]

function solid(x: number, y: number, z: number) {
  if (Math.abs(z) >= HALF[2]) return false
  const col = Math.floor(x + HALF[0])
  // Grid rows run top to bottom, the y axis points up.
  const row = Math.floor(HALF[1] - y)
  return isFilled(MARK_GRID, col, row)
}

/** Returns the brightness of the first surface the ray hits, or 0. */
function trace(origin: Vec3, direction: Vec3, light: Vec3) {
  let [px, py] = origin
  for (let i = 0; i < RAY_LENGTH / STEP; i++) {
    const [x, y, z] = [
      origin[0] + direction[0] * i * STEP,
      origin[1] + direction[1] * i * STEP,
      origin[2] + direction[2] * i * STEP,
    ]
    if (solid(x, y, z)) {
      // The face that was crossed is the axis whose cell changed on this step.
      const crossedX = Math.floor(px + HALF[0]) !== Math.floor(x + HALF[0])
      const crossedY = Math.floor(HALF[1] - py) !== Math.floor(HALF[1] - y)
      const lambert = crossedX
        ? -Math.sign(direction[0]) * light[0]
        : crossedY
          ? -Math.sign(direction[1]) * light[1]
          : -Math.sign(direction[2]) * light[2]
      return 0.08 + 0.78 * Math.max(0, lambert)
    }
    px = x
    py = y
  }
  return 0
}

function render(seconds: number) {
  const yaw = Math.sin(seconds * 0.55) * 0.95
  const pitch = 0.42 + Math.sin(seconds * 0.4) * 0.14
  const direction = unrotate([0, 0, 1], pitch, yaw)
  const light = unrotate(LIGHT, pitch, yaw)
  const cell = VIEW_WIDTH / COLS

  let output = ""
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const sx = (col - COLS / 2 + 0.5) * cell
      const sy = (ROWS / 2 - row - 0.5) * cell * CELL_ASPECT
      const origin = unrotate([sx, sy, RAY_START], pitch, yaw)
      output += ditherGlyph(trace(origin, direction, light), col, row)
    }
    output += "\n"
  }
  return output
}

/**
 * The "AM" mark extruded into voxels and ray-marched into ASCII, swaying so
 * its front and side faces catch a fixed light.
 */
export function AsciiMark3D({ className }: { className?: string }) {
  const preRef = useRef<HTMLPreElement>(null)

  const draw = useCallback((seconds: number) => {
    if (preRef.current) preRef.current.textContent = render(seconds)
  }, [])

  useAnimationLoop(preRef, draw, 20)

  return (
    <pre
      ref={preRef}
      className={cn("font-mono text-[10px]/[1] select-none", className)}
      style={{ width: `${COLS}ch`, height: `${ROWS}em` }}
      aria-hidden
    />
  )
}
