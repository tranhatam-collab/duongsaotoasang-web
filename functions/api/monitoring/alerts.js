// FILE: /functions/api/monitoring/alerts.js

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json();
    const { alert_type, severity, message, metadata } = body;

    if (!alert_type || !severity || !message) {
      return json({ ok: false, error: "Missing required fields" }, 400);
    }

    // Validate severity
    const validSeverities = ["info", "warning", "error", "critical"];
    if (!validSeverities.includes(severity)) {
      return json({ ok: false, error: "Invalid severity" }, 400);
    }

    // Log the alert
    console.error(`[ALERT] ${severity.toUpperCase()}: ${alert_type} - ${message}`, metadata);

    // Store alert in database if available
    if (env.DB) {
      const insertStmt = env.DB.prepare(`
        INSERT INTO alerts (alert_type, severity, message, metadata, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        alert_type,
        severity,
        message,
        JSON.stringify(metadata || {}),
        new Date().toISOString()
      );

      await insertStmt.run();
    }

    // Send notification based on severity
    if (severity === "critical" || severity === "error") {
      await sendNotification(alert_type, severity, message, metadata, env);
    }

    return json({ ok: true, message: "Alert logged successfully" });
  } catch (error) {
    console.error("Alert logging error:", error);
    return json({ ok: false, error: "Failed to log alert" }, 500);
  }
};

async function sendNotification(alert_type, severity, message, metadata, env) {
  // Send email notification
  if (env.MAIL_API_KEY && env.SUPPORT_EMAIL) {
    try {
      await fetch(`${env.MAIL_API_BASE_URL}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": env.MAIL_API_KEY
        },
        body: JSON.stringify({
          to: env.SUPPORT_EMAIL,
          subject: `[DSTS ALERT] ${severity.toUpperCase()}: ${alert_type}`,
          text: `
Alert Type: ${alert_type}
Severity: ${severity}
Message: ${message}
Timestamp: ${new Date().toISOString()}
Metadata: ${JSON.stringify(metadata, null, 2)}
          `.trim(),
          workspace_id: env.MAIL_API_WORKSPACE_ID
        })
      });
    } catch (error) {
      console.error("Failed to send alert notification:", error);
    }
  }

  // In production, also send to Slack, PagerDuty, etc.
  // This would require additional configuration
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
