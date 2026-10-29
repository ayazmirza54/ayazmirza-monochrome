"use client"

import { useTiks } from "@rexa-developer/tiks/react"

import { useSoundEnabled } from "@/hooks/use-sound-enabled"

/**
 * `useTiks` with the site-wide sound preference applied. Each `useTiks` call
 * owns its own engine, so muting has to be passed to every one of them.
 */
export function useUiTiks() {
  const [soundEnabled] = useSoundEnabled()
  return useTiks({ muted: !soundEnabled, respectReducedMotion: true })
}
