// FILE: /functions/_lib/seed-data.js

// Seed data for testing DSTS database
// This provides test data for development and testing purposes

export const SEED_USERS = [
  {
    user_id: "user_001",
    email: "test.user@example.com",
    display_name: "Test User",
    password_hash: "hashed_password_here",
    trust_score: 75,
    verified_status: "verified",
    verified_at: "2026-01-15T00:00:00Z",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    user_id: "user_002",
    email: "mentor@example.com",
    display_name: "Verified Mentor",
    password_hash: "hashed_password_here",
    trust_score: 85,
    verified_status: "verified_mentor",
    verified_at: "2026-02-01T00:00:00Z",
    created_at: "2026-01-15T00:00:00Z"
  },
  {
    user_id: "user_003",
    email: "creator@example.com",
    display_name: "Verified Creator",
    password_hash: "hashed_password_here",
    trust_score: 80,
    verified_status: "verified_creator",
    verified_at: "2026-02-15T00:00:00Z",
    created_at: "2026-02-01T00:00:00Z"
  }
];

export const SEED_STORIES = [
  {
    slug: "test-story-1",
    type: "story",
    title_vi: "Câu chuyện kiểm thử 1",
    title_en: "Test Story 1",
    excerpt_vi: "Đây là câu chuyện kiểm thử cho hệ thống DSTS",
    excerpt_en: "This is a test story for DSTS system",
    content_vi: "Nội dung chi tiết của câu chuyện kiểm thử 1...",
    content_en: "Detailed content of test story 1...",
    tags: "test,story,dsts",
    cover_url: "https://duongsaotoasang.com/og.png",
    created_at: "2026-03-01T00:00:00Z"
  },
  {
    slug: "test-story-2",
    type: "story",
    title_vi: "Câu chuyện kiểm thử 2",
    title_en: "Test Story 2",
    excerpt_vi: "Câu chuyện kiểm thử thứ hai cho hệ thống",
    excerpt_en: "Second test story for the system",
    content_vi: "Nội dung chi tiết của câu chuyện kiểm thử 2...",
    content_en: "Detailed content of test story 2...",
    tags: "test,story,vietnamese",
    cover_url: "https://duongsaotoasang.com/og.png",
    created_at: "2026-03-15T00:00:00Z"
  }
];

export const SEED_MENTORS = [
  {
    mentor_id: "mentor_001",
    user_id: "user_002",
    field: "Kinh doanh & Khởi nghiệp",
    experience: "10 năm kinh nghiệm startup",
    credential: "MBA từ Đại học Harvard",
    trust_score: 85,
    verified_at: "2026-02-01T00:00:00Z"
  }
];

export const SEED_CLUBS = [
  {
    club_id: "club_001",
    name: "DSTS Club Hanoi",
    location: "Hanoi, Vietnam",
    leader_id: "user_001",
    member_count: 50,
    created_at: "2026-01-01T00:00:00Z"
  }
];

export const SEED_WALLET_TRANSACTIONS = [
  {
    transaction_id: "txn_001",
    user_id: "user_001",
    type: "credit",
    amount: 100,
    description: "Star Points bonus",
    created_at: "2026-03-01T00:00:00Z"
  }
];

export const SEED_REFERRALS = [
  {
    referral_id: "ref_001",
    referrer_user_id: "user_001",
    referred_user_id: "user_002",
    status: "completed",
    reward: 50,
    referred_at: "2026-02-01T00:00:00Z"
  }
];

// Function to seed database
export async function seedDatabase(env) {
  if (!env.DB) {
    console.log("Database not available for seeding");
    return;
  }

  try {
    console.log("Starting database seeding...");

    // Seed users
    for (const user of SEED_USERS) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO users (user_id, email, display_name, password_hash, trust_score, verified_status, verified_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        user.user_id,
        user.email,
        user.display_name,
        user.password_hash,
        user.trust_score,
        user.verified_status,
        user.verified_at,
        user.created_at
      ).run();
    }
    console.log(`Seeded ${SEED_USERS.length} users`);

    // Seed stories
    for (const story of SEED_STORIES) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO contents (slug, type, title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, tags, cover_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        story.slug,
        story.type,
        story.title_vi,
        story.title_en,
        story.excerpt_vi,
        story.excerpt_en,
        story.content_vi,
        story.content_en,
        story.tags,
        story.cover_url,
        story.created_at
      ).run();
    }
    console.log(`Seeded ${SEED_STORIES.length} stories`);

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Database seeding failed:", error);
    throw error;
  }
}
