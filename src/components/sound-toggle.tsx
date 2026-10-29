"use client"

import { Volume2Icon, VolumeXIcon } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"
import { useSoundEnabled } from "@/hooks/use-sound-enabled"
import { useUiTiks } from "@/hooks/use-ui-tiks"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "./ui/button"
import { Kbd } from "./ui/kbd"

export function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useSoundEnabled()
  const { toggle, unmute } = useUiTiks()

  const switchSound = () => {
    const next = !soundEnabled
    // The preference reaches the engine after render, so unmute it now for
    // the "on" sound to play; the "off" sound plays before muting takes hold.
    if (next) unmute()
    toggle(next)
    setSoundEnabled(next)
    trackEvent({ name: "toggle_sound", properties: { enabled: next } })
  }

  useHotkeys("m", () => switchSound())

  const label = soundEnabled ? "Mute sounds" : "Unmute sounds"

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="relative touch-manipulation border-none"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            aria-pressed={!soundEnabled}
            onClick={() => switchSound()}
          >
            <span
              className="absolute size-12 pointer-fine:hidden"
              aria-hidden
            />
            {soundEnabled ? (
              <Volume2Icon className="size-4" aria-hidden />
            ) : (
              <VolumeXIcon className="size-4" aria-hidden />
            )}
          </Button>
        }
      />
      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          {label}
          <Kbd>M</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
