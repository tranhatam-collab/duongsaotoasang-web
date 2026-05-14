import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { FALLBACK_CONTENTS, POST_CONTENTS } from "../functions/_lib/content-data.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, "..")

const staticPosts = POST_CONTENTS.map(({ content_vi, content_en, ...item }) => item)

writeJson("data/content.json", FALLBACK_CONTENTS)
writeJson("data/posts.json", staticPosts)

console.log(`STATIC_CONTENT_DATA_SYNCED posts=${staticPosts.length} content=${FALLBACK_CONTENTS.length}`)

function writeJson(relativePath, value) {
  writeFileSync(join(repoRoot, relativePath), `${JSON.stringify(value, null, 2)}\n`)
}
