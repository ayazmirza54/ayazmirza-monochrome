"use client"

import { useEffect, useReducer, useRef } from "react"
import { XIcon } from "lucide-react"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { useIsScrolled } from "@/hooks/use-is-scrolled"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { CarbonAds } from "@/components/carbon-ads"
import {
  floatingCarbonAdsTransition,
  type FloatingCarbonAdsState,
} from "@/components/floating-carbon-ads-machine"
import {
  HandwrittenArrow,
  HandwrittenNote,
} from "@/features/portfolio/components/handwritten-note"

const DISMISSED_KEY = "carbonAdsDismissed"

function readInitialState(): FloatingCarbonAdsState {
  try {
    if (sessionStorage.getItem(DISMISSED_KEY) === "true") {
      return { status: "dismissed" }
    }
  } catch {
    // Blocked storage: treat as not dismissed.
  }
  return { status: "idle" }
}

export function FloatingCarbonAds() {
  const isDesktop = useMediaQuery("(min-width: 1280px)")
  const scrolled = useIsScrolled()
  const [ad, dispatch] = useReducer(
    floatingCarbonAdsTransition,
    undefined,
    readInitialState
  )
  const visible = isDesktop && scrolled === false && ad.status !== "dismissed"

  // Load once visible so a mid-page landing counts no impression. The
  // transition only applies from `idle`, so the ad then stays mounted.
  if (visible && ad.status === "idle") {
    dispatch({ type: "reveal" })
  }

  const containerRef = useRef<HTMLDivElement>(null)

  // carbon.js may fill the slot late or never, so the close button waits.
  useEffect(() => {
    const container = containerRef.current
    if (!container || ad.status !== "loading") return

    const observer = new MutationObserver(() => {
      if (container.querySelector("#carbonads")) {
        dispatch({ type: "fill", at: performance.now() })
      }
    })
    observer.observe(container, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [ad.status])

  const close = (shownAt: number) => {
    trackEvent({
      name: "carbon_ads_close",
      properties: {
        surface: "home_floating",
        seconds_to_close: Math.round((performance.now() - shownAt) / 1000),
      },
    })

    try {
      sessionStorage.setItem(DISMISSED_KEY, "true")
    } catch {
      // Blocked storage: closes for this page view only.
    }

    dispatch({ type: "dismiss" })
  }

  if (ad.status === "idle" || ad.status === "dismissed") return null

  return (
    <div
      ref={containerRef}
      data-visible={visible}
      className={cn(
        // 100%, not 100vw, so a classic scrollbar cannot push it onto the
        // content. 400px is as wide as Carbon's responsive unit grows.
        "[--gap:--spacing(4)]",
        "fixed right-(--gap) bottom-(--gap) z-51 w-[calc((100%-var(--container-3xl))/2-var(--gap)*2)] max-w-100",
        "flex flex-col gap-2",
        "transition-[opacity,visibility] duration-300 data-[visible=false]:invisible data-[visible=false]:opacity-0"
      )}
    >
      {ad.status === "shown" && (
        // Outside the ad box: Carbon forbids covering any part of the ad.
        <div className="flex items-end justify-between gap-2">
          <HandwrittenNote
            className="relative ml-auto flex items-end text-base/none"
            aria-hidden
          >
            <span className="translate-x-3 -translate-y-4 -rotate-6 text-right">
              this ad pays
              <span className="block" />
              my AI bill
            </span>
            <HandwrittenArrow className="size-6" />
          </HandwrittenNote>

          <Button
            className="size-7 translate-x-2 rounded-lg border-none text-muted-foreground"
            variant="ghost"
            size="icon-sm"
            aria-label="Close ad"
            onClick={() => close(ad.shownAt)}
          >
            <XIcon />
          </Button>
        </div>
      )}

      <CarbonAds />
    </div>
  )
}
