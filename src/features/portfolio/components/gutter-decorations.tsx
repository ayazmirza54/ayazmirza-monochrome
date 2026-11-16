"use client"

import { useCallback, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { useUiTiks } from "@/hooks/use-ui-tiks"

type Decoration = {
  /** File name in `public/images/decorations`, without extension. */
  name: string
  side: "left" | "right"
  /** Vertical position along the page, as a percentage of its height. */
  top: number
  /** Where the icon's centre sits across the gutter: 0 at the column, 1 at the window edge. */
  x: number
  /** Largest rendered size, in px; narrower gutters shrink it. */
  size: number
  /** Resting tilt, in degrees. */
  rotate: number
  /** Scroll parallax strength; higher drifts further (reads as nearer). */
  depth: number
  /** Offsets the float animation so items do not bob in step. */
  delay: number
}

/**
 * Hand-placed rather than random at render time, so server and client markup
 * match. The spread alternates sides and varies size, tilt and spacing so it
 * reads as scattered. The top of the right gutter is left clear for the
 * handwritten note beside the profile header.
 */
const DECORATIONS: Decoration[] = [
  {
    name: "file-folder",
    side: "left",
    top: 3,
    x: 0.48,
    size: 148,
    rotate: -10,
    depth: 0.12,
    delay: 0,
  },
  {
    name: "rocket",
    side: "right",
    top: 2,
    x: 0.42,
    size: 112,
    rotate: 14,
    depth: 0.2,
    delay: 1.4,
  },
  {
    name: "laptop",
    side: "left",
    top: 13,
    x: 0.62,
    size: 104,
    rotate: 8,
    depth: 0.08,
    delay: 2.1,
  },
  {
    name: "bar-chart",
    side: "right",
    top: 18,
    x: 0.6,
    size: 132,
    rotate: -6,
    depth: 0.14,
    delay: 0.7,
  },
  {
    name: "card-file-box",
    side: "left",
    top: 24,
    x: 0.4,
    size: 124,
    rotate: 6,
    depth: 0.18,
    delay: 3.2,
  },
  {
    name: "cloud",
    side: "right",
    top: 29,
    x: 0.38,
    size: 116,
    rotate: -4,
    depth: 0.06,
    delay: 1.9,
  },
  {
    name: "gear",
    side: "left",
    top: 35,
    x: 0.66,
    size: 92,
    rotate: 18,
    depth: 0.22,
    delay: 0.4,
  },
  {
    name: "floppy-disk",
    side: "right",
    top: 40,
    x: 0.62,
    size: 108,
    rotate: 12,
    depth: 0.1,
    delay: 2.6,
  },
  {
    name: "chart-increasing",
    side: "left",
    top: 47,
    x: 0.42,
    size: 120,
    rotate: -8,
    depth: 0.12,
    delay: 1.1,
  },
  {
    name: "satellite-antenna",
    side: "right",
    top: 53,
    x: 0.4,
    size: 100,
    rotate: -14,
    depth: 0.18,
    delay: 3.6,
  },
  {
    name: "package",
    side: "left",
    top: 59,
    x: 0.6,
    size: 104,
    rotate: 10,
    depth: 0.08,
    delay: 2.3,
  },
  {
    name: "key",
    side: "right",
    top: 65,
    x: 0.64,
    size: 92,
    rotate: 24,
    depth: 0.2,
    delay: 0.9,
  },
  {
    name: "puzzle-piece",
    side: "left",
    top: 71,
    x: 0.44,
    size: 108,
    rotate: -12,
    depth: 0.16,
    delay: 3,
  },
  {
    name: "magnifying-glass-tilted-left",
    side: "right",
    top: 77,
    x: 0.42,
    size: 104,
    rotate: 8,
    depth: 0.1,
    delay: 1.6,
  },
  {
    name: "hot-beverage",
    side: "left",
    top: 84,
    x: 0.62,
    size: 96,
    rotate: -6,
    depth: 0.14,
    delay: 0.2,
  },
  {
    name: "trophy",
    side: "right",
    top: 89,
    x: 0.58,
    size: 116,
    rotate: 10,
    depth: 0.12,
    delay: 2.8,
  },
]

/** Half of the `md:max-w-3xl` content column the page is built around. */
const HALF_COLUMN = 384
/** Furthest an icon drifts from its resting place while scrolling, in px. */
const MAX_DRIFT = 60
/** Width of one gutter; `%` resolves against this full-width layer. */
const GUTTER = `(50% - ${HALF_COLUMN}px)`

/** Delay per pixel of distance from the clicked icon, so the wave spreads out. */
const WAVE_DELAY_PER_PX = 0.55
const WAVE_MAX_DELAY = 900

/** Hop, squash and a full turn: what every icon does as the wave reaches it. */
const HOP: Keyframe[] = [
  { transform: "translateY(0) scale(1, 1) rotate(0deg)" },
  { offset: 0.14, transform: "translateY(6px) scale(1.14, 0.84) rotate(0deg)" },
  {
    offset: 0.5,
    transform: "translateY(-52px) scale(0.92, 1.1) rotate(200deg)",
  },
  { offset: 0.8, transform: "translateY(5px) scale(1.1, 0.9) rotate(355deg)" },
  { transform: "translateY(0) scale(1, 1) rotate(360deg)" },
]

/** The clicked icon goes first and goes bigger. */
const POP: Keyframe[] = [
  { transform: "translateY(0) scale(1) rotate(0deg)" },
  { offset: 0.12, transform: "translateY(8px) scale(1.2, 0.78) rotate(0deg)" },
  { offset: 0.45, transform: "translateY(-70px) scale(1.35) rotate(-200deg)" },
  {
    offset: 0.78,
    transform: "translateY(6px) scale(1.12, 0.9) rotate(-370deg)",
  },
  { transform: "translateY(0) scale(1) rotate(-360deg)" },
]

/** With reduced motion the wave is a brief glow instead of movement. */
const GLOW: Keyframe[] = [
  { filter: "brightness(1)" },
  { offset: 0.4, filter: "brightness(1.35)" },
  { filter: "brightness(1)" },
]

/**
 * Floating 3D icons in the empty margins either side of the content column on
 * wide screens. Clicking any of them sends a hop-and-spin wave through all of
 * them, starting from the one clicked. They are decoration, so hidden from
 * assistive tech and left out of the tab order. Icons are Microsoft's Fluent
 * Emoji (MIT).
 */
export function GutterDecorations({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLButtonElement[]>([])
  const animationsRef = useRef<Animation[]>([])
  const { success } = useUiTiks()

  const playWave = useCallback(
    (origin: number) => {
      const buttons = buttonsRef.current
      const source = buttons[origin]
      if (!source) return
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      // A second click restarts the wave from the new icon.
      for (const animation of animationsRef.current) animation.cancel()

      const centre = (element: Element) => {
        const rect = element.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      }
      const from = centre(source)
      animationsRef.current = buttons.map((button, i) => {
        const to = centre(button)
        const distance = Math.hypot(to.x - from.x, to.y - from.y)
        const delay = Math.min(WAVE_MAX_DELAY, distance * WAVE_DELAY_PER_PX)
        if (reduced) {
          return button.animate(GLOW, { duration: 600, delay: delay / 3 })
        }
        const isSource = i === origin
        return button.animate(isSource ? POP : HOP, {
          duration: isSource ? 1100 : 900,
          delay: isSource ? 0 : 120 + delay,
          easing: "cubic-bezier(0.3, 0.7, 0.4, 1)",
          // Icons on the right spin the other way, so the wave mirrors.
          direction:
            !isSource && DECORATIONS[i].side === "right" ? "reverse" : "normal",
        })
      })
      success()
    },
    [success]
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const items = Array.from(root.children) as HTMLElement[]

    // Resting centres in page coordinates, re-read when the layout changes so
    // scrolling itself never forces a layout.
    let centres: number[] = []
    const measure = () => {
      const offset = root.getBoundingClientRect().top + window.scrollY
      centres = items.map(
        (item) => offset + item.offsetTop + item.offsetHeight / 2
      )
    }

    let frame = 0
    let pointerX = 0
    let pointerY = 0
    const update = () => {
      frame = 0
      const middle = window.scrollY + window.innerHeight / 2
      items.forEach((item, i) => {
        // Drift in proportion to the distance from the middle of the screen,
        // capped, so an icon is always close to where it was placed.
        const depth = DECORATIONS[i].depth
        const drift = Math.max(
          -MAX_DRIFT,
          Math.min(MAX_DRIFT, (middle - centres[i]) * depth * 0.6)
        )
        item.style.setProperty("--gutter-drift", `${drift.toFixed(1)}px`)
      })
      root.style.setProperty("--gutter-pointer-x", pointerX.toFixed(3))
      root.style.setProperty("--gutter-pointer-y", pointerY.toFixed(3))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1
      pointerY = (event.clientY / window.innerHeight) * 2 - 1
      schedule()
    }
    // Sections expand and collapse, and images load in, so watch the page.
    const resizeObserver = new ResizeObserver(() => {
      measure()
      schedule()
    })
    resizeObserver.observe(root)

    measure()
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        // Only where the margins are wide enough to hold an icon clear of the
        // text. Not behind the page (`-z-1`): the wrapper would take the clicks.
        "pointer-events-none absolute inset-0 z-0 hidden overflow-clip select-none min-[1180px]:block",
        className
      )}
    >
      {DECORATIONS.map((item, index) => (
        <div
          key={item.name}
          className="absolute will-change-transform"
          style={
            {
              top: `${item.top}%`,
              // Never wider than about half the gutter, so it stays clear of the text.
              "--size": `min(${item.size}px, calc(${GUTTER} * 0.46))`,
              width: "var(--size)",
              height: "var(--size)",
              [item.side === "left" ? "right" : "left"]:
                `calc(50% + ${HALF_COLUMN}px + ${GUTTER} * ${item.x} - var(--size) / 2)`,
              // Nearer icons drift further against the scroll and lean more
              // towards the cursor, which reads as depth.
              transform: `translate3d(0, var(--gutter-drift, 0px), 0) perspective(600px) rotateY(calc(var(--gutter-pointer-x, 0) * ${12 + item.depth * 40}deg)) rotateX(calc(var(--gutter-pointer-y, 0) * ${-8 - item.depth * 30}deg))`,
            } as React.CSSProperties
          }
        >
          <button
            ref={(node) => {
              if (node) buttonsRef.current[index] = node
            }}
            type="button"
            tabIndex={-1}
            onClick={() => playWave(index)}
            // The hover and press feedback use `scale`, which stacks with the
            // wave's `transform` instead of fighting it.
            className="pointer-events-auto block size-full cursor-pointer transition-[scale] duration-200 ease-out hover:scale-110 active:scale-95 motion-reduce:transition-none"
          >
            <img
              src={`/images/decorations/${item.name}.png`}
              alt=""
              width={256}
              height={256}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="size-full animate-gutter-float object-contain drop-shadow-[0_18px_24px_rgb(0_0_0/0.18)] motion-reduce:animate-none dark:brightness-90 dark:drop-shadow-[0_18px_28px_rgb(0_0_0/0.55)]"
              style={
                {
                  "--gutter-rotate": `${item.rotate}deg`,
                  animationDelay: `-${item.delay}s`,
                } as React.CSSProperties
              }
            />
          </button>
        </div>
      ))}
    </div>
  )
}
