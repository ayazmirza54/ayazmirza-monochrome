"use client"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const soundEnabledAtom = atomWithStorage("soundEnabled", true)

/** Site-wide sound preference, remembered per visitor. */
export function useSoundEnabled() {
  return useAtom(soundEnabledAtom)
}
