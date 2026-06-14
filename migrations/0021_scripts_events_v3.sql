-- DSTS Content v3.0 — 9 Scripts + 3 Events
-- Migration 0021 — 2026-06-14

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('nha-tu-binh-lam-nghe-si','Từ nhà tù đến sân khấu','From Prison to Stage',
'Kịch bản phỏng vấn người đã từng ở tù và trở thành nghệ sĩ. Câu chuyện về lựa chọn thứ hai, về việc xã hội không cho phép nhưng bản thân quyết định.','Interview script: from prison to artist. Story of second chances and self-determination.',
'Trần Hà Tâm','script','published','phỏng vấn, hồi sinh, nghệ sĩ',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('me-don-than-va-con-gai-toan-hoc','Mẹ đơn thân và con gái toán học','Single Mother and Her Mathematician Daughter',
'Kịch bản phỏng vấn mẹ đơn thân nuôi con thành tài toán học. Không phải câu chuyện hy sinh mà là câu chuyện về quyết định: chọn tập trung thay vì chọn dễ dàng.','Interview: single mother raising a math prodigy. Not about sacrifice, but about choosing focus over ease.',
'Trần Hà Tâm','script','published','phỏng vấn, mẹ đơn thân, giáo dục',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('nguoi-lam-vuon-tro-thanh-dao-dien','Từ làm vườn đến đạo diễn','From Gardener to Director',
'Kịch bản phỏng vấn người từng làm vườn ở Úc và trở thành đạo diễn phim tài liệu. Câu hỏi cốt lõi: sự kiên nhẫn làm vườn dạy gì về làm phim?','Interview: gardener turned documentary director. What does gardening patience teach about filmmaking?',
'Trần Hà Tâm','script','published','phỏng vấn, kiên nhẫn, nghệ thuật',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('bac-si-bo-viec-ngan-hang','Bác sĩ bỏ việc ngân hàng','Doctor Who Quit Banking',
'Kịch bản phỏng vấn người từng làm ngân hàng 15 năm rồi bỏ đi học y. Câu hỏi: khi nào "thành công" không còn đủ?','Interview: 15-year banker who quit to study medicine. When does "success" stop being enough?',
'Trần Hà Tâm','script','published','phỏng vấn, chuyển hướng, thành công',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('nha-khoa-hoc-viet-50-nam-nghien-cuu','Nhà khoa học Việt 50 năm nghiên cứu','Vietnamese Scientist: 50 Years of Research',
'Kịch bản phỏng vấn nhà khoa học Việt làm việc 50 năm không cần nổi tiếng. Câu hỏi: tại sao một số người chọn lặng lẽ?','Interview: Vietnamese scientist who worked 50 years without fame. Why choose silence?',
'Trần Hà Tâm','script','published','phỏng vấn, khoa học, lặng lẽ',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('startup-that-bai-lan-5','Startup thất bại lần thứ 5','Startup Failed for the 5th Time',
'Kịch bản phỏng vấn founder đã thất bại 5 lần và vẫn đang làm startup lần 6. Không phải câu chuyện kiên trì mà là câu chuyện về việc học được gì từ mỗi lần thất bại.','Interview: founder who failed 5 times and is on the 6th. Not persistence, but learning from each failure.',
'Trần Hà Tâm','script','published','phỏng vấn, thất bại, học hỏi',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('co-gai-mo-cua-hang-sach-o-berlin','Cô gái mở cửa hàng sách ở Berlin','Girl Who Opened a Bookstore in Berlin',
'Kịch bản phỏng vấn người mở hiệu sách tiếng Việt ở Berlin. Không phải câu chuyện kinh doanh mà là câu chuyện về việc tạo ra một góc thuộc về.','Interview: opening a Vietnamese bookstore in Berlin. Not business, but creating a corner that belongs.',
'Trần Hà Tâm','script','published','phỏng vấn, sách, Berlin, thuộc về',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('nguoi-viet-nuoi-duong-con-o-nhat','Người Việt nuôi dưỡng con ở Nhật','Vietnamese Raising Children in Japan',
'Kịch bản phỏng vấn cha mẹ Việt ở Nhật về việc truyền ngôn ngữ và văn hóa cho con. Câu hỏi: làm sao để con tự hào về cả hai nền văn hóa?','Interview: Vietnamese parents in Japan passing language and culture to children. How to make children proud of both cultures?',
'Trần Hà Tâm','script','published','phỏng vấn, văn hóa, Nhật, con cái',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO scripts (slug, title_vi, title_en, content_vi, content_en, author, type, status, tags, featured, published_at) VALUES
('kien-truc-su-xay-truong-hoc-o-chau-phi','Kiến trúc sư xây trường học ở châu Phi','Architect Building Schools in Africa',
'Kịch bản phỏng vấn kiến trúc sư Việt xây trường ở châu Phi. Câu hỏi: tại sao đi xa để giúp người lạ?','Interview: Vietnamese architect building schools in Africa. Why go far to help strangers?',
'Trần Hà Tâm','script','published','phỏng vấn, kiến trúc, châu Phi, từ thiện',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

-- 3 Events
INSERT INTO events (slug, title_vi, title_en, description_vi, description_en, location, date, status, featured, created_at) VALUES
('buoi-doc-cham-thang-6-2026','Buổi đọc chậm tháng 6/2026','Slow Reading Session June 2026',
'Buổi đọc chậm cùng mentor đã xác thực. Chủ đề: "Sống chậm để sống sâu". Địa điểm: online (Zoom). Thời gian: 14h-16h GMT+7, Chủ nhật 28/6/2026.','Verified mentor-led slow reading session. Theme: "Read slowly to live deeply." Online (Zoom). Sun 28/6, 2-4pm GMT+7.',
'Online (Zoom)','2026-06-28T14:00:00+07:00','upcoming',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET description_vi=excluded.description_vi, description_en=excluded.description_en, updated_at='2026-06-14';

INSERT INTO events (slug, title_vi, title_en, description_vi, description_en, location, date, status, featured, created_at) VALUES
('talkshow-hanh-trinh-tro-ve','Talkshow: Hành trình trở về','Talkshow: Journey of Return',
'Talkshow với những người đã sống ở nước ngoài 10+ năm và quyết định trở về Việt Nam. Không phải câu chuyện "thành công" mà là câu chuyện "chọn lựa".','Talkshow with people who lived abroad 10+ years and decided to return to Vietnam. Not success stories, but choice stories.',
'Hà Nội / Online hybrid','2026-07-15T19:00:00+07:00','upcoming',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET description_vi=excluded.description_vi, description_en=excluded.description_en, updated_at='2026-06-14';

INSERT INTO events (slug, title_vi, title_en, description_vi, description_en, location, date, status, featured, created_at) VALUES
('workshop-mentor-dau-tien','Workshop: Trở thành Mentor đã xác thực','Workshop: Become a Verified Mentor',
'Workshop đào tạo mentor cho DSTS Mentor Network. Guardian-first, no-overclaim, evidence-based. Hoàn thành workshop = đủ điều kiện apply Verified Mentor.','Training workshop for DSTS Mentor Network. Guardian-first, no-overclaim, evidence-based. Completion qualifies for Verified Mentor application.',
'Online (Zoom)','2026-08-10T09:00:00+07:00','upcoming',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET description_vi=excluded.description_vi, description_en=excluded.description_en, updated_at='2026-06-14';
