const API_CONTENT = "/api/content";
const API_LIST = "/api/contents";

export function getSlug() {
  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  const parts = path.split("/");

  if (parts[0] === "posts" && parts[1]) {
    return parts.slice(1).join("/");
  }

  return parts[0] || "";
}

export async function loadContent(slug) {
  const url = `${API_CONTENT}?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.item || null;
}

export async function loadPosts() {
  const url = `${API_LIST}?type=post&visibility=public&status=published&limit=50`;
  const res = await fetch(url);
  const json = await res.json();
  return json.items || [];
}

export function renderContent(data) {
  const title = document.getElementById("title");
  const body = document.getElementById("body");

  if (!data) {
    title.textContent = "404";
    body.innerHTML = "<p>Nội dung không tồn tại.</p>";
    return;
  }

  const lang = localStorage.getItem("lang") || "vi";

  const titleText =
    lang === "en"
      ? data.title_en || data.title_vi
      : data.title_vi || data.title_en;

  const bodyHtml =
    lang === "en"
      ? data.body_en || data.body_vi
      : data.body_vi || data.body_en;

  title.textContent = titleText;
  body.innerHTML = bodyHtml;
}

export function renderPosts(list) {
  const container = document.getElementById("posts");

  if (!container) return;

  container.innerHTML = list
    .map((p) => {
      const title = p.title_vi || p.title_en || p.slug;

      return `
      <article class="post">
        <h2>
          <a href="/posts/${p.slug}">
            ${title}
          </a>
        </h2>
        <p>${p.excerpt_vi || ""}</p>
      </article>
      `;
    })
    .join("");
}
