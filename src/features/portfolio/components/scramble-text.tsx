"use client"

import { useEffect, useRef } from "react"

const GLYPHS = "#%*+=-:./\\<>[]{}"
const DURATION_MS = 550

/**
 * Renders `text` as-is, then "decodes" it from ASCII noise the first time it
 * scrolls into view. The server output is the final text, so nothing depends
 * on the effect running.
 */
export function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current?.firstChild
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION_MS)
          const settled = Math.floor(progress * text.length)
          let output = text.slice(0, settled)
          for (let i = settled; i < text.length; i++) {
            output +=
              text[i] === " "
                ? " "
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          }
          node.nodeValue = output
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
      node.nodeValue = text
    }
  }, [text])

  return <span ref={ref}>{text}</span>
}
