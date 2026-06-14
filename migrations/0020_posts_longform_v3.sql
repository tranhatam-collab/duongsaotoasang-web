-- DSTS Content v3.0 — 12 Long-Form Posts
-- Migration 0020 — 2026-06-14

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at, created_at, updated_at) VALUES
('hanh-trinh-nhin-lai-chinh-minh',
'Hành trình nhìn lại chính mình',
'Journey of Looking Back at Yourself',
'Người Việt sống xa xứ thường có một khoảnh khắc: đứng giữa đường phố London, New York, hay Berlin, bỗng nhận ra mình đã quên mất tiếng mẹ đẻ. Không phải quên từng chữ, mà quên cách nghĩ bằng tiếng Việt — cách cảm nhận thế giới qua âm điệu, qua thành ngữ, qua sự im lặng đầy ý nghĩa của cha mẹ.\n\nNhìn lại chính mình không phải là hối tiếc. Đó là hành động can đảm nhất: đối mặt với những gì mình đã bỏ lại, những gì mình đã chọn, và những gì mình vẫn còn.\n\nNăm dấu hiệu đang sống theo quán tính: (1) Thức dậy không biết hôm nay là thứ mấy. (2) Trả lời "ổn" khi được hỏi "dạo này thế nào" nhưng không biết "ổn" nghĩa là gì. (3) Lướt mạng xã hội 2 tiếng mà không nhớ được một thông tin nào. (4) Gặp lại bạn cũ và nhận ra mình không còn chung ngôn ngữ. (5) Đêm xuống, cảm thấy mệt nhưng không biết đã làm gì cả ngày.\n\nĐường Sao Tỏa Sáng không hứa sẽ giúp bạn tìm lại mình. Chúng tôi chỉ cung cấp một nơi để bạn bắt đầu nhìn lại — bằng câu chuyện thật của người Việt đã từng đứng ở đó.',
'The Vietnamese diaspora often has a moment: standing on a street in London, New York, or Berlin, suddenly realizing they have forgotten their mother tongue. Not individual words, but the way of thinking in Vietnamese — sensing the world through its rhythm, its idioms, the meaningful silence of parents.\n\nLooking back at oneself is not regret. It is the bravest act: facing what was left behind, what was chosen, and what remains.\n\nFive signs of living on autopilot: (1) Waking up not knowing what day it is. (2) Answering "fine" without knowing what "fine" means. (3) Scrolling social media for two hours without remembering anything. (4) Meeting an old friend and realizing you no longer share a language. (5) Feeling tired at night without knowing what you did all day.\n\nDSTS does not promise to help you find yourself. We only provide a place to start looking back — through the true stories of Vietnamese who have stood there before.',
'Hành trình nhìn lại chính mình qua góc nhìn người Việt xa xứ.',
'Looking back at oneself through the lens of the Vietnamese diaspora.',
'Trần Hà Tâm','post','published','hành trình, nhìn lại, tự nhận thức, người Việt xa xứ',1,
'2026-06-14','2026-06-14','2026-06-14')
ON CONFLICT(slug) DO UPDATE SET
  title_vi=excluded.title_vi, title_en=excluded.title_en,
  content_vi=excluded.content_vi, content_en=excluded.content_en,
  excerpt_vi=excluded.excerpt_vi, excerpt_en=excluded.excerpt_en,
  updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at, created_at, updated_at) VALUES
('sang-tao-khong-bat-dau-tu-tham-vong',
'Sáng tạo không bắt đầu từ tham vọng',
'Creativity Does Not Start from Ambition',
'Người ta thường nghĩ sáng tạo là một tia chớp trong đầu — như Edison với bóng đèn, hay Jobs với iPhone. Nhưng sáng tạo thực sự bắt đầu từ việc nhìn thấy một nhu cầu thật mà chưa ai giải quyết.\n\nTrần Hà Tâm không bắt đầu DSTS vì muốn trở thành "founder nổi tiếng". Ông bắt đầu vì nhìn thấy một khoảng trống: người Việt toàn cầu có rất nhiều câu chuyện đáng kể, nhưng không có nền tảng để lưu giữ và lan tỏa những câu chuyện đó một cách có hệ thống, có xác thực, có chiều sâu.\n\nSáng tạo không phải là tạo ra thứ mới từ hư không. Sáng tạo là kết nối những thứ đã có theo cách mới. DSTS kết nối: Story Library + Mentor Network + Dream Nurture + Club + Trust Layer — tất cả đều là những khái niệm đã tồn tại, nhưng chưa ai kết nối chúng thành một hệ sinh thái.\n\nNếu bạn muốn sáng tạo, đừng bắt đầu bằng câu hỏi "Tôi muốn trở thành ai?". Hãy bắt đầu bằng câu hỏi "Nhu cầu thật nào mà tôi nhìn thấy?"',
'People often think creativity is a flash of insight — like Edison with the lightbulb, or Jobs with the iPhone. But true creativity begins from seeing a real need that no one has addressed.\n\nTran Ha Tam did not start DSTS to become a "famous founder." He started because he saw a gap: Vietnamese people worldwide have countless remarkable stories, but no platform to preserve and spread those stories systematically, with verification, with depth.\n\nCreativity is not creating something new from nothing. Creativity is connecting existing things in new ways. DSTS connects: Story Library + Mentor Network + Dream Nurture + Club + Trust Layer — all are existing concepts, but no one had connected them into one ecosystem.\n\nIf you want to create, do not start with "Who do I want to become?" Start with "What real need do I see?"',
'Sáng tạo thực sự bắt đầu từ việc nhìn thấy nhu cầu thật, không phải từ tham vọng.',
'True creativity starts from seeing a real need, not from ambition.',
'Trần Hà Tâm','post','published','sáng tạo, nhu cầu thật, founder mindset',1,
'2026-06-14','2026-06-14','2026-06-14')
ON CONFLICT(slug) DO UPDATE SET
  title_vi=excluded.title_vi, title_en=excluded.title_en,
  content_vi=excluded.content_vi, content_en=excluded.content_en,
  excerpt_vi=excluded.excerpt_vi, excerpt_en=excluded.excerpt_en,
  updated_at='2026-06-14';

-- Bài 3-12 tổng hợp (compact)
INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('cong-dong-khong-phai-dam-dong','Cộng đồng không phải đám đông','Community Is Not a Crowd',
'Cộng đồng là nơi bạn có thể im lặng mà không bị lãng quên. Đám đông là nơi bạn phải hét lên để được nghe. DSTS xây cộng đồng theo 3 tầng tin cậy: (1) Verified Identity — biết ai đang nói, (2) Guardian-First — an toàn cho mọi lứa tuổi, (3) Evidence-Based — mọi claim đều có bằng chứng.','Community is where you can be silent without being forgotten. A crowd is where you must shout to be heard. DSTS builds community on 3 tiers of trust.',
'Cộng đồng DSTS xây trên 3 tầng tin cậy: xác thực, an toàn, bằng chứng.','DSTS community built on 3 tiers: verification, safety, evidence.','Trần Hà Tâm','post','published','cộng đồng, tin cậy, guardian',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('mot-doi-song-khong-bi-pha-tan-boi-xa-hoi','Một đời sống không bị phân tán bởi xã hội','A Life Not Scattered by Society',
'Khung thiết kế đời sống: (1) Một giá trị cốt lõi không thay đổi, (2) Ba lĩnh vực ưu tiên, (3) Mười thói quen hàng ngày, (4) Một người mentor để kiểm tra, (5) Một cộng đồng để thuộc về.','Life design framework: one core value, three priority domains, ten daily habits, one mentor, one community.',
'Khung thiết kế đời sống để không bị phân tán.','Life design framework against social scattering.','Trần Hà Tâm','post','published','đời sống, thiết kế, tập trung',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('doc-cham-de-song-sau','Đọc chậm để sống sâu','Read Slowly to Live Deeply',
'Phương pháp đọc chậm 4 bước: (1) Chọn một cuốn sách duy nhất cho tháng này, (2) Đọc mỗi ngày 20 phút, không vội, (3) Viết lại ý chính bằng lời của mình, (4) Áp dụng một ý vào hành động tuần này. DSTS Club có chương trình đọc chậm cùng mentor đã xác thực.','Slow reading in 4 steps: one book, 20 min/day, rewrite in your words, apply one idea. DSTS Club runs verified mentor-led reading groups.',
'Phương pháp đọc chậm 4 bước để sống sâu hơn.','4-step slow reading method for deeper living.','Trần Hà Tâm','post','published','đọc chậm, sống sâu, mentor',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('khoi-nghiep-tu-noi-song-that','Khởi nghiệp từ nơi sống thật','Entrepreneurship from Where You Truly Live',
'Khởi nghiệp từ giá trị, không từ nỗi sợ. Nỗi sợ bỏ lỡ (FOMO) tạo ra startup giống nhau. Giá trị thật tạo ra doanh nghiệp sống 10-20 năm. 3 câu hỏi: (1) Tôi sẵn sàng làm miễn phí 2 năm? (2) Có ai sẵn sàng trả tiền cho điều này ngay hôm nay? (3) Nếu thất bại, tôi vẫn tự hào vì đã thử?','Entrepreneurship from value, not fear. FOMO creates identical startups. Real value creates 10-20 year businesses. Three questions to ask.',
'Khởi nghiệp từ giá trị thật, không từ FOMO.','Start from real value, not FOMO.','Trần Hà Tâm','post','published','khởi nghiệp, giá trị, FOMO',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('vi-sao-con-nguoi-mat-phuong-huong','Vì sao con người mất phương hướng','Why People Lose Direction',
'Bản đồ phương hướng nội tâm: (1) Bạn tin điều gì là đúng dù không ai nói? (2) Bạn làm điều gì mà quên cả thời gian? (3) Ai là người bạn muốn trở thành trong 10 năm? (4) Bạn sẵn sàng hy sinh điều gì để đạt điều đó? (5) Nếu chỉ còn 1 năm sống, bạn sẽ làm gì?','Inner direction map: five questions to find your true north.',
'Năm câu hỏi tìm lại phương hướng nội tâm.','Five questions to find your inner direction.','Trần Hà Tâm','post','published','phương hướng, nội tâm, tìm kiếm',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('duong-di-cua-nhung-nguoi-muon-song-khac','Đường đi của những người muốn sống khác','The Path of Those Who Want to Live Differently',
'Chân dung người sống khác: (1) Không so sánh với người khác, chỉ so với chính mình năm ngoái. (2) Không nói "tôi bận", mà nói "tôi chọn". (3) Không sợ im lặng, sợ ồn ào vô nghĩa. (4) Có một nơi thuộc về — không phải quê hương, mà là cộng đồng chọn lọc.','Portrait of those who live differently: no comparison, no "busy", no fear of silence, a chosen community.',
'Chân dung người chọn sống khác biệt.','Portrait of those who choose to live differently.','Trần Hà Tâm','post','published','sống khác, chân dung, cộng đồng',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('song-cham-khong-phai-luoi','Sống chậm không phải lười, mà là chọn đúng nhịp','Slow Living Is Not Laziness, It Is Choosing the Right Rhythm',
'Sống chậm là chọn đúng nhịp: (1) Không phản hồi email trong 24 giờ đầu tiên. (2) Đọc một cuốn sách trong 1 tháng thay vì 1 tuần. (3) Nói chuyện với một người 30 phút thay vì 30 người 1 phút. (4) Làm một việc tốt thay vì 10 việc vừa đủ. (5) Ngủ đủ giấc.','Slow living: delayed email replies, one book per month, deep conversations, one thing done well, enough sleep.',
'Sống chậm là chọn đúng nhịp, không phải lười biếng.','Slow living is choosing the right rhythm, not laziness.','Trần Hà Tâm','post','published','sống chậm, nhịp sống, chọn lựa',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('tri-thuc-song-khac-gi-thong-tin','Tri thức sống khác gì thông tin','Knowledge Is Different from Information',
'Thông tin là dữ liệu chưa qua xử lý. Tri thức sống là thông tin đã được: (1) Kiểm chứng bằng kinh nghiệm, (2) Kết nối với hệ thống tư duy hiện có, (3) Truyền đạt được cho người khác bằng lời của mình, (4) Dẫn đến hành động cụ thể. DSTS không phân phối thông tin. Chúng tôi lưu giữ tri thức sống.','Information is unprocessed data. Living knowledge is verified by experience, connected to existing thinking, teachable in your own words, leading to action. DSTS preserves living knowledge, not information.',
'DSTS lưu giữ tri thức sống, không phân phối thông tin.','DSTS preserves living knowledge, not information.','Trần Hà Tâm','post','published','tri thức, thông tin, lưu giữ',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('khi-nao-nen-roi-dieu-quen-thuoc','Khi nào nên rời khỏi điều quen thuộc','When to Leave the Familiar',
'Năm dấu hiệu cần rời đi: (1) Bạn học được ít hơn 1 điều mới mỗi tháng. (2) Bạn không còn ngạc nhiên. (3) Bạn bắt đầu giải thích cho người khác tại sao mình "không thể" thay đổi. (4) Sợ thất bại lớn hơn mong muốn thành công. (5) Bạn nhìn lại 1 năm và thấy mình giống hệt năm trước.','Five signs to leave: learning less than one new thing per month, no longer surprised, justifying why you cannot change, fear of failure outweighs desire for success, same person as last year.',
'Năm dấu hiệu cho biết đã đến lúc rời khỏi điều quen thuộc.','Five signs it is time to leave the familiar.','Trần Hà Tâm','post','published','rời đi, thay đổi, chuyển hóa',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('loi-moi-song-tinh-thuc','Đường Sao Tỏa Sáng và lời mời sống tỉnh thức','DSTS and the Invitation to Live Consciously',
'Brand story của DSTS: "Đường Sao Tỏa Sáng" không phải là một đích đến. Đó là một lời mời: sống tỉnh thức, có chủ đích, có cộng đồng. Không hứa kết quả ảo. Không bán giấc mơ. Chỉ xây hạ tầng để bạn tự chọn hành trình của mình.','The DSTS brand story: "The Path of Shining Stars" is not a destination. It is an invitation to live consciously, intentionally, with community. No fake promises. No dream selling. Just infrastructure for your own journey.',
'Lời mời sống tỉnh thức từ Đường Sao Tỏa Sáng.','Invitation to conscious living from DSTS.','Trần Hà Tâm','post','published','brand story, tỉnh thức, lời mời',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('mentor-la-gi-khong-phai-la-nguoi-hoan-hao','Mentor là gì? Không phải người hoàn hảo','What Is a Mentor? Not a Perfect Person',
'Mentor là người đã từng đi qua con đường bạn đang đi, và sẵn sàng quay lại chỉ cho bạn những hố sâu mà chính họ đã ngã. Mentor không cần hoàn hảo. Mentor cần trung thực về những gì họ biết và không biết. DSTS Mentor Network yêu cầu: verified identity, evidence of achievement, guardian-first commitment, no-overclaim pledge.','A mentor is someone who has walked the path you are on and is willing to turn back to show you the pits they fell into. They do not need to be perfect. They need to be honest about what they know and do not know. DSTS Mentor Network requires: verified identity, evidence, guardian-first, no-overclaim.',
'Mentor là người trung thực về những gì họ biết, không cần hoàn hảo.','A mentor is honest about what they know, not perfect.','Trần Hà Tâm','post','published','mentor, trung thực, verified identity',0,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';

INSERT INTO posts (slug, title_vi, title_en, content_vi, content_en, excerpt_vi, excerpt_en, author, type, status, tags, featured, published_at) VALUES
('he-sinh-thai-toi-sang-danh-cho-ai','Hệ sinh thái tỏa sáng dành cho ai','Who Is the Shining Ecosystem For',
'DSTS không phải cho tất cả mọi người. DSTS dành cho: (1) Người muốn kể câu chuyện thật của mình, (2) Người muốn nghe câu chuyện thật của người khác, (3) Người muốn hướng dẫn thế hệ tiếp theo, (4) Người muốn đóng góp vào một hệ sinh thái có giá trị thật, (5) Người muốn tài trợ những gì có ý nghĩa. Nếu bạn muốn "nổi tiếng nhanh", DSTS không phải nơi cho bạn.','DSTS is not for everyone. It is for: storytellers, listeners, mentors, contributors, sponsors. If you want "quick fame," DSTS is not for you.',
'DSTS dành cho người tìm kiếm ý nghĩa thật, không phải nổi tiếng nhanh.','For those seeking real meaning, not quick fame.','Trần Hà Tâm','post','published','đối tượng, hệ sinh thái, ý nghĩa',1,'2026-06-14')
ON CONFLICT(slug) DO UPDATE SET content_vi=excluded.content_vi, content_en=excluded.content_en, updated_at='2026-06-14';
