"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

import { useClickSound } from "@/hooks/soundcn/use-click-sound"

function Collapsible({
  onOpenChange,
  ...props
}: CollapsiblePrimitive.Root.Props) {
  const [click] = useClickSound()

  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      onOpenChange={(open, details) => {
        // Pitched up to open and down to close, so the two read apart.
        click({ playbackRate: open ? 1.15 : 0.85 })
        onOpenChange?.(open, details)
      }}
      {...props}
    />
  )
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
