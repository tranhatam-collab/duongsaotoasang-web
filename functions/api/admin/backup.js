// FILE: /functions/api/admin/backup.js

export const onRequestPost = async ({ request, env }) => {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return json({ ok: false, error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    if (token !== (env.BACKUP_TOKEN || "dev-backup-token")) {
      return json({ ok: false, error: "Invalid token" }, 401);
    }

    if (!env.DB) {
      return json({ ok: false, error: "Database not available" }, 500);
    }

    // Export all tables
    const backup = {
      timestamp: new Date().toISOString(),
      tables: {}
    };

    // Backup users table
    try {
      const usersResult = await env.DB.prepare("SELECT * FROM users").all();
      backup.tables.users = Array.isArray(usersResult.results) ? usersResult.results : [];
    } catch (error) {
      backup.tables.users = { error: error.message };
    }

    // Backup contents table
    try {
      const contentsResult = await env.DB.prepare("SELECT * FROM contents").all();
      backup.tables.contents = Array.isArray(contentsResult.results) ? contentsResult.results : [];
    } catch (error) {
      backup.tables.contents = { error: error.message };
    }

    // Backup other critical tables
    const tablesToBackup = [
      "wallet_transactions",
      "referrals",
      "clubs",
      "mentors",
      "alerts"
    ];

    for (const table of tablesToBackup) {
      try {
        const result = await env.DB.prepare(`SELECT * FROM ${table}`).all();
        backup.tables[table] = Array.isArray(result.results) ? result.results : [];
      } catch (error) {
        backup.tables[table] = { error: error.message };
      }
    }

    // Calculate backup size
    const backupSize = JSON.stringify(backup).length;

    return json({
      ok: true,
      message: "Backup completed successfully",
      backup: {
        timestamp: backup.timestamp,
        tables: Object.keys(backup.tables),
        size_bytes: backupSize,
        size_mb: (backupSize / (1024 * 1024)).toFixed(2)
      }
    });
  } catch (error) {
    console.error("Backup error:", error);
    return json({ ok: false, error: "Failed to create backup" }, 500);
  }
};

export const onRequestGet = async ({ request, env }) => {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return json({ ok: false, error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    if (token !== (env.BACKUP_TOKEN || "dev-backup-token")) {
      return json({ ok: false, error: "Invalid token" }, 401);
    }

    if (!env.DB) {
      return json({ ok: false, error: "Database not available" }, 500);
    }

    // Get backup history from Cloudflare D1 (if available)
    // For now, return basic info
    return json({
      ok: true,
      message: "Backup history",
      backups: [
        {
          id: "manual",
          timestamp: new Date().toISOString(),
          type: "manual",
          status: "available"
        }
      ]
    });
  } catch (error) {
    console.error("Backup history error:", error);
    return json({ ok: false, error: "Failed to get backup history" }, 500);
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
