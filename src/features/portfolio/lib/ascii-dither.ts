/** Darkest to brightest. The leading space keeps low values empty. */
export const ASCII_RAMP = " .:-=+*#%@"

// Ordered (Bayer) thresholds, normalised to [0, 1).
const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((value) => value / 16))

/**
 * Quantises a 0..1 value to a glyph. The Bayer offset pushes neighbouring
 * cells to different levels, which is what turns a smooth gradient into a
 * dither pattern instead of flat bands.
 */
export function ditherGlyph(value: number, col: number, row: number): string {
  const levels = ASCII_RAMP.length - 1
  const threshold = BAYER_4[row & 3][col & 3] - 0.5
  const index = Math.floor(value * levels + threshold + 0.5)
  return ASCII_RAMP[Math.max(0, Math.min(levels, index))]
}

/**
 * Cheap flowing field from warped sines, returned as 0..1 with the low end
 * cut away so most of the surface stays empty.
 */
export function flowField(col: number, row: number, time: number): number {
  const x = col * 0.5
  const y = row
  const a = Math.sin(
    x * 0.11 + time * 0.6 + Math.sin(y * 0.09 - time * 0.4) * 1.6
  )
  const b = Math.sin(
    y * 0.13 - time * 0.5 + Math.sin(x * 0.07 + time * 0.3) * 2
  )
  const raw = 0.5 + 0.25 * a + 0.25 * b
  return Math.max(0, (raw - 0.45) / 0.55)
}

export type Vec3 = readonly [number, number, number]

/** Rotates around X (pitch) then Y (yaw). */
export function rotate([x, y, z]: Vec3, pitch: number, yaw: number): Vec3 {
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const y1 = y * cp - z * sp
  const z1 = y * sp + z * cp
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  return [x * cy + z1 * sy, y1, -x * sy + z1 * cy]
}

/** Inverse of `rotate`, for moving view rays into object space. */
export function unrotate([x, y, z]: Vec3, pitch: number, yaw: number): Vec3 {
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const x1 = x * cy - z * sy
  const z1 = x * sy + z * cy
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  return [x1, y * cp + z1 * sp, -y * sp + z1 * cp]
}
