// DSTS Trust.iai.one API Integration
// API client for trust.iai.one verification service

const TRUST_IAI_ONE_BASE_URL = 'https://trust.iai.one/api/v1';

/**
 * Verify entity with trust.iai.one
 * @param {Object} env - Cloudflare environment with TRUST_IAI_ONE_API_KEY
 * @param {Object} entityData - Entity data to verify
 * @returns {Promise<Object>} - Verification result
 */
export async function verifyWithTrustIAIOne(env, entityData) {
  const apiKey = env.TRUST_IAI_ONE_API_KEY;
  
  if (!apiKey) {
    throw new Error('TRUST_IAI_ONE_API_KEY not configured');
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
      const error = await response.json();
      throw new Error(error.message || 'Verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Trust.iai.one verification error:', error);
    throw error;
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
    throw new Error('TRUST_IAI_ONE_API_KEY not configured');
  }

  try {
    const response = await fetch(`${TRUST_IAI_ONE_BASE_URL}/status/${entityId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Status check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Trust.iai.one status check error:', error);
    throw error;
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
    // Get status from trust.iai.one
    const status = await getVerificationStatus(env, entityId);
    
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
    throw error;
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
  let failed = 0;
  const errors = [];
  
  for (const entityId of entityIds) {
    try {
      await syncVerificationStatus(db, env, entityId);
      success++;
    } catch (error) {
      failed++;
      errors.push({ entityId, error: error.message });
    }
  }
  
  return {
    ok: true,
    total: entityIds.length,
    success,
    failed,
    errors
  };
}
