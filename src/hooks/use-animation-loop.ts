"use client"

import { useEffect } from "react"

/**
 * Calls `draw` at up to `fps` while the element is on screen and the tab is
 * visible. Under reduced motion it draws a single still frame instead.
 * `draw` should be stable (wrap it in `useCallback`).
 */
export function useAnimationLoop(
  ref: React.RefObject<Element | null>,
  draw: (seconds: number) => void,
  fps = 20
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const interval = 1000 / fps
    let frame = 0
    let last = -Infinity
    let inView = false

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - last < interval) return
      last = now
      draw(now / 1000)
    }

    const sync = () => {
      cancelAnimationFrame(frame)
      if (!inView || document.hidden) return
      if (reducedMotion.matches) draw(0)
      else frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    observer.observe(element)

    // A still frame has to be redrawn when the canvas is resized.
    const resizeObserver = new ResizeObserver(() => {
      if (inView && reducedMotion.matches) draw(0)
    })
    resizeObserver.observe(element)

    document.addEventListener("visibilitychange", sync)
    reducedMotion.addEventListener("change", sync)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener("visibilitychange", sync)
      reducedMotion.removeEventListener("change", sync)
    }
  }, [ref, draw, fps])
}
