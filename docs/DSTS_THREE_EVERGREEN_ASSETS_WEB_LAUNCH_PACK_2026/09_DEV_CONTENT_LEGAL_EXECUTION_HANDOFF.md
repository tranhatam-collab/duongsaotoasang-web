# DEV CONTENT LEGAL EXECUTION HANDOFF

## 1. Scope

Triển khai public website update cho DSTS gồm:

```text
Homepage rewrite
/story-library
/mentor-network
/dream-nurture
Internal links
SEO meta
Interest form routing
Legal safety copy
```

## 2. Dev tasks

Tạo static pages:

```text
/story-library.html
/mentor-network.html
/dream-nurture.html
```

Redirect clean URL:

```text
/story-library      /story-library.html 200
/mentor-network     /mentor-network.html 200
/dream-nurture      /dream-nurture.html 200
/stories            /story-library 301
/mentors            /mentor-network 301
/nuoi-duong-nhung-uoc-mo /dream-nurture 301
```

## 3. Legal copy blocks

Trên `/dream-nurture`, bắt buộc có safety notice.

Trên `/mentor-network`, bắt buộc có:

```text
Mentor không thay thế tư vấn pháp lý, tài chính, y tế hoặc tâm lý chuyên nghiệp.
```

Trên `/story-library`, bắt buộc có:

```text
Các claim lớn cần được xác minh trước khi công bố như thông tin chính thức.
```

## 4. QA checklist

```text
[ ] /story-library 200
[ ] /mentor-network 200
[ ] /dream-nurture 200
[ ] Homepage link đến 3 route đúng
[ ] Không có text “Đăng ký trẻ em”
[ ] Không có checkout trẻ em
[ ] Không có Star Points cash-out
[ ] Mobile 320px không vỡ
[ ] 1 H1 mỗi page
[ ] Meta title + description
[ ] Sitemap cập nhật
```
