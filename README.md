# DUONGSAOTOASANG.COM
Publishing Platform – Cloudflare Pages + Functions + D1

Repository này chứa toàn bộ mã nguồn, kiến trúc hệ thống, quy trình lập trình và quy trình triển khai cho website:

https://duongsaotoasang.com

Tài liệu này là bản **thiết kế hệ thống hoàn chỉnh** để đảm bảo việc phát triển không bị rối, không viết lại nhiều lần, không thay đổi cấu trúc giữa chừng.

Mọi phát triển trong dự án này phải tuân theo tài liệu này.

------------------------------------------------------------

SYSTEM ARCHITECTURE

Hệ thống được xây dựng theo mô hình serverless.

Luồng hoạt động:

Browser  
↓  
Cloudflare CDN  
↓  
Cloudflare Pages (Frontend)  
↓  
Cloudflare Functions (API)  
↓  
Cloudflare D1 Database

Mô hình này giúp:

• không cần server backend  
• tốc độ CDN toàn cầu  
• tự động scale  
• bảo mật tốt hơn  
• deploy cực nhanh

------------------------------------------------------------

REPOSITORY STRUCTURE

Cấu trúc repository phải giữ đúng như sau.

duongsaotoasang-web

README.md  
wrangler.toml  

migrations/

0001_schema.sql  
0002_indexes.sql  
0003_triggers.sql  
0004_seed.sql  

functions/

api/

contents.js  
content.js  
search.js  

assets/

app.js  
style.css  

index.html  
posts.html  
content.html  

------------------------------------------------------------

DATABASE

Database sử dụng:

Cloudflare D1

Table chính:

contents

Schema:

id INTEGER PRIMARY KEY  
slug TEXT UNIQUE  
type TEXT  
title TEXT  
title_vi TEXT  
title_en TEXT  
excerpt TEXT  
excerpt_vi TEXT  
excerpt_en TEXT  
content TEXT  
content_vi TEXT  
content_en TEXT  
cover TEXT  
cover_url TEXT  
tags TEXT  
published INTEGER  
created_at TEXT  
updated_at TEXT  

------------------------------------------------------------

CONTENT TYPES

type có hai giá trị:

page  
post  

page dùng cho:

about  
program  
contact  

post dùng cho bài viết.

------------------------------------------------------------

DATABASE MIGRATIONS

Tất cả thay đổi database phải thông qua migrations.

Folder migrations:

migrations/

Files:

0001_schema.sql  
0002_indexes.sql  
0003_triggers.sql  
0004_seed.sql  

Chạy migrations:

wrangler d1 migrations apply cf-d1-dsts-content-prod --remote

Kiểm tra tables:

wrangler d1 execute cf-d1-dsts-content-prod --remote --command "SELECT name FROM sqlite_master WHERE type='table';"

------------------------------------------------------------

API ARCHITECTURE

Tất cả API nằm trong:

functions/api/

Endpoints:

/api/contents  
/api/content  
/api/search  

------------------------------------------------------------

API CONTENT LIST

Endpoint:

/api/contents

API này chỉ trả metadata của bài viết.

KHÔNG BAO GIỜ trả content.

Fields trả về:

id  
slug  
type  
title  
title_vi  
title_en  
excerpt  
excerpt_vi  
excerpt_en  
cover  
cover_url  
tags  
created_at  
updated_at  

Parameters:

lang  
limit  
type  
q  

Examples:

/api/contents  
/api/contents?lang=en  
/api/contents?type=post  
/api/contents?q=community  

------------------------------------------------------------

API SINGLE CONTENT

Endpoint:

/api/content

Mục đích:

trả nội dung đầy đủ của bài viết.

Parameters:

slug  
lang  

Example:

/api/content?slug=about  

Fields trả về bao gồm:

content  
content_vi  
content_en  

------------------------------------------------------------

API SEARCH

Endpoint:

/api/search

Parameters:

q  
lang  
limit  

Kết quả trả về giống API contents.

------------------------------------------------------------

FRONTEND ARCHITECTURE

Frontend có ba trang chính.

index.html

trang chủ.

posts.html

trang danh sách bài viết.

content.html

trang hiển thị bài viết hoặc page.

------------------------------------------------------------

SHARED ASSETS

Script dùng chung:

assets/app.js

Styles:

assets/style.css

------------------------------------------------------------

FILE RESPONSIBILITIES

functions/api/contents.js

trả danh sách bài viết  
filter theo type  
filter theo keyword  
limit số lượng  
chọn ngôn ngữ  

không trả content.

------------------------------------------------------------

functions/api/content.js

lấy bài viết theo slug  
trả full content  
hỗ trợ lang

------------------------------------------------------------

functions/api/search.js

tìm bài viết theo keyword  
trả metadata listing

------------------------------------------------------------

assets/app.js

chứa logic chung:

language detection  
API helper  
render helper  
navigation helper  

------------------------------------------------------------

posts.html

hiển thị danh sách bài viết

call:

/api/contents

render card list

------------------------------------------------------------

content.html

đọc slug từ URL

call:

/api/content

render nội dung bài viết.

------------------------------------------------------------

URL STRUCTURE

Trang web có cấu trúc URL:

/  
/posts  
/posts?lang=en  
/about  
/program  
/contact  
/post-slug  

content.html xử lý render slug.

------------------------------------------------------------

DEPLOYMENT

Repository:

github.com/tranhatam-collab/duongsaotoasang-web

Platform deploy:

Cloudflare Pages

Workflow:

git add .  
git commit -m "update"  
git push origin main  

Cloudflare sẽ deploy tự động.

------------------------------------------------------------

GIT AUTHENTICATION

Sử dụng SSH.

Remote ví dụ:

git@github-tranhatam:tranhatam-collab/duongsaotoasang-web.git

Kiểm tra:

git remote -v

------------------------------------------------------------

DEVELOPMENT RULES

Các quy tắc bắt buộc:

luôn thay toàn bộ file khi sửa  
không thay đổi API structure giữa chừng  
database thay đổi phải qua migrations  
frontend phải theo API contract  
test API trước khi test frontend  

------------------------------------------------------------

TEST CHECKLIST

API:

/api/contents  
/api/contents?lang=en  
/api/content?slug=about  
/api/search?q=community  

FRONTEND:

/  
/posts  
/posts?lang=en  
/about  
/program  
/contact  

------------------------------------------------------------

DEVELOPMENT ORDER

Thứ tự phát triển luôn phải là:

database  
API  
shared javascript  
frontend  
test

------------------------------------------------------------

PROJECT STATUS

✓ database schema  
✓ migrations  
✓ seed data  
✓ contents API  

□ content API  
□ search API  
□ app.js  
□ posts.html  
□ content.html  
□ production test  

------------------------------------------------------------

FUTURE FEATURES

có thể mở rộng:

RSS feed  
sitemap generator  
related posts  
reading progress bar  
admin CMS  

Những tính năng này không được phá vỡ API hiện tại.

------------------------------------------------------------

END OF DOCUMENT
