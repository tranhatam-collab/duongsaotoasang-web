import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { FALLBACK_CONTENTS, POST_CONTENTS } from "../functions/_lib/content-data.js"
import { buildRss } from "../functions/_lib/feed-utils.js"
import { INDEXABLE_STATIC_ROUTES, canonicalFor } from "../functions/_lib/public-routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const staticPosts = POST_CONTENTS.map(({ content_vi, content_en, ...item }) => item)
const inlineContentBySlug = Object.fromEntries(
  FALLBACK_CONTENTS.map((item) => [item.slug, item])
)

writeJson("data/content.json", FALLBACK_CONTENTS)
writeJson("data/posts.json", staticPosts)
writeSitemap("sitemap.xml", buildStaticSitemap(staticPosts))
writeRss("rss.xml", buildRss(POST_CONTENTS))
replaceInlineJson(
  "posts.html",
  /const fallbackPosts = \[[\s\S]*?\n\];/,
  `const fallbackPosts = ${toInlineJson(staticPosts)};`
)
replaceInlineJson(
  "content.html",
  /const fallbackContents = \{[\s\S]*?\n\};/,
  `const fallbackContents = ${toInlineJson(inlineContentBySlug)};`
)

console.log(`STATIC_CONTENT_DATA_SYNCED posts=${staticPosts.length} content=${FALLBACK_CONTENTS.length} sitemap=true rss=true inline=true`)

function writeJson(relativePath, value) {
  writeFileSync(join(repoRoot, relativePath), `${JSON.stringify(value, null, 2)}\n`)
}

function replaceInlineJson(relativePath, pattern, replacement) {
  const filePath = join(repoRoot, relativePath)
  const source = readFileSync(filePath, "utf8")
  if (!pattern.test(source)) {
    throw new Error(`Could not find inline fallback block in ${relativePath}`)
  }
  writeFileSync(filePath, source.replace(pattern, replacement))
}

function toInlineJson(value) {
  return JSON.stringify(value, null, 8)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

function buildStaticSitemap(posts) {
  const urls = [
    ...INDEXABLE_STATIC_ROUTES.map((path) => ({ loc: canonicalFor(path), priority: priorityFor(path) })),
    ...posts.map((post) => ({
      loc: canonicalFor(`/content?slug=${post.slug}`),
      lastmod: toIsoDate(post.created_at),
      priority: "0.6"
    }))
  ]

  const entries = urls.map((url) => {
    const lastmod = url.lastmod ? `\n    <lastmod>${xmlEscape(url.lastmod)}</lastmod>` : ""
    return `  <url>
    <loc>${xmlEscape(url.loc)}</loc>${lastmod}
    <priority>${url.priority}</priority>
  </url>`
  }).join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

function writeSitemap(relativePath, value) {
  writeFileSync(join(repoRoot, relativePath), value)
}

function writeRss(relativePath, value) {
  writeFileSync(join(repoRoot, relativePath), value)
}

function priorityFor(path) {
  if (path === "/") return "1.0"
  if (["/about", "/program", "/posts", "/events", "/scripts", "/movement"].includes(path)) return "0.8"
  if (path.startsWith("/scripts/") || path.startsWith("/movement/")) return "0.7"
  return "0.7"
}

function toIsoDate(value) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
