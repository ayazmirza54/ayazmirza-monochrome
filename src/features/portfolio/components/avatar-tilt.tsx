"use client"

import { motion, useMotionValue, useSpring } from "motion/react"

const MAX_TILT = 16
const SPRING = { stiffness: 260, damping: 20, mass: 0.6 }
const SPIN_SPRING = { stiffness: 70, damping: 14 }

/**
 * Tilts its children toward the cursor like a coin held at the edges, and
 * spins it once on click. Purely decorative, so it adds no semantics.
 */
export function AvatarTilt({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const spin = useMotionValue(0)

  const rotateX = useSpring(tiltX, SPRING)
  const rotateY = useSpring(tiltY, SPRING)
  const rotateSpin = useSpring(spin, SPIN_SPRING)

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return
        const rect = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        tiltX.set(-y * 2 * MAX_TILT)
        tiltY.set(x * 2 * MAX_TILT)
      }}
      onPointerLeave={() => {
        tiltX.set(0)
        tiltY.set(0)
      }}
      onClick={() => spin.set(spin.get() + 360)}
    >
      <motion.div
        className="size-full rounded-[inherit]"
        style={{ rotateY: rotateSpin }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
