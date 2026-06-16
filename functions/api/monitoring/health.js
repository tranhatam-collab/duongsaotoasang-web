// FILE: /functions/api/monitoring/health.js

export const onRequestGet = async ({ request, env }) => {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // Check database connection
    if (env.DB) {
      try {
        const result = await env.DB.prepare("SELECT 1").first();
        healthCheck.checks.database = {
          status: "healthy",
          message: "Database connection successful"
        };
      } catch (error) {
        healthCheck.checks.database = {
          status: "unhealthy",
          message: "Database connection failed",
          error: error.message
        };
        healthCheck.status = "degraded";
      }
    } else {
      healthCheck.checks.database = {
        status: "skipped",
        message: "Database not configured"
      };
    }

    // Check external integrations
    healthCheck.checks.integrations = {
      trust_iai_one: env.TRUST_IAI_ONE_API_KEY ? "configured" : "not_configured",
      nguoiviet: env.NGUOIVIET_CLIENT_ID ? "configured" : "not_configured",
      mail_api: env.MAIL_API_KEY ? "configured" : "not_configured"
    };

    // Check required secrets
    const requiredSecrets = [
      "PAY_IAI_ONE_API_KEY",
      "PAY_DSTS_HMAC",
      "MAIL_API_KEY",
      "POLL_TOKEN"
    ];

    const missingSecrets = requiredSecrets.filter(secret => {
      const envVar = env[secret];
      return !envVar || envVar.length === 0;
    });

    healthCheck.checks.secrets = {
      status: missingSecrets.length === 0 ? "healthy" : "degraded",
      configured: requiredSecrets.length - missingSecrets.length,
      required: requiredSecrets.length,
      missing: missingSecrets
    };

    if (missingSecrets.length > 0) {
      healthCheck.status = "degraded";
    }

    // Check response time
    const startTime = Date.now();
    healthCheck.checks.response_time = {
      status: "healthy",
      duration_ms: Date.now() - startTime
    };

    return json(healthCheck);
  } catch (error) {
    console.error("Health check error:", error);
    return json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message
    }, 500);
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
