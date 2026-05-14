export const POST_CONTENTS = [
  {
    slug: "ke-hoach-phat-trien-dsts-2026-2027",
    type: "post",
    title_vi: "Kế hoạch phát triển Đường Sao Tỏa Sáng 2026-2027",
    title_en: "The 2026-2027 development plan for Đường Sao Tỏa Sáng",
    excerpt_vi: "Một bản giải thích public về cách DSTS đi từ nền móng website, thư viện tri thức, Movement Portal đến các chương trình cộng đồng dài hạn.",
    excerpt_en: "A public explanation of how DSTS moves from site foundations and the knowledge library toward Movement Portal and long-term community programs.",
    content_vi: `
      <p>Đường Sao Tỏa Sáng không nên được hiểu như một website đơn lẻ. Đây là một nền tảng phát triển theo nhiều lớp: nội dung nền tảng, chương trình public, thư viện bài viết, kịch bản hành trình, Movement Portal, Nuôi Dưỡng Những Ước Mơ và các hệ thống vận hành phía sau. Vì vậy, kế hoạch 2026-2027 phải bắt đầu bằng một điều tưởng nhỏ nhưng rất quan trọng: người dùng bước vào website phải hiểu ngay DSTS là gì, đang làm gì và phần nào đã sẵn sàng.</p>
      <p>Giai đoạn đầu không chạy theo việc mở thật nhiều tính năng. Ưu tiên số một là độ tin cậy. Mọi route chính phải mở được, không có trang đen, không loading vô hạn, không CTA dẫn vào trang hỏng, không mô tả một chương trình như đã hoạt động khi pháp lý hoặc vận hành chưa đủ. Một nền tảng cộng đồng chỉ có thể mở rộng khi người đọc cảm thấy thông tin rõ ràng và nhất quán.</p>
      <h2>Giai đoạn nền móng: nội dung, route và niềm tin</h2>
      <p>Sprint 0 của DSTS tập trung vào những việc căn bản: trang chủ phải giải thích toàn bộ dự án; các trang giới thiệu, chương trình, liên hệ, gây quỹ, minh bạch và pháp lý phải có nội dung thật; thư viện bài viết phải có fallback đầy đủ; trang chi tiết nội dung phải trả về bài viết thật hoặc lỗi 404 rõ ràng; sitemap, RSS, canonical và smoke test phải chạy được trên production.</p>
      <p>Điều này nghe giống kỹ thuật, nhưng thực chất là xây niềm tin. Khi một dự án nói về phát triển con người, cộng đồng, trẻ em, tài trợ hoặc chương trình quốc tế, sự mơ hồ sẽ tạo rủi ro. Người đọc cần biết phần nào là đang hoạt động, phần nào là kế hoạch, phần nào còn chờ Founder xác nhận và phần nào chưa được phép mở.</p>
      <h2>Movement Portal: mở từng cổng, không mở ồ ạt</h2>
      <p>Movement Portal là lớp cộng đồng của DSTS, bao gồm events, tour, diaspora map, press, partners, sponsors và gala status. Các cổng này được mở theo nguyên tắc read-only trước: người đọc có thể hiểu kế hoạch, trạng thái và điều kiện mở, nhưng không bị đưa vào form nhạy cảm. Các flow như đăng ký sự kiện, sponsor inquiry, thanh toán, email automation hoặc đăng nhập thuộc các lane khác và chỉ mở khi có owner chịu trách nhiệm.</p>
      <p>Cách làm này giúp DSTS tránh hai lỗi thường gặp: một là để route public trống hoặc hỏng; hai là mở CTA quá sớm khi hậu trường chưa đủ. Thay vào đó, route nào đủ nội dung an toàn thì mở read-only; route nào chưa đủ gate thì giữ noindex hoặc trạng thái pending rõ ràng.</p>
      <h2>Nuôi Dưỡng Những Ước Mơ và nguyên tắc Guardian-first</h2>
      <p>NDNUM là lớp cần tiêu chuẩn cao hơn vì có thể liên quan trẻ em, gia đình, mentor và tài trợ. Bất kỳ bề mặt public nào liên quan trẻ em đều phải đi trước bằng child safety, guardian consent, legal review và người phụ trách độc lập. DSTS không được dùng cảm xúc tốt đẹp để bỏ qua trách nhiệm bảo vệ người yếu thế.</p>
      <p>Trong giai đoạn public hiện tại, các trang NDNUM chỉ nên giải thích scope, nguyên tắc, trạng thái và ranh giới. Không mở contact trực tiếp với trẻ em, không public identity trẻ em, không tạo sponsor-child relationship trực tiếp và không dùng hình ảnh hoặc câu chuyện khi chưa có quyền rõ ràng.</p>
      <h2>Đích đến 2027: hệ thống có thể được kiểm chứng</h2>
      <p>Đến 2027, mục tiêu không chỉ là có nhiều trang hơn. Mục tiêu là có một hệ thống mà người dùng, cộng tác viên, đối tác và team dev có thể kiểm chứng: route nào live, chương trình nào đang chuẩn bị, event nào có owner, tài trợ nào đã đủ legal lane, nội dung nào có fallback, dữ liệu nào được bảo vệ và báo cáo nào đã được công bố.</p>
      <p>Một nền tảng tỏa sáng đúng nghĩa không cần hứa quá lớn ở bước đầu. Nó cần nhất quán, minh bạch, có trách nhiệm và biết giữ lời. Khi nền móng đó đủ vững, các lớp sản phẩm và cộng đồng phía sau mới có thể mở rộng mà không đánh mất niềm tin.</p>
    `,
    content_en: `
      <p>Đường Sao Tỏa Sáng should not be understood as a single website. It is a layered platform: foundational content, public programs, the article library, journey scripts, Movement Portal, Dream Nurture, and operational systems behind the scenes. For that reason, the 2026-2027 plan begins with something simple but crucial: when users enter the site, they should immediately understand what DSTS is, what it is building, and which parts are ready.</p>
      <p>The first stage is not about opening as many features as possible. The first priority is trustworthiness. Key routes must open. There should be no black pages, no infinite loading, no CTAs leading into broken destinations, and no program described as live when legal or operational readiness is missing.</p>
      <h2>Foundation stage: content, routes, and trust</h2>
      <p>DSTS Sprint 0 focuses on basics: the homepage must explain the project; about, program, contact, donate, transparency, and legal pages must contain real content; the article library must have complete fallback; content detail pages must render a real article or a clear 404; sitemap, RSS, canonical tags, and production smoke tests must work.</p>
      <p>This sounds technical, but it is really about trust. When a project speaks about human development, community, children, sponsorship, or international programs, ambiguity creates risk. Readers need to know what is active, what is planned, what is waiting for Founder confirmation, and what is not yet allowed to open.</p>
      <h2>Movement Portal: open one gate at a time</h2>
      <p>Movement Portal is the community layer of DSTS: events, tour, diaspora map, press, partners, sponsors, and gala status. These surfaces open read-only first. Readers can understand the plan, status, and opening conditions without being pushed into sensitive forms.</p>
      <p>This helps DSTS avoid two common mistakes: leaving public routes empty or broken, and opening CTAs too early. Instead, safe routes open read-only, while routes that lack readiness remain noindex or clearly pending.</p>
      <h2>Dream Nurture and the Guardian-first standard</h2>
      <p>NDNUM requires a higher standard because it may involve children, families, mentors, and sponsorship. Any public surface involving children must begin with child safety, guardian consent, legal review, and independent ownership.</p>
      <p>At the current public stage, NDNUM pages should explain scope, principles, status, and boundaries. They should not enable direct contact with children, public child identity, direct sponsor-child relationships, or use stories without clear rights.</p>
      <h2>The 2027 destination: a system people can verify</h2>
      <p>By 2027, the goal is not simply to have more pages. The goal is to have a system that users, collaborators, partners, and developers can verify: which routes are live, which programs are preparing, which events have owners, which sponsorships have legal lanes, which content has fallback, which data is protected, and which reports have been published.</p>
      <p>A platform that truly shines does not need to overpromise at the beginning. It needs consistency, transparency, responsibility, and the ability to keep its word.</p>
    `,
    tags: "kế hoạch,roadmap,nền tảng",
    reading_time: "9 phút đọc",
    cover_url: "",
    created_at: "2026-05-14T00:00:00.000Z"
  },
  {
    slug: "nguyen-tac-public-site-khong-trang-den",
    type: "post",
    title_vi: "Nguyên tắc public site không được có trang đen",
    title_en: "The rule that a public site must never go dark",
    excerpt_vi: "Một tiêu chuẩn vận hành cho DSTS: mọi trang public phải có nội dung, trạng thái, fallback hoặc lỗi rõ ràng, không để người đọc kẹt trong khoảng trống.",
    excerpt_en: "An operating standard for DSTS: every public page must have content, state, fallback, or a clear error, never leaving readers in a blank space.",
    content_vi: `
      <p>Một trang public bị đen, trống hoặc loading vô hạn không chỉ là lỗi giao diện. Đó là lỗi niềm tin. Người đọc không quan tâm phía sau là lỗi API, cache, routing, D1, CDN hay deploy nhầm project. Với họ, website chỉ đơn giản là không giữ được lời hứa cơ bản: mở ra một trang có thể đọc được.</p>
      <p>Vì vậy, DSTS cần một nguyên tắc cứng: không trang public nào được phép kẹt trong trạng thái “Đang tải...” mãi mãi. Mỗi bề mặt phải có ít nhất một trong bốn kết quả rõ ràng: render nội dung thật, render fallback tĩnh, render trạng thái pending có giải thích, hoặc trả 404 đúng nghĩa nếu nội dung không tồn tại.</p>
      <h2>Fallback không phải nội dung phụ</h2>
      <p>Trong một hệ thống public, fallback là một phần của sản phẩm. Nếu API lỗi, D1 chưa có dữ liệu hoặc dynamic content chưa sẵn, người dùng vẫn phải đọc được nội dung căn bản. Fallback không nên là vài dòng qua loa. Nó phải đủ hoàn chỉnh để bảo vệ trải nghiệm, SEO và niềm tin trong những lúc hệ thống động gặp sự cố.</p>
      <p>Với DSTS, fallback còn có vai trò editorial: nó giữ những bài viết nền, nguyên tắc công bố, thông tin chương trình và trạng thái route ở một mức có thể kiểm chứng. Khi dữ liệu động hoạt động, hệ thống có thể mở rộng. Khi dữ liệu động lỗi, nền tảng vẫn không sụp đổ trước mắt người dùng.</p>
      <h2>Route phải nói thật trạng thái của mình</h2>
      <p>Không phải route nào cũng nên index. Một số route đã đủ nội dung thì có thể index, như Movement Events, Sponsors Readiness Hub, Diaspora Map hoặc Tour Roadmap. Một số route chưa đủ quyết định thì nên noindex, như Gala 2026 khi A7 còn Founder TBD. Điều quan trọng là route phải nói thật: đang live, đang read-only, đang pending hay không tồn tại.</p>
      <p>Nếu một route chưa đủ điều kiện, cách đúng không phải là để 404 vô nghĩa hoặc chuyển người dùng vào trang loading. Cách đúng là đưa ra trạng thái rõ: vì sao chưa mở, cần điều kiện gì, người đọc nên đi đâu tiếp theo và phần nào không được hiểu là đã hoạt động.</p>
      <h2>Smoke test là hợp đồng tối thiểu</h2>
      <p>Smoke test không thay thế QA sâu, nhưng là hợp đồng tối thiểu trước khi gọi một bản deploy là an toàn. Test phải kiểm route chính trả 200, content marker xuất hiện, 404 thật trả 404, content missing trả 404, sitemap/RSS/robots hoạt động và các route noindex không bị đưa vào sitemap.</p>
      <p>Quan trọng hơn, smoke test phải chạy trên production, không chỉ local. Một site có thể đúng ở local nhưng sai trên custom domain vì cache, redirect hoặc project Cloudflare nhầm. DSTS đã gặp những lỗi này, nên quy trình phải giữ bằng chứng kiểm tra sau mỗi lần deploy.</p>
      <p>Không trang đen là tiêu chuẩn thấp nhất nhưng không thể thương lượng. Khi một dự án muốn nói về phát triển con người, sự tử tế và minh bạch, nó phải bắt đầu bằng việc không bỏ người đọc đứng trước một màn hình rỗng.</p>
    `,
    content_en: `
      <p>A public page that is black, empty, or stuck loading forever is not just a UI bug. It is a trust bug. Readers do not care whether the cause is an API error, cache, routing, D1, CDN, or deployment to the wrong project. To them, the site failed its basic promise: opening a readable page.</p>
      <p>DSTS therefore needs a strict rule: no public page may remain in a loading state forever. Every surface must produce one of four clear outcomes: render real content, render static fallback, render a clearly explained pending state, or return a proper 404 when content does not exist.</p>
      <h2>Fallback is not secondary content</h2>
      <p>In a public system, fallback is part of the product. If an API fails, D1 has no data, or dynamic content is not ready, users must still be able to read foundational content. Fallback should not be a few casual lines. It should be complete enough to protect user experience, SEO, and trust.</p>
      <h2>Routes must tell the truth about their state</h2>
      <p>Not every route should be indexed. Some routes have enough content and can be indexed. Others should remain noindex when decisions are pending. The important point is that the route tells the truth: live, read-only, pending, or not found.</p>
      <h2>Smoke testing is the minimum contract</h2>
      <p>Smoke testing does not replace deep QA, but it is the minimum contract before calling a deploy safe. It must check status codes, content markers, real 404s, sitemap/RSS/robots, and noindex routes staying out of sitemap.</p>
      <p>No black pages is the lowest standard, but it cannot be negotiated. A project that speaks about human development, integrity, and transparency must begin by not leaving readers in front of an empty screen.</p>
    `,
    tags: "qa,seo,vận hành",
    reading_time: "8 phút đọc",
    cover_url: "",
    created_at: "2026-05-13T23:30:00.000Z"
  },
  {
    slug: "movement-portal-mo-an-toan-theo-tung-cong",
    type: "post",
    title_vi: "Movement Portal mở an toàn theo từng cổng như thế nào",
    title_en: "How Movement Portal opens safely one gate at a time",
    excerpt_vi: "Movement Portal không mở cùng lúc mọi flow. Các cổng public được mở read-only trước để người đọc hiểu kế hoạch mà không bị đưa vào form nhạy cảm.",
    excerpt_en: "Movement Portal does not open every flow at once. Public gates open read-only first so readers understand the plan without being pushed into sensitive forms.",
    content_vi: `
      <p>Movement Portal là lớp cộng đồng của Đường Sao Tỏa Sáng. Nó bao gồm các bề mặt như events, sponsors, partners, press kit, diaspora map, tour roadmap và gala status. Đây là lớp giúp cộng đồng hiểu DSTS đang chuẩn bị hoạt động gì, mở theo thứ tự nào và điều kiện nào phải đủ trước khi một chương trình thật sự vận hành.</p>
      <p>Điểm quan trọng nhất là Movement Portal không nên được mở như một hệ thống giao dịch ngay từ đầu. Nếu chưa có owner, pháp lý, privacy, dữ liệu, reporting và đội phụ trách flow nhạy cảm, các trang chỉ nên mở ở mức read-only. Người đọc có thể hiểu kế hoạch, nhưng không bị yêu cầu nhập thông tin, thanh toán, đăng ký hoặc tạo tài khoản.</p>
      <h2>Read-only trước, flow nhạy cảm sau</h2>
      <p>Các route như /movement/events, /movement/sponsors, /movement/tour-2026-2027, /movement/diaspora-map, /movement/press và /movement/partners có thể mở an toàn nếu nội dung của chúng chỉ giải thích trạng thái, nguyên tắc và kế hoạch. Chúng không được chứa sponsor inquiry form, event registration form, email capture, payment checkout, login hoặc account creation.</p>
      <p>Cách này giúp DSTS vừa tránh trang trống, vừa không hứa quá sớm. Một trang sponsor có thể giải thích 13-tier taxonomy, nhưng chưa nhận tiền. Một trang events có thể ghi lịch public nền và readiness gates, nhưng chưa mở đăng ký. Một trang diaspora map có thể mô tả region clusters, nhưng chưa hiển thị personal pins hoặc thu dữ liệu.</p>
      <h2>Trang pending cũng là một phần của minh bạch</h2>
      <p>Không phải route nào cũng đủ điều kiện để index. Gala 2026 là ví dụ rõ: vì A7 còn chờ Founder xác nhận, route này không nên giả vờ là event đã live. Cách đúng là tạo một trang status pending, noindex, giải thích cần quyết định gì và dẫn người đọc về các bề mặt đã sẵn sàng.</p>
      <p>Một trang pending tốt không làm dự án yếu đi. Ngược lại, nó cho thấy hệ thống biết phân biệt giữa kế hoạch, trạng thái và hoạt động thật. Điều này đặc biệt quan trọng khi dự án liên quan cộng đồng, tài trợ, sự kiện hoặc trẻ em.</p>
      <h2>Release gates bảo vệ người dùng và team</h2>
      <p>Mỗi cổng Movement cần có release gates riêng. Events cần owner, status, venue hoặc hình thức rõ ràng, và post-event report. Sponsors cần pricing lock, legal agreement, money-lane firewall và fulfillment tracker. Diaspora Map cần privacy review, k-anonymity và không hiển thị trẻ em. Press và Partners cần quyền dùng tên, logo, boilerplate và thông tin public đã duyệt.</p>
      <p>Khi các gate này được giữ nghiêm túc, team dev không phải đoán. Người đọc không bị dẫn nhầm. Founder có thể nhìn thấy phần nào đang live, phần nào còn blocked và phần nào cần quyết định tiếp theo. Movement Portal vì vậy không chỉ là trang cộng đồng, mà là một hệ thống công bố trạng thái có trách nhiệm.</p>
    `,
    content_en: `
      <p>Movement Portal is the community layer of Đường Sao Tỏa Sáng. It includes events, sponsors, partners, press kit, diaspora map, tour roadmap, and gala status. It helps the community understand what DSTS is preparing, the order of opening, and the conditions required before a program truly operates.</p>
      <p>The most important point is that Movement Portal should not open as a transaction system from the start. If owner, legal, privacy, data, reporting, and sensitive-flow teams are not ready, pages should open read-only first.</p>
      <h2>Read-only first, sensitive flows later</h2>
      <p>Routes like events, sponsors, tour roadmap, diaspora map, press, and partners can open safely when they only explain status, principles, and plans. They should not contain sponsor inquiry forms, event registration forms, email capture, payment checkout, login, or account creation.</p>
      <h2>Pending pages are part of transparency</h2>
      <p>Not every route is ready to be indexed. Gala 2026 is a clear example: because A7 still waits for Founder confirmation, the route should not pretend to be a live event. A noindex pending-status page is the honest approach.</p>
      <h2>Release gates protect users and the team</h2>
      <p>Every Movement gate needs its own release criteria. Events need owner and status. Sponsors need legal and fulfillment gates. Diaspora Map needs privacy review and k-anonymity. Press and Partners need rights to names, logos, and public claims.</p>
      <p>When these gates are respected, developers do not have to guess, readers are not misled, and the Founder can see what is live, what is blocked, and what needs the next decision.</p>
    `,
    tags: "movement,route,minh bạch",
    reading_time: "7 phút đọc",
    cover_url: "",
    created_at: "2026-05-13T23:00:00.000Z"
  },
  {
    slug: "hanh-trinh-nhin-lai-chinh-minh",
    type: "post",
    title_vi: "Hành trình nhìn lại chính mình trong một thế giới quá ồn",
    title_en: "Looking back at yourself in an overly noisy world",
    excerpt_vi: "Có những giai đoạn con người không thiếu thông tin, mà thiếu sự lắng lại đủ sâu để nhận ra mình đang đi về đâu.",
    excerpt_en: "There are times when people do not lack information, but lack enough stillness to see where they are heading.",
    content_vi: `
      <p>Có những thời điểm con người sống giữa quá nhiều tín hiệu, quá nhiều lời mời gọi và quá nhiều tiếng ồn đến từ bên ngoài. Ta tưởng mình đang tiến lên rất nhanh, nhưng sâu hơn, có khi ta chỉ đang bị kéo đi bởi những thứ chưa từng được chọn một cách tỉnh táo.</p>
      <p>Thế giới hiện đại có thể làm một người bận rộn từ sáng đến khuya mà vẫn không giúp người đó hiểu mình hơn. Mỗi ngày có thêm thông báo, thêm mục tiêu, thêm hình ảnh để so sánh, thêm nỗi sợ bị bỏ lại. Nếu không có một điểm dừng, đời sống rất dễ biến thành chuỗi phản ứng liên tục thay vì một hành trình có chủ ý.</p>
      <h2>Dừng lại không phải là chậm lại vô ích</h2>
      <p>Dừng lại là hành động lấy lại quyền quan sát. Khi một người đủ yên để nhìn vào bên trong, họ bắt đầu phân biệt được điều mình thật sự cần với điều mình chỉ đang đuổi theo vì áp lực xã hội. Họ thấy đâu là ham muốn nhất thời, đâu là trách nhiệm dài hạn, đâu là giá trị cần được giữ ngay cả khi không ai vỗ tay.</p>
      <p>Nhìn lại chính mình cũng không phải là tự trách. Đó là cách trung thực để nhận ra những thói quen đã làm mình xa khỏi đời sống thật. Có người cần nhìn lại cách dùng thời gian. Có người cần nhìn lại các mối quan hệ. Có người cần nhìn lại lý do mình làm việc, học tập, sáng tạo hoặc theo đuổi một giấc mơ.</p>
      <h2>Một trục sống rõ hơn</h2>
      <p>Đường Sao Tỏa Sáng đặt nền trên niềm tin rằng con người chỉ có thể đi xa khi họ có trục sống đủ rõ. Trục ấy không phải khẩu hiệu treo bên ngoài, mà là khả năng tự hỏi: điều gì đang dẫn mình đi, điều gì đang làm mình phân tán, điều gì đáng để mình tiếp tục xây trong nhiều năm.</p>
      <p>Khi một người nhìn lại chính mình nghiêm túc, họ không còn dễ bị cuốn vào mọi làn sóng. Họ có thể học từ thế giới nhưng không tan vào tiếng ồn của thế giới. Họ có thể tham gia cộng đồng nhưng không đánh mất tiếng nói riêng. Họ có thể tỏa sáng mà không cần biến đời sống thành một cuộc trình diễn.</p>
      <p>Bài viết này là lời mời bắt đầu từ điều căn bản nhất: trước khi đi nhanh hơn, hãy nhìn lại hướng đi. Trước khi muốn được nhìn thấy, hãy nhìn thấy chính mình. Trước khi xây một hành trình lớn, hãy bảo vệ khoảng lặng giúp mình nhận ra điều gì thật sự có ý nghĩa.</p>
    `,
    content_en: `
      <p>There are moments when people live among too many signals, too many invitations, and too much noise from the outside world. We may think we are moving forward quickly, yet at a deeper level we may simply be carried by things we never consciously chose.</p>
      <p>Modern life can keep a person busy from morning to night without helping that person understand themselves more clearly. Each day brings more notifications, more goals, more images for comparison, and more fear of being left behind. Without a pause, life can become a chain of reactions instead of a deliberate journey.</p>
      <h2>Pausing is not wasted slowness</h2>
      <p>Pausing is the act of reclaiming observation. When a person becomes still enough to look within, they begin to distinguish what they truly need from what they are chasing because of social pressure. They see what is temporary desire, what is long-term responsibility, and what is worth holding even when no one applauds.</p>
      <p>Looking back at yourself is not self-blame. It is an honest way to notice the habits that have taken you away from real living. Some people need to review how they use time. Some need to review relationships. Some need to review why they work, learn, create, or pursue a dream.</p>
      <h2>A clearer inner axis</h2>
      <p>Đường Sao Tỏa Sáng is grounded in the belief that people can only travel far when they have a clear inner axis. That axis is not an external slogan, but the ability to ask: what is leading me, what is fragmenting me, and what is worth building for many years.</p>
      <p>When a person looks back at themselves seriously, they are less easily pulled by every wave. They can learn from the world without dissolving into its noise. They can join a community without losing their own voice. They can shine without turning life into a performance.</p>
      <p>This article is an invitation to begin from the most basic point: before moving faster, review the direction. Before wanting to be seen, see yourself. Before building a large journey, protect the quiet space that helps you recognize what truly matters.</p>
    `,
    tags: "nhận thức,hành trình,đời sống",
    reading_time: "7 phút đọc",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  },
  {
    slug: "sang-tao-khong-bat-dau-tu-tham-vong",
    type: "post",
    title_vi: "Sáng tạo không bắt đầu từ tham vọng mà từ sự thấy rõ",
    title_en: "Creativity does not begin with ambition but with clarity",
    excerpt_vi: "Điều tạo nên giá trị bền vững không phải là làm cho thật nhiều, mà là tạo ra đúng thứ cần được sinh ra.",
    excerpt_en: "What creates lasting value is not doing more, but bringing forth what truly needs to exist.",
    content_vi: `
      <p>Nhiều người nghĩ sáng tạo là phải mới, phải khác, phải gây ấn tượng thật mạnh. Nhưng nếu gốc của hành động sáng tạo chỉ là khao khát được nhìn thấy, sản phẩm ấy rất nhanh sẽ trở thành một màn trình diễn mệt mỏi. Nó có thể ồn ào trong một khoảnh khắc, nhưng khó tạo ra giá trị đủ lâu.</p>
      <p>Sáng tạo bền vững bắt đầu khi con người thấy rõ một nhu cầu thật. Đó có thể là một nỗi đau chưa được gọi tên, một câu hỏi chưa có ngôn ngữ phù hợp, một cộng đồng chưa có không gian để gặp nhau, hoặc một khả năng tốt đẹp của con người chưa được nuôi dưỡng đúng cách.</p>
      <h2>Thấy rõ trước khi làm nhiều</h2>
      <p>Khi chưa thấy rõ, càng làm nhiều càng dễ rối. Ta thêm tính năng, thêm hình ảnh, thêm chiến dịch, thêm lời hứa, nhưng không chắc điều đó có chạm vào nhu cầu thật hay không. Sự bận rộn khi ấy che lấp khoảng trống quan trọng nhất: mình đang phục vụ điều gì.</p>
      <p>Ngược lại, khi thấy rõ, sáng tạo trở nên gọn hơn và sâu hơn. Người sáng tạo biết nên bỏ điều gì, giữ điều gì, ưu tiên điều gì. Họ không cần chứng minh bằng số lượng. Họ tập trung làm cho đúng phần có ý nghĩa nhất, rồi để giá trị tự chứng minh qua đời sống thật của người dùng, người đọc, người học hoặc cộng đồng.</p>
      <h2>Từ tham vọng cá nhân đến giá trị phục vụ</h2>
      <p>Tham vọng không xấu nếu nó được đặt dưới sự tỉnh táo. Nhưng tham vọng trở nên nguy hiểm khi nó tách khỏi trách nhiệm. Khi một dự án chỉ được xây để phóng đại cái tôi, nó rất dễ bỏ qua hậu quả, bỏ qua người yếu thế và bỏ qua sự thật rằng mọi hệ thống lớn đều cần niềm tin.</p>
      <p>Đường Sao Tỏa Sáng chọn một hướng khác: sáng tạo phải đi cùng sự thấy rõ, trách nhiệm và khả năng nuôi dưỡng con người. Một bài viết, một chương trình, một sự kiện hay một sản phẩm chỉ đáng mở rộng khi nó giúp người dùng hiểu hơn, sống sâu hơn, kết nối lành mạnh hơn hoặc bước vào hành trình phát triển có nền tảng hơn.</p>
      <p>Vì vậy, câu hỏi đầu tiên không phải là làm sao để nổi bật. Câu hỏi đầu tiên là điều gì thật sự cần được sinh ra. Khi câu hỏi ấy được giữ đủ lâu, sáng tạo không còn là phản ứng trước thị trường. Nó trở thành một cách tham gia vào đời sống với sự tử tế, độ chính xác và tầm nhìn dài hạn.</p>
    `,
    content_en: `
      <p>Many people think creativity must be new, different, and highly impressive. But if the root of creative action is merely the desire to be seen, what is created quickly becomes an exhausting performance. It may be loud for a moment, but it rarely creates value that lasts.</p>
      <p>Sustainable creativity begins when a person clearly sees a real need. It may be a pain that has not been named, a question without the right language, a community without a space to meet, or a human possibility that has not been nurtured properly.</p>
      <h2>See clearly before doing more</h2>
      <p>When clarity is absent, doing more often creates more confusion. We add features, images, campaigns, and promises without knowing whether they touch a real need. Busyness then hides the most important question: what are we serving.</p>
      <p>When clarity is present, creativity becomes cleaner and deeper. The creator knows what to remove, what to keep, and what to prioritize. They do not need to prove themselves through quantity. They focus on the most meaningful part and allow value to prove itself through real life.</p>
      <h2>From personal ambition to service</h2>
      <p>Ambition is not wrong when guided by awareness. It becomes dangerous when separated from responsibility. When a project is built only to enlarge the ego, it easily ignores consequences, vulnerable people, and the fact that every large system needs trust.</p>
      <p>Đường Sao Tỏa Sáng chooses another direction: creativity must walk with clarity, responsibility, and the ability to nurture people. An article, program, event, or product deserves to grow only when it helps people understand more, live more deeply, connect more healthily, or enter a better-grounded journey of development.</p>
      <p>Therefore the first question is not how to stand out. The first question is what truly needs to be born. When that question is held long enough, creativity is no longer a reaction to the market. It becomes a way of participating in life with care, precision, and long-term vision.</p>
    `,
    tags: "sáng tạo,nhận thức,giá trị",
    reading_time: "7 phút đọc",
    cover_url: "",
    created_at: "2026-02-26T08:00:00.000Z"
  },
  {
    slug: "cong-dong-khong-phai-dam-dong",
    type: "post",
    title_vi: "Cộng đồng không phải đám đông, mà là những người cùng giữ một hướng đi",
    title_en: "Community is not a crowd, but people holding the same direction",
    excerpt_vi: "Một cộng đồng đúng không được xây bằng tiếng ồn, mà bằng sự tin cậy, trách nhiệm và khả năng cùng đi xa.",
    excerpt_en: "A true community is not built by noise, but by trust, responsibility, and the capacity to travel far together.",
    content_vi: `
      <p>Nhiều nơi tự gọi mình là cộng đồng chỉ vì có nhiều người xuất hiện cùng lúc. Nhưng số đông không đủ để tạo nên cộng đồng. Đám đông có thể tạo năng lượng nhất thời, tạo cảm giác náo nhiệt và tạo vài con số đẹp, nhưng cộng đồng thật cần nền tảng bền hơn nhiều.</p>
      <p>Cộng đồng bắt đầu khi có giá trị chung. Những người đi cùng nhau cần biết điều gì là quan trọng, điều gì không thể đánh đổi, điều gì đáng giữ ngay cả khi hoàn cảnh thay đổi. Nếu không có trục giá trị, nhóm người đông đến đâu cũng rất dễ tan khi lợi ích ngắn hạn biến mất.</p>
      <h2>Niềm tin là hạ tầng đầu tiên</h2>
      <p>Một cộng đồng không thể sống bằng khẩu hiệu. Nó sống bằng niềm tin được tích lũy qua hành động nhỏ nhưng nhất quán. Lời hứa phải đi cùng thực hiện. Sự tử tế phải đi cùng tiêu chuẩn. Sự mở rộng phải đi cùng khả năng bảo vệ người tham gia khỏi thao túng, lạm dụng hoặc kỳ vọng sai.</p>
      <p>Niềm tin cũng cần minh bạch. Người tham gia phải hiểu cộng đồng này tồn tại để làm gì, ai chịu trách nhiệm, dữ liệu được dùng thế nào, tiền bạc đi qua những kênh nào, và đâu là giới hạn của những điều nền tảng đang cung cấp. Càng có yếu tố trẻ em, gia đình, tài trợ hoặc giáo dục, tiêu chuẩn minh bạch càng phải cao.</p>
      <h2>Trách nhiệm chung thay cho tiêu thụ cộng đồng</h2>
      <p>Cộng đồng không bền nếu mọi người chỉ đến để nhận. Một cộng đồng trưởng thành cần những người sẵn sàng góp phần giữ không gian chung: góp tri thức, góp thời gian, góp sự chú ý, góp phản hồi trung thực, góp cách hành xử văn minh trong bất đồng.</p>
      <p>Đường Sao Tỏa Sáng nhìn cộng đồng như một cấu trúc nuôi dưỡng hành trình dài. Người trẻ cần người lớn đáng tin. Người sáng tạo cần môi trường có chiều sâu. Người Việt ở xa quê cần cầu nối văn hóa không hời hợt. Nhà tài trợ cần biết đóng góp của mình đi vào đâu. Tất cả những điều đó không thể được xây bằng đám đông vô hướng.</p>
      <p>Cộng đồng đúng là nơi con người cùng giữ một hướng đi. Không nhất thiết ai cũng giống nhau, nhưng phải cùng tôn trọng một nền giá trị. Không nhất thiết lúc nào cũng đồng ý, nhưng phải cùng giữ khả năng đối thoại. Không nhất thiết đi nhanh, nhưng phải đủ tin cậy để đi xa.</p>
    `,
    content_en: `
      <p>Many places call themselves a community simply because many people appear at once. But numbers alone do not create community. A crowd can generate temporary energy, a feeling of excitement, and a few attractive metrics, while real community requires a far more durable foundation.</p>
      <p>Community begins when shared values exist. Those walking together need to know what matters, what cannot be traded away, and what is worth holding even when circumstances change. Without a value axis, even a large group can dissolve when short-term benefits disappear.</p>
      <h2>Trust is the first infrastructure</h2>
      <p>A community cannot live on slogans. It lives through trust accumulated by small but consistent actions. Promises must be matched by execution. Kindness must be matched by standards. Growth must be matched by the ability to protect participants from manipulation, abuse, or misleading expectations.</p>
      <p>Trust also requires transparency. Participants need to understand why the community exists, who is responsible, how data is used, how money flows, and where the limits of the platform are. The more a system involves children, families, sponsorship, or education, the higher the transparency standard must be.</p>
      <h2>Shared responsibility instead of community consumption</h2>
      <p>A community cannot endure if everyone only comes to receive. A mature community needs people willing to help hold the common space: contributing knowledge, time, attention, honest feedback, and civil conduct during disagreement.</p>
      <p>Đường Sao Tỏa Sáng sees community as a structure that nurtures long journeys. Young people need trustworthy adults. Creators need an environment with depth. Vietnamese people far from home need cultural bridges that are not shallow. Sponsors need to know where their contribution goes. None of this can be built by a directionless crowd.</p>
      <p>A true community is a place where people hold a direction together. They do not have to be identical, but they must respect a shared foundation of values. They do not always have to agree, but they must preserve the capacity for dialogue. They do not have to move quickly, but they must be trustworthy enough to travel far.</p>
    `,
    tags: "cộng đồng,niềm tin,minh bạch",
    reading_time: "8 phút đọc",
    cover_url: "",
    created_at: "2026-02-20T08:00:00.000Z"
  },
  {
    slug: "mot-doi-song-khong-bi-pha-tan-boi-xa-hoi",
    type: "post",
    title_vi: "Một đời sống không bị phân tán bởi xã hội cần được xây thế nào",
    title_en: "How to build a life not scattered by society",
    excerpt_vi: "Khi không tự thiết kế đời sống của mình, con người sẽ bị kéo vào chương trình của người khác mà không hề nhận ra.",
    excerpt_en: "When you do not design your own life, you get pulled into someone else's program without noticing.",
    content_vi: `
      <p>Cuộc sống hiện đại đầy những lời mời gọi: làm nhiều hơn, kiếm nhiều hơn, theo kịp nhiều hơn, xuất hiện nhiều hơn. Không phải lời mời nào cũng xấu, nhưng nếu không có hệ quy chiếu riêng, con người rất dễ bị phân tán đến mức không còn biết đâu là đời sống của mình.</p>
      <p>Một đời sống bị phân tán thường không sụp đổ ngay. Nó hao mòn từ từ. Ta vẫn làm việc, vẫn trả lời tin nhắn, vẫn hoàn thành việc cần làm, nhưng bên trong ngày càng thiếu cảm giác có mặt. Sự chú ý bị chia nhỏ. Năng lượng bị rò rỉ. Các quyết định quan trọng bị trì hoãn vì mọi thứ đều có vẻ cấp bách.</p>
      <h2>Thiết kế đời sống bắt đầu từ giới hạn</h2>
      <p>Muốn sống không bị phân tán, trước hết phải biết đặt giới hạn. Giới hạn không làm đời sống nghèo đi. Nó bảo vệ phần quan trọng khỏi bị tiêu hao bởi những thứ không thật sự cần. Một người cần giới hạn thời gian trực tuyến, giới hạn số cam kết nhận vào, giới hạn kiểu quan hệ làm họ mất phương hướng, và giới hạn những mục tiêu không còn phù hợp.</p>
      <p>Giới hạn tốt không phải là tường kín. Nó giống một đường biên giúp ta biết điều gì được phép bước vào đời sống và điều gì cần được để ngoài. Khi đường biên rõ hơn, sự tập trung trở lại. Khi sự tập trung trở lại, con người có thể xây những việc lớn bằng nhịp đều thay vì bằng các cơn hưng phấn ngắn.</p>
      <h2>Nhịp sống có chủ ý</h2>
      <p>Mỗi người cần một nhịp sống đủ thật với hoàn cảnh của mình. Có người cần nhịp học tập. Có người cần nhịp sáng tạo. Có người cần nhịp chăm sóc gia đình. Có người cần nhịp phục hồi sau nhiều năm chạy theo kỳ vọng bên ngoài. Không có một công thức duy nhất cho tất cả, nhưng ai cũng cần một nhịp không phản bội sức khỏe và giá trị cốt lõi của mình.</p>
      <p>Đường Sao Tỏa Sáng xem đời sống cá nhân là nền của mọi hành trình tỏa sáng. Một tài năng không thể bền nếu đời sống bên trong luôn đổ vỡ. Một nhà sáng lập không thể xây hệ thống tử tế nếu chính đời sống của họ bị thao túng bởi nỗi sợ chứng minh. Một cộng đồng không thể khỏe nếu từng cá nhân trong đó không có khả năng tự giữ trục.</p>
      <p>Vì vậy, xây đời sống không bị phân tán là một phần của phát triển con người. Nó không chỉ giúp ta làm việc hiệu quả hơn. Nó giúp ta có mặt sâu hơn với điều đang làm, với người đang đi cùng và với tương lai mà mình thật sự muốn góp phần tạo ra.</p>
    `,
    content_en: `
      <p>Modern life is full of invitations: do more, earn more, keep up with more, appear more. Not every invitation is wrong, but without an inner reference system, a person can become so scattered that they no longer know what belongs to their own life.</p>
      <p>A scattered life does not usually collapse at once. It erodes slowly. We still work, reply to messages, and complete tasks, but internally we feel less present. Attention is fragmented. Energy leaks. Important decisions are delayed because everything appears urgent.</p>
      <h2>Designing life begins with boundaries</h2>
      <p>To live without being scattered, a person must first learn to set boundaries. Boundaries do not make life poorer. They protect what matters from being consumed by what is not necessary. A person needs boundaries around online time, incoming commitments, relationships that disorient them, and goals that no longer fit.</p>
      <p>A good boundary is not a sealed wall. It is a line that helps us know what is allowed into life and what should remain outside. When that line becomes clearer, attention returns. When attention returns, people can build important things through steady rhythm rather than short bursts of excitement.</p>
      <h2>A deliberate rhythm of living</h2>
      <p>Each person needs a rhythm that is real to their circumstances. Some need a rhythm of learning. Some need a rhythm of creation. Some need a rhythm of caring for family. Some need a rhythm of recovery after years of chasing external expectations. There is no single formula for all, but everyone needs a rhythm that does not betray their health and core values.</p>
      <p>Đường Sao Tỏa Sáng sees personal life as the foundation of every journey of shining. Talent cannot endure if the inner life is constantly collapsing. A founder cannot build a humane system if their own life is manipulated by fear of proving themselves. A community cannot be healthy if its individuals cannot hold their own axis.</p>
      <p>Therefore, building a life that is not scattered is part of human development. It does not only help us work more effectively. It helps us be more deeply present with what we do, with those who walk with us, and with the future we truly want to help create.</p>
    `,
    tags: "nhận thức,định hướng,đời sống",
    reading_time: "8 phút đọc",
    cover_url: "",
    created_at: "2026-02-14T08:00:00.000Z"
  },
  {
    slug: "doc-cham-de-song-sau",
    type: "post",
    title_vi: "Đọc chậm để sống sâu hơn trong thời đại đọc lướt",
    title_en: "Read slowly to live more deeply in an age of skimming",
    excerpt_vi: "Một bài viết tốt không chỉ cung cấp thông tin, mà mở ra một không gian để người đọc tự gặp lại chính mình.",
    excerpt_en: "A strong piece of writing does not only provide information, but opens a space for the reader to meet themselves again.",
    content_vi: `
      <p>Trong thời đại mọi thứ được tối ưu cho tốc độ, việc đọc cũng bị cuốn vào nhịp đọc lướt. Ta lướt tiêu đề, lướt đoạn ngắn, lướt cảm xúc của người khác, rồi tưởng mình đã hiểu. Nhưng hiểu thật thường cần nhiều hơn tốc độ. Nó cần sự ở lại.</p>
      <p>Đọc chậm không có nghĩa là đọc ít giá trị hơn. Trái lại, đọc chậm là cách trả lại chiều sâu cho tri thức. Khi đọc chậm, ta có thời gian để câu chữ đi qua trải nghiệm của mình, chạm vào những điều đã sống, đặt lại những câu hỏi cũ và mở ra những lựa chọn mới.</p>
      <h2>Thông tin không tự biến thành trí tuệ</h2>
      <p>Một người có thể tiếp nhận rất nhiều thông tin mà vẫn không trưởng thành hơn. Thông tin chỉ trở thành hiểu biết khi được tiêu hóa. Hiểu biết chỉ trở thành trí tuệ khi được thử trong đời sống, được điều chỉnh bởi trải nghiệm và được đặt dưới trách nhiệm.</p>
      <p>Đọc chậm giúp quá trình tiêu hóa ấy diễn ra. Thay vì chỉ hỏi bài này nói gì, ta bắt đầu hỏi bài này chạm vào phần nào trong mình. Điều gì đúng với trải nghiệm của mình. Điều gì cần được kiểm chứng thêm. Điều gì nếu đem vào hành động sẽ làm đời sống thay đổi.</p>
      <h2>Một văn hóa đọc có chiều sâu</h2>
      <p>Đường Sao Tỏa Sáng không xem thư viện bài viết chỉ là nơi đăng nội dung. Đây phải là một không gian rèn luyện khả năng đọc sâu, nghĩ rõ và đối thoại có trách nhiệm. Người đọc không bị xem như lượt truy cập. Người đọc là một con người đang trên hành trình nhận thức.</p>
      <p>Vì vậy, bài viết trên DSTS cần tránh hai cực đoan: một bên là khẩu hiệu quá rộng nhưng rỗng, một bên là thông tin quá vụn khiến người đọc không có điểm tựa. Nội dung tốt phải có cấu trúc, có giọng nói thật, có chiều sâu đủ để người đọc quay lại nhiều lần và vẫn thấy thêm điều mới.</p>
      <p>Đọc chậm là một hành động kháng cự lại sự phân tán. Nó nhắc ta rằng không phải điều gì nhanh cũng sâu, không phải điều gì nhiều cũng giàu, và không phải điều gì được nhìn thấy nhiều cũng đáng để đi theo. Có những điều chỉ mở ra khi ta đủ kiên nhẫn ở lại với nó.</p>
    `,
    content_en: `
      <p>In an age where everything is optimized for speed, reading has also been pulled into the rhythm of skimming. We skim headlines, short paragraphs, and other people’s emotions, then think we have understood. But real understanding often needs more than speed. It needs staying.</p>
      <p>Slow reading does not mean reading with less value. On the contrary, it restores depth to knowledge. When we read slowly, words have time to pass through our experience, touch what we have lived, reopen old questions, and make room for new choices.</p>
      <h2>Information does not automatically become wisdom</h2>
      <p>A person can absorb a great deal of information without becoming more mature. Information becomes understanding only when it is digested. Understanding becomes wisdom only when it is tested in life, adjusted by experience, and placed under responsibility.</p>
      <p>Slow reading helps that digestion happen. Instead of only asking what an article says, we begin asking what it touches in us. What is true to our experience. What needs further examination. What would change in life if we brought it into action.</p>
      <h2>A culture of deeper reading</h2>
      <p>Đường Sao Tỏa Sáng does not see the article library merely as a place to publish content. It should be a space to practice deep reading, clear thinking, and responsible dialogue. The reader is not treated as a page view. The reader is a human being on a journey of awareness.</p>
      <p>For that reason, DSTS articles need to avoid two extremes: broad but empty slogans on one side, and fragmented information that gives the reader no anchor on the other. Good content needs structure, an honest voice, and enough depth for the reader to return many times and still find something new.</p>
      <p>Slow reading is an act of resistance against fragmentation. It reminds us that not everything fast is deep, not everything abundant is rich, and not everything widely seen is worth following. Some things open only when we are patient enough to stay with them.</p>
    `,
    tags: "đọc sâu,nhận thức,tri thức",
    reading_time: "7 phút đọc",
    cover_url: "",
    created_at: "2026-02-10T08:00:00.000Z"
  },
  {
    slug: "khoi-nghiep-tu-noi-song-that",
    type: "post",
    title_vi: "Khởi nghiệp từ nơi sống thật thay vì từ nỗi sợ phải chứng minh",
    title_en: "Building from real living instead of the fear of proving yourself",
    excerpt_vi: "Nếu bắt đầu chỉ để chứng minh mình hơn người khác, ta sẽ rất nhanh kiệt sức trước khi đi đến giá trị thật.",
    excerpt_en: "If you begin only to prove yourself against others, exhaustion arrives long before true value does.",
    content_vi: `
      <p>Nhiều dự án khởi đầu rất mạnh vì được đẩy bằng năng lượng chứng minh. Người sáng lập muốn chứng minh mình giỏi, mình đúng, mình không thua kém, mình xứng đáng được công nhận. Năng lượng ấy có thể tạo tốc độ ban đầu, nhưng nếu nó là nhiên liệu chính, dự án rất dễ đi vào mệt mỏi.</p>
      <p>Khởi nghiệp từ nỗi sợ phải chứng minh thường khiến con người chọn sai thước đo. Họ quan tâm quá nhiều đến hình ảnh, phản ứng bên ngoài và cảm giác thắng nhanh. Trong khi đó, thứ một dự án thật sự cần là khả năng hiểu vấn đề, phục vụ người dùng, giữ lời hứa và xây hệ thống đủ bền.</p>
      <h2>Sống thật là nền của sản phẩm thật</h2>
      <p>Sống thật không có nghĩa là chỉ làm điều mình thích. Nó có nghĩa là đủ trung thực với năng lực, giới hạn, động cơ và trách nhiệm của mình. Một người sống thật biết mình đang xây vì điều gì. Họ không dùng người khác làm nền cho cái tôi. Họ không hứa quá khả năng chỉ để tạo cảm giác lớn.</p>
      <p>Khi một dự án đi ra từ nơi sống thật, nó thường bắt đầu khiêm tốn hơn nhưng chắc hơn. Nó không cần giả vờ đã hoàn hảo. Nó có thể nói rõ phần đang làm, phần chưa làm, phần cần đối tác, phần cần kiểm chứng. Chính sự rõ ràng ấy tạo niềm tin dài hạn.</p>
      <h2>Khởi nghiệp như một hành trình trưởng thành</h2>
      <p>Đường Sao Tỏa Sáng nhìn khởi nghiệp không chỉ như việc tạo doanh thu hay mở rộng thị trường. Đó còn là hành trình trưởng thành của con người đứng sau hệ thống. Nếu người xây không trưởng thành, hệ thống có thể lớn lên cùng những điểm mù nguy hiểm. Nếu người xây có khả năng tự quan sát, hệ thống có cơ hội phát triển lành mạnh hơn.</p>
      <p>Một dự án tốt cần kỷ luật vận hành, pháp lý rõ ràng, tài chính minh bạch, bảo vệ dữ liệu, tôn trọng người dùng và năng lực nói không với những cơ hội lệch trục. Những điều này không hấp dẫn như câu chuyện thành công nhanh, nhưng chúng là phần giữ cho thành công không biến thành rủi ro.</p>
      <p>Khởi nghiệp từ nơi sống thật là chọn xây từ gốc. Nó chậm hơn những màn trình diễn bên ngoài, nhưng sâu hơn. Nó không hứa rằng hành trình sẽ dễ, nhưng giúp người xây ít phản bội chính mình hơn. Và khi một dự án được xây từ nền đó, giá trị tạo ra có cơ hội trở thành điều người khác có thể tin, dùng và đi cùng lâu dài.</p>
    `,
    content_en: `
      <p>Many ventures begin with strong energy because they are driven by the need to prove something. The founder wants to prove they are capable, right, not inferior, and worthy of recognition. That energy may create early speed, but if it becomes the main fuel, the project easily turns exhausting.</p>
      <p>Building from the fear of proving oneself often leads people to choose the wrong metrics. They care too much about image, external reactions, and the feeling of quick victory. What a real project needs, however, is the ability to understand the problem, serve users, keep promises, and build a durable system.</p>
      <h2>Real living is the foundation of a real product</h2>
      <p>Living truthfully does not mean only doing what you like. It means being honest about your capacity, limits, motives, and responsibilities. A person living truthfully knows why they are building. They do not use others as a stage for the ego. They do not promise beyond capacity just to appear large.</p>
      <p>When a project comes from real living, it often starts more modestly but more firmly. It does not need to pretend it is perfect. It can say clearly what is being built, what is not yet built, what requires partners, and what still needs validation. That clarity creates long-term trust.</p>
      <h2>Entrepreneurship as a journey of maturity</h2>
      <p>Đường Sao Tỏa Sáng sees entrepreneurship not only as creating revenue or expanding a market. It is also a journey of maturity for the person behind the system. If the builder does not mature, the system may grow with dangerous blind spots. If the builder can observe themselves, the system has a better chance to grow healthily.</p>
      <p>A good project needs operational discipline, clear legal structure, transparent finance, data protection, respect for users, and the ability to say no to opportunities that pull it off axis. These things are less glamorous than stories of quick success, but they keep success from becoming risk.</p>
      <p>Building from real living means choosing to build from the root. It is slower than external performance, but deeper. It does not promise that the journey will be easy, but it helps the builder betray themselves less. And when a project is built from that foundation, the value it creates has a chance to become something others can trust, use, and walk with for a long time.</p>
    `,
    tags: "khởi nghiệp,sáng tạo,trách nhiệm",
    reading_time: "8 phút đọc",
    cover_url: "",
    created_at: "2026-02-06T08:00:00.000Z"
  }
]

export const PAGE_CONTENTS = [
  {
    slug: "about",
    type: "page",
    title_vi: "Giới thiệu Đường Sao Tỏa Sáng",
    title_en: "About Đường Sao Tỏa Sáng",
    excerpt_vi: "Tầm nhìn, sứ mệnh và định hướng phát triển của nền tảng Đường Sao Tỏa Sáng.",
    excerpt_en: "Vision, mission, and development direction of Đường Sao Tỏa Sáng.",
    content_vi: "<p>Đường Sao Tỏa Sáng là nền tảng tri thức, chương trình và cộng đồng dành cho hành trình tỏa sáng của người Việt trên toàn cầu.</p>",
    content_en: "<p>Đường Sao Tỏa Sáng is a knowledge, program, and community platform for the shining journey of Vietnamese people worldwide.</p>",
    tags: "giới thiệu,hệ thống",
    reading_time: "3 phút đọc",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  },
  {
    slug: "program",
    type: "page",
    title_vi: "Chương trình Đường Sao Tỏa Sáng",
    title_en: "Programs of Đường Sao Tỏa Sáng",
    excerpt_vi: "Tổng quan các chuỗi chương trình nghệ thuật, giáo dục, cộng đồng và tri thức.",
    excerpt_en: "Overview of artistic, educational, community, and knowledge program series.",
    content_vi: "<p>DSTS phát triển các chương trình dành cho nghệ sĩ, doanh nhân, tài năng Việt toàn cầu và cộng đồng người Việt muôn nơi.</p>",
    content_en: "<p>DSTS develops programs for artists, entrepreneurs, global Vietnamese talents, and the Vietnamese worldwide community.</p>",
    tags: "chương trình,cộng đồng",
    reading_time: "3 phút đọc",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  }
]

export const FALLBACK_CONTENTS = [...POST_CONTENTS, ...PAGE_CONTENTS]

export function normalizeLang(value) {
  return value === "en" ? "en" : "vi"
}

export function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function localizeItem(item, lang = "vi") {
  const normalizedLang = normalizeLang(lang)
  return {
    ...item,
    title: normalizedLang === "en"
      ? (item.title_en || item.title_vi || "")
      : (item.title_vi || item.title_en || ""),
    excerpt: normalizedLang === "en"
      ? (item.excerpt_en || item.excerpt_vi || "")
      : (item.excerpt_vi || item.excerpt_en || ""),
    content: normalizedLang === "en"
      ? (item.content_en || item.content_vi || "")
      : (item.content_vi || item.content_en || "")
  }
}

export function selectFallback({ type = "", limit = 24, q = "", lang = "vi" } = {}) {
  let list = [...FALLBACK_CONTENTS]

  if (type) {
    list = list.filter((item) => item.type === type)
  }

  if (q) {
    const keyword = normalizeText(q)
    list = list.filter((item) => {
      const haystack = normalizeText([
        item.slug,
        item.title_vi,
        item.title_en,
        item.excerpt_vi,
        item.excerpt_en,
        item.content_vi,
        item.content_en,
        item.tags
      ].join(" "))
      return haystack.includes(keyword)
    })
  }

  list.sort((a, b) => {
    const da = new Date(a.created_at || 0).getTime()
    const db = new Date(b.created_at || 0).getTime()
    return db - da
  })

  return list.slice(0, limit).map((item) => localizeItem(item, lang))
}

export function findFallback(slug, lang = "vi") {
  const normalizedSlug = String(slug || "").trim()
  const item = FALLBACK_CONTENTS.find((entry) => entry.slug === normalizedSlug)
  return item ? localizeItem(item, lang) : null
}
