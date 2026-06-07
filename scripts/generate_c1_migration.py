#!/usr/bin/env python3
"""Generate C1 long-form migration SQL from draft markdown."""
import re
from pathlib import Path
from html import escape

REPO = Path(__file__).parent.parent
DRAFT = REPO / "docs/C1_POSTS_LONGFORM_DRAFT_2026-06-07.md"
OUTPUT = REPO / "migrations/0011_posts_longform.sql"

POSTS = [
    {
        "slug": "hanh-trinh-nhin-lai-chinh-minh",
        "title_vi": "Hành trình nhìn lại chính mình trong một thế giới quá ồn",
        "title_en": "Looking back at yourself in an overly noisy world",
        "tags": "nhận thức,hành trình",
        "created": "2026-03-01T08:00:00.000Z",
    },
    {
        "slug": "sang-tao-khong-bat-dau-tu-tham-vong",
        "title_vi": "Sáng tạo không bắt đầu từ tham vọng mà từ sự thấy rõ",
        "title_en": "Creativity does not begin with ambition but with clarity",
        "tags": "sáng tạo,nhận thức",
        "created": "2026-02-26T08:00:00.000Z",
    },
    {
        "slug": "cong-dong-khong-phai-dam-dong",
        "title_vi": "Cộng đồng không phải đám đông, mà là những người cùng giữ một hướng đi",
        "title_en": "Community is not a crowd, but people holding the same direction",
        "tags": "cộng đồng",
        "created": "2026-02-20T08:00:00.000Z",
    },
    {
        "slug": "mot-doi-song-khong-bi-pha-tan-boi-xa-hoi",
        "title_vi": "Một đời sống không bị phân tán bởi xã hội cần được xây thế nào",
        "title_en": "How to build a life not scattered by society",
        "tags": "nhận thức,định hướng",
        "created": "2026-02-14T08:00:00.000Z",
    },
    {
        "slug": "doc-cham-de-song-sau",
        "title_vi": "Đọc chậm để sống sâu hơn trong thời đại đọc lướt",
        "title_en": "Read slowly to live more deeply in an age of skimming",
        "tags": "hành trình,nhận thức",
        "created": "2026-02-10T08:00:00.000Z",
    },
    {
        "slug": "khoi-nghiep-tu-noi-song-that",
        "title_vi": "Khởi nghiệp từ nơi sống thật thay vì từ nỗi sợ phải chứng minh",
        "title_en": "Building from real living instead of the fear of proving yourself",
        "tags": "sáng tạo,hành trình",
        "created": "2026-02-06T08:00:00.000Z",
    },
    {
        "slug": "vi-sao-con-nguoi-mat-phuong-huong",
        "title_vi": "Vì sao con người mất phương hướng dù có quá nhiều lựa chọn",
        "title_en": "Why people lose direction even with too many choices",
        "tags": "nhận thức",
        "created": "2026-01-28T08:00:00.000Z",
    },
    {
        "slug": "duong-di-cua-nhung-nguoi-muon-song-khac",
        "title_vi": "Đường đi của những người muốn sống khác nhưng chưa biết bắt đầu từ đâu",
        "title_en": "The path for those who want to live differently but do not know where to begin",
        "tags": "hành trình,định hướng",
        "created": "2026-01-22T08:00:00.000Z",
    },
]


def paragraphs_to_html(text: str) -> str:
    """Convert plain text paragraphs into <p> blocks."""
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
    """Extract VI body, EN body, excerpt VI, excerpt EN for a post by index (1-based)."""
    headers = list(re.finditer(r"^##\s+\d+\.\s", draft_text, re.MULTILINE))
    start = headers[post_index - 1].end()
    end = headers[post_index].start() if post_index < len(headers) else len(draft_text)
    section = draft_text[start:end]

    # Excerpt VI
    m = re.search(r"### Excerpt VI\n(.+?)(?=\n### )", section, re.DOTALL)
    excerpt_vi = m.group(1).strip() if m else ""

    # Bài VI body
    m = re.search(r"### Bài VI\n(.+?)(?=\n### English transcreation)", section, re.DOTALL)
    body_vi = m.group(1).strip() if m else ""

    # English transcreation body
    m = re.search(r"### English transcreation\n(.+?)(?=\n---|$)", section, re.DOTALL)
    body_en = m.group(1).strip() if m else ""

    # excerpt_en = first paragraph of EN body
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
