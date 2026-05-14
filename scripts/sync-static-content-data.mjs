import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { FALLBACK_CONTENTS, POST_CONTENTS } from "../functions/_lib/content-data.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const staticPosts = POST_CONTENTS.map(({ content_vi, content_en, ...item }) => item)
const inlineContentBySlug = Object.fromEntries(
  FALLBACK_CONTENTS.map((item) => [item.slug, item])
)

writeJson("data/content.json", FALLBACK_CONTENTS)
writeJson("data/posts.json", staticPosts)
replaceInlineJson(
  "posts.html",
  /const fallbackPosts = \[[\s\S]*?\n      \];/,
  `const fallbackPosts = ${toInlineJson(staticPosts)};`
)
replaceInlineJson(
  "content.html",
  /const fallbackContents = \{[\s\S]*?\n      \};/,
  `const fallbackContents = ${toInlineJson(inlineContentBySlug)};`
)

console.log(`STATIC_CONTENT_DATA_SYNCED posts=${staticPosts.length} content=${FALLBACK_CONTENTS.length} inline=true`)

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
