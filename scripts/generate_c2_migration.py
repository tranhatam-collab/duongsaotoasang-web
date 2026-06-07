#!/usr/bin/env python3
"""Generate C2 new posts migration SQL from draft markdown."""
import re
from pathlib import Path
from html import escape

REPO = Path(__file__).parent.parent
DRAFT = REPO / "docs/C2_POSTS_NEW_DRAFT_2026-06-07.md"
OUTPUT = REPO / "migrations/0012_posts_new.sql"

POSTS = [
    {
        "slug": "song-cham-khong-phai-luoi",
        "title_vi": "Sống chậm không phải lười, mà là chọn đúng nhịp",
        "title_en": "Living slowly is not laziness, but choosing the right rhythm",
        "tags": "nhận thức,nhịp sống",
        "created": "2026-04-05T08:00:00.000Z",
    },
    {
        "slug": "tri-thuc-song-khac-gi-thong-tin",
        "title_vi": "Tri thức sống khác gì thông tin",
        "title_en": "How lived knowledge differs from information",
        "tags": "nhận thức",
        "created": "2026-04-12T08:00:00.000Z",
    },
    {
        "slug": "khi-nao-nen-roi-dieu-quen-thuoc",
        "title_vi": "Khi nào nên rời khỏi điều quen thuộc",
        "title_en": "When to leave what is familiar",
        "tags": "hành trình,chuyển hóa",
        "created": "2026-04-19T08:00:00.000Z",
    },
    {
        "slug": "loi-moi-song-tinh-thuc",
        "title_vi": "Đường Sao Tỏa Sáng và lời mời sống tỉnh thức",
        "title_en": "Đường Sao Tỏa Sáng and the invitation to conscious living",
        "tags": "nhận thức,hành trình",
        "created": "2026-04-26T08:00:00.000Z",
    },
]


def paragraphs_to_html(text: str) -> str:
    lines = text.strip().splitlines()
    paragraphs = []
    current = []
    for line in lines:
        stripped = line.strip()
        if stripped:
            current.append(stripped)
        else:
            if current:
                paragraphs.append(" ".join(current))
                current = []
    if current:
        paragraphs.append(" ".join(current))
    return "".join(f"<p>{escape(p)}</p>" for p in paragraphs)


def extract_post_text(draft_text: str, post_index: int):
    headers = list(re.finditer(r"^##\s+\d+\.\s", draft_text, re.MULTILINE))
    start = headers[post_index - 1].end()
    end = headers[post_index].start() if post_index < len(headers) else len(draft_text)
    section = draft_text[start:end]

    m = re.search(r"### Excerpt VI\n(.+?)(?=\n### )", section, re.DOTALL)
    excerpt_vi = m.group(1).strip() if m else ""

    m = re.search(r"### Bài VI\n(.+?)(?=\n### English transcreation)", section, re.DOTALL)
    body_vi = m.group(1).strip() if m else ""

    m = re.search(r"### English transcreation\n(.+?)(?=\n---|$)", section, re.DOTALL)
    body_en = m.group(1).strip() if m else ""

    excerpt_en = body_en.split("\n\n")[0].strip() if body_en else ""

    return excerpt_vi, body_vi, excerpt_en, body_en


def main():
    draft = DRAFT.read_text(encoding="utf-8")
    lines = []

    for i, meta in enumerate(POSTS, start=1):
        excerpt_vi, body_vi, excerpt_en, body_en = extract_post_text(draft, i)
        html_vi = paragraphs_to_html(body_vi)
        html_en = paragraphs_to_html(body_en)

        def q(s):
            return "'" + s.replace("'", "''") + "'"

        lines.append("INSERT OR REPLACE INTO contents (")
        lines.append("  slug, type,")
        lines.append("  title, title_vi, title_en,")
        lines.append("  excerpt, excerpt_vi, excerpt_en,")
        lines.append("  content, content_vi, content_en,")
        lines.append("  cover, cover_url, tags, published,")
        lines.append("  created_at, updated_at")
        lines.append(") VALUES (")
        lines.append(f"  {q(meta['slug'])}, 'post',")
        lines.append(f"  {q(meta['title_vi'])},")
        lines.append(f"  {q(meta['title_vi'])},")
        lines.append(f"  {q(meta['title_en'])},")
        lines.append(f"  {q(excerpt_vi)},")
        lines.append(f"  {q(excerpt_vi)},")
        lines.append(f"  {q(excerpt_en)},")
        lines.append(f"  {q(html_vi)},")
        lines.append(f"  {q(html_vi)},")
        lines.append(f"  {q(html_en)},")
        lines.append(f"  '', '', {q(meta['tags'])}, 1,")
        lines.append(f"  {q(meta['created'])}, '2026-06-07T10:30:00.000Z'")
        lines.append(");")
        lines.append("")

    sql = "\n".join(lines)
    OUTPUT.write_text(sql, encoding="utf-8")
    print(f"Generated {OUTPUT}")
    print(f"SQL size: {len(sql)} chars")


if __name__ == "__main__":
    main()
