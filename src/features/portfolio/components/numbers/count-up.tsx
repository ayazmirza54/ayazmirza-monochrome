"use client"

import { useEffect, useRef } from "react"

const DURATION_MS = 900

/**
 * Counts up to the leading number in `value` ("13+" counts to 13 and keeps
 * the "+") the first time it scrolls into view. The server output is the
 * final value.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current?.firstChild
    const match = /^(\d+)(.*)$/.exec(value)
    if (!node || !match) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const target = Number(match[1])
    const suffix = match[2]
    let frame = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION_MS)
          const eased = 1 - (1 - progress) ** 3
          node.nodeValue = `${Math.round(target * eased)}${suffix}`
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 1 }
    )
    observer.observe(ref.current!)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      node.nodeValue = value
    }
  }, [value])

  return <span ref={ref}>{value}</span>
}
