export { cn } from "cn"

/**
 * The site's public origin. `NEXT_PUBLIC_APP_URL` wins; on Vercel the
 * production domain fills in when it is unset, so OG images and canonical
 * URLs never point at the wrong host.
 */
const VERCEL_PRODUCTION_HOST =
  // The public copy reaches client bundles; the plain one is server-only.
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (VERCEL_PRODUCTION_HOST
    ? `https://${VERCEL_PRODUCTION_HOST}`
    : "https://ayazmirza.dev")

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`
}
