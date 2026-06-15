// DSTS Trust.iai.one API Integration
// API client for trust.iai.one verification service
// Falls back to local verification gracefully when key is unavailable.

const TRUST_IAI_ONE_BASE_URL = 'https://trust.iai.one/api/v1';

/**
 * Verify entity with trust.iai.one
 * @param {Object} env - Cloudflare environment with TRUST_IAI_ONE_API_KEY
 * @param {Object} entityData - Entity data to verify
 * @param {Object} db - D1 database (for local fallback)
 * @returns {Promise<Object>} - Verification result
 */
export async function verifyWithTrustIAIOne(env, entityData, db) {
  const apiKey = env.TRUST_IAI_ONE_API_KEY;

  // If no key, create local verification record and return gracefully
  if (!apiKey) {
    console.warn('[trust-iai-one] No TRUST_IAI_ONE_API_KEY — using local verification fallback');
    if (db) {
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO trust_verifications (id, entity_type, entity_id, status, evidence_urls_json, created_at, updated_at)
        VALUES (?, ?, ?, 'pending', ?, datetime('now'), datetime('now'))
      `).bind(id, entityData.entity_type, entityData.entity_id,
        JSON.stringify(entityData.evidence || [])).run();
      return {
        ok: true,
        mode: 'local_fallback',
        verification_id: id,
        status: 'pending',
        message: 'Submitted to local queue. trust.iai.one integration pending API key.'
      };
    }
    return {
      ok: true,
      mode: 'local_fallback',
      status: 'pending',
      message: 'Local fallback: no D1 bound, no API key.'
    };
  }

  try {
    const response = await fetch(`${TRUST_IAI_ONE_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        entity_id: entityData.entity_id,
        entity_type: entityData.entity_type,
        entity_name: entityData.display_name,
        id_type: entityData.id_type,
        id_number: entityData.id_number,
        id_country: entityData.id_country,
        evidence: entityData.evidence || []
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('[trust-iai-one] API error:', response.status, error);
      // Graceful: return fallback on API failure too
      return {
        ok: false,
        mode: 'api_error',
        status: 'pending',
        error: error.message || `HTTP ${response.status}`,
        message: 'trust.iai.one API error. Queued for retry.'
      };
    }

    return await response.json();
  } catch (error) {
    console.error('[trust-iai-one] Network error:', error.message);
    return {
      ok: false,
      mode: 'network_error',
      status: 'pending',
      error: error.message,
      message: 'Network error connecting to trust.iai.one. Queued for retry.'
    };
  }
}

/**
 * Get verification status from trust.iai.one
 * @param {Object} env - Cloudflare environment with TRUST_IAI_ONE_API_KEY
 * @param {string} entityId - Entity ID to check
 * @returns {Promise<Object>} - Verification status
 */
export async function getVerificationStatus(env, entityId) {
  const apiKey = env.TRUST_IAI_ONE_API_KEY;

  if (!apiKey) {
    console.warn('[trust-iai-one] No TRUST_IAI_ONE_API_KEY — returning local status');
    return {
      ok: true,
      mode: 'local_fallback',
      status: 'pending',
      entity_id: entityId,
      message: 'No API key configured. Returning local status.'
    };
  }

  try {
    const response = await fetch(`${TRUST_IAI_ONE_BASE_URL}/status/${entityId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        ok: false,
        mode: 'api_error',
        status: 'pending',
        error: error.message || `HTTP ${response.status}`,
        entity_id: entityId
      };
    }

    return await response.json();
  } catch (error) {
    console.error('[trust-iai-one] Status check error:', error.message);
    return {
      ok: false,
      mode: 'network_error',
      status: 'pending',
      error: error.message,
      entity_id: entityId
    };
  }
}

/**
 * Sync verification status with local database
 * @param {Object} db - D1 database instance
 * @param {Object} env - Cloudflare environment
 * @param {string} entityId - Entity ID to sync
 * @returns {Promise<Object>} - Sync result
 */
export async function syncVerificationStatus(db, env, entityId) {
  try {
    // Get status from trust.iai.one (returns fallback if no key)
    const status = await getVerificationStatus(env, entityId);

    // If API returned fallback, return it without updating DB
    if (status.mode === 'local_fallback' || status.mode === 'api_error' || status.mode === 'network_error') {
      return {
        ok: true,
        mode: status.mode,
        status: status.status,
        message: status.message
      };
    }

    // Update local database
    await db.prepare(`
      UPDATE verified_entities
      SET status = ?, trust_score = ?, verified_at = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      status.status,
      status.trust_score || 0,
      status.verified_at || null,
      status.expires_at || null,
      entityId
    ).run();

    // Log verification sync
    await db.prepare(`
      INSERT INTO verification_audit_log (id, entity_id, action, status, response, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      crypto.randomUUID(),
      entityId,
      'sync',
      status.status,
      JSON.stringify(status)
    ).run();

    return {
      ok: true,
      status: status.status,
      trust_score: status.trust_score
    };
  } catch (error) {
    console.error('Verification sync error:', error);
    return {
      ok: false,
      error: error.message,
      mode: 'sync_error'
    };
  }
}

/**
 * Batch sync verification status for multiple entities
 * @param {Object} db - D1 database instance
 * @param {Object} env - Cloudflare environment
 * @param {Array<string>} entityIds - Entity IDs to sync
 * @returns {Promise<Object>} - Sync result with stats
 */
export async function batchSyncVerificationStatus(db, env, entityIds) {
  let success = 0;
  let fallback = 0;
  let failed = 0;
  const errors = [];

  for (const entityId of entityIds) {
    try {
      const result = await syncVerificationStatus(db, env, entityId);
      if (result.mode === 'local_fallback' || result.mode === 'api_error' || result.mode === 'network_error') {
        fallback++;
      } else if (result.ok) {
        success++;
      } else {
        failed++;
        errors.push({ entityId, error: result.error });
      }
    } catch (error) {
      failed++;
      errors.push({ entityId, error: error.message });
    }
  }

  return {
    ok: true,
    total: entityIds.length,
    success,
    fallback,
    failed,
    errors
  };
}
