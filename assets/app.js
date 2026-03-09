const API_BASE = "/api"

function getLang() {
  const url = new URL(window.location.href)
  const lang = url.searchParams.get("lang")
  if (lang === "en") return "en"
  return "vi"
}

async function apiFetch(path) {
  const res = await fetch(API_BASE + path)
  if (!res.ok) throw new Error("API error")
  return res.json()
}

function qs(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

function escapeHTML(str) {
  if (!str) return ""
  return str
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
}

function renderPostCard(item) {

  const cover = item.cover_url || ""
  const date = formatDate(item.created_at)

  return `
  <article class="post-card">

    ${cover ? `<img src="${cover}" class="post-cover">` : ""}

    <h2 class="post-title">
      <a href="/content.html?slug=${item.slug}">
        ${escapeHTML(item.title)}
      </a>
    </h2>

    <div class="post-meta">
      ${date}
    </div>

    <p class="post-excerpt">
      ${escapeHTML(item.excerpt)}
    </p>

  </article>
  `
}

async function loadPosts() {

  const container = document.getElementById("posts")

  if (!container) return

  const lang = getLang()

  try {

    const data = await apiFetch(`/contents?type=post&lang=${lang}`)

    container.innerHTML = data.map(renderPostCard).join("")

  } catch(e) {

    container.innerHTML = "Failed to load posts"

  }

}

async function loadPage() {

  const slug = qs("slug")

  if (!slug) return

  const container = document.getElementById("content")

  if (!container) return

  const lang = getLang()

  try {

    const data = await apiFetch(`/content?slug=${slug}&lang=${lang}`)

    container.innerHTML = `
      <article class="post">

        <h1>${data.title}</h1>

        <div class="post-meta">
          ${formatDate(data.created_at)}
        </div>

        <div class="post-body">
          ${data.content}
        </div>

      </article>
    `

  } catch(e) {

    container.innerHTML = "Content not found"

  }

}

async function loadSearch() {

  const q = qs("q")

  if (!q) return

  const container = document.getElementById("posts")

  if (!container) return

  const lang = getLang()

  const data = await apiFetch(`/search?q=${encodeURIComponent(q)}&lang=${lang}`)

  container.innerHTML = data.map(renderPostCard).join("")

}

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("posts")) {

    const q = qs("q")

    if (q) {
      loadSearch()
    } else {
      loadPosts()
    }

  }

  if (document.getElementById("content")) {

    loadPage()

  }

})
