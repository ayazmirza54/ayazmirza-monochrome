import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  x: {
    title: "𝕏",
    handle: "@ayazmirza54",
    href: "https://x.com/ayazmirza54",
    sameAs: true,
  },
  github: {
    title: "GitHub",
    handle: "ayazmirza54",
    href: "https://github.com/ayazmirza54",
    sameAs: true,
  },
  linkedin: {
    title: "LinkedIn",
    handle: "ayazmirza54",
    href: "https://www.linkedin.com/in/ayazmirza54",
    sameAs: true,
  },
  devto: {
    title: "DEV",
    handle: "@ayazmirza54",
    href: "https://dev.to/ayazmirza54",
    sameAs: true,
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
