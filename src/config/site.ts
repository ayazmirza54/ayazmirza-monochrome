import type { Route } from "next"

import type { NavItem } from "@/types/nav"
import { SITE_URL } from "@/lib/utils"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export const SITE_INFO = {
  name: USER.displayName,
  url: SITE_URL,
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
}

export const LICENSE = {
  name: "MIT License",
  url: "https://github.com/ayazmirza54/ayazmirza-monochrome/blob/main/LICENSE",
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
  dev: "#020c05",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Blog",
    href: "/blog",
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
]

export const X_HANDLE = SOCIAL.x.handle
export const GITHUB_USERNAME = SOCIAL.github.handle
export const SOURCE_CODE_GITHUB_REPO = "ayazmirza54/ayazmirza-monochrome"
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/ayazmirza54/ayazmirza-monochrome"

export const UTM_PARAMS = {
  utm_source: "ayazmirza.dev",
}
