"use client"

import { useEffect } from "react"

import { useClickSound } from "@/hooks/soundcn/use-click-sound"

/**
 * A quiet tick on every link click, delegated from the document so links
 * rendered on the server need no client wrapper. Opt out with
 * `data-sound="off"` on the link or any ancestor.
 */
export function LinkClickSound() {
  const [click] = useClickSound()

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return

      const link = event.target.closest("a[href]")
      if (!link || link.closest('[data-sound="off"]')) return

      click({ volume: 0.18, playbackRate: 1.3 })
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [click])

  return null
}
