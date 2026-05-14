export const SITE_ORIGIN = "https://duongsaotoasang.com"

export const SCRIPT_ROUTES = [
  "/scripts/rising-entrepreneur",
  "/scripts/global-artist",
  "/scripts/singing-icon",
  "/scripts/cinematic-actor",
  "/scripts/the-thinker",
  "/scripts/creative-leader",
  "/scripts/cultural-ambassador",
  "/scripts/dsts-legacy",
  "/scripts/global-story"
]

export const INDEXABLE_STATIC_ROUTES = [
  "/",
  "/about",
  "/program",
  "/posts",
  "/events",
  "/scripts",
  "/donate",
  "/transparency",
  "/legal",
  "/privacy",
  "/terms",
  "/support",
  "/contact",
  "/dream-nurture",
  "/movement",
  "/movement/sponsors",
  "/movement/events",
  "/movement/diaspora-map",
  "/movement/press",
  "/movement/partners",
  "/movement/tour-2026-2027",
  ...SCRIPT_ROUTES
]

export const NOINDEX_ROUTES = [
  "/movement/gala-2026",
  "/nguoiviet-muonnoi-bridge"
]

export const REDIRECT_ROUTES = [
  ["/programs", "/program"],
  ["/refund", "/legal"]
]

export function canonicalFor(path) {
  return `${SITE_ORIGIN}${path}`
}
