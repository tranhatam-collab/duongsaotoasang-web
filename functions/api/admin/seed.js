// FILE: /functions/api/admin/seed.js

import { seedDatabase } from "../../_lib/seed-data.js";

export const onRequestPost = async ({ request, env }) => {
  try {
    // Check for admin authorization (simplified for development)
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return json({ ok: false, error: "Unauthorized" }, 401);
    }

    // In production, verify the token properly
    // For now, we'll accept any Bearer token for development
    const token = authHeader.replace("Bearer ", "");
    if (token !== (env.SEED_TOKEN || "dev-seed-token")) {
      return json({ ok: false, error: "Invalid token" }, 401);
    }

    // Seed the database
    await seedDatabase(env);

    return json({ 
      ok: true, 
      message: "Database seeded successfully",
      seeded: {
        users: 3,
        stories: 2
      }
    });
  } catch (error) {
    console.error("Seed API error:", error);
    return json({ ok: false, error: "Failed to seed database" }, 500);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
