// DSTS Trust Score Algorithm
// 5-dimension trust score calculation
// Dimensions: Identity Verification, Activity, Consistency, Reputation, Time/Evidence

/**
 * Calculate trust score based on 5 dimensions
 * @param {Object} entity - Verified entity data
 * @returns {Object} - Trust score with breakdown
 */
export function calculateTrustScore(entity) {
  const weights = {
    identity: 0.30,    // 30% - Identity verification strength
    activity: 0.20,    // 20% - Activity/engagement level
    consistency: 0.20, // 20% - Behavior consistency
    reputation: 0.15,  // 15% - Community reputation
    timeEvidence: 0.15 // 15% - Time since verification + evidence quality
  };

  // Dimension 1: Identity Verification (0-100)
  const identityScore = calculateIdentityScore(entity);
  
  // Dimension 2: Activity (0-100)
  const activityScore = calculateActivityScore(entity);
  
  // Dimension 3: Consistency (0-100)
  const consistencyScore = calculateConsistencyScore(entity);
  
  // Dimension 4: Reputation (0-100)
  const reputationScore = calculateReputationScore(entity);
  
  // Dimension 5: Time/Evidence (0-100)
  const timeEvidenceScore = calculateTimeEvidenceScore(entity);

  // Weighted total
  const totalScore = Math.round(
    (identityScore * weights.identity) +
    (activityScore * weights.activity) +
    (consistencyScore * weights.consistency) +
    (reputationScore * weights.reputation) +
    (timeEvidenceScore * weights.timeEvidence)
  );

  return {
    total: totalScore,
    breakdown: {
      identity: identityScore,
      activity: activityScore,
      consistency: consistencyScore,
      reputation: reputationScore,
      timeEvidence: timeEvidenceScore
    },
    weights,
    level: getTrustLevel(totalScore)
  };
}

function calculateIdentityScore(entity) {
  let score = 0;
  
  // Base score for being verified
  if (entity.verified_at) score += 20;
  
  // ID verification type
  if (entity.id_type === 'passport') score += 25;
  else if (entity.id_type === 'national_id') score += 20;
  else if (entity.id_type === 'driver_license') score += 15;
  else score += 10;
  
  // Evidence count (more evidence = higher score)
  const evidenceCount = entity.evidence_count || 0;
  score += Math.min(evidenceCount * 5, 25);
  
  // Verification tier
  if (entity.verification_tier === 'tier3') score += 15;
  else if (entity.verification_tier === 'tier2') score += 10;
  else if (entity.verification_tier === 'tier1') score += 5;
  
  return Math.min(score, 100);
}

function calculateActivityScore(entity) {
  let score = 0;
  
  // Days since last activity (more recent = higher score)
  const daysSinceActivity = entity.days_since_last_activity || 365;
  if (daysSinceActivity <= 7) score += 30;
  else if (daysSinceActivity <= 30) score += 25;
  else if (daysSinceActivity <= 90) score += 20;
  else if (daysSinceActivity <= 180) score += 15;
  else score += 10;
  
  // Activity count (posts, comments, etc.)
  const activityCount = entity.activity_count || 0;
  score += Math.min(activityCount * 2, 40);
  
  // Membership duration
  const daysSinceJoin = entity.days_since_join || 0;
  if (daysSinceJoin >= 365) score += 20;
  else if (daysSinceJoin >= 180) score += 15;
  else if (daysSinceJoin >= 90) score += 10;
  else if (daysSinceJoin >= 30) score += 5;
  
  return Math.min(score, 100);
}

function calculateConsistencyScore(entity) {
  let score = 0;
  
  // Profile completeness
  const completeness = entity.profile_completeness || 0;
  score += completeness * 0.4;
  
  // Regular activity pattern (how consistent is their activity)
  const consistencyRatio = entity.consistency_ratio || 0;
  score += consistencyRatio * 30;
  
  // No violations or flags
  if (!entity.has_violations) score += 20;
  
  // Response rate (how responsive to messages/requests)
  const responseRate = entity.response_rate || 0;
  score += responseRate * 10;
  
  return Math.min(Math.round(score), 100);
}

function calculateReputationScore(entity) {
  let score = 0;
  
  // Average rating from others
  const avgRating = entity.avg_rating || 0;
  score += avgRating * 20;
  
  // Number of positive reviews
  const positiveReviews = entity.positive_reviews || 0;
  score += Math.min(positiveReviews * 5, 30);
  
  // Endorsements from verified users
  const endorsements = entity.endorsements || 0;
  score += Math.min(endorsements * 3, 25);
  
  // No negative flags
  if (!entity.has_negative_flags) score += 15;
  
  return Math.min(Math.round(score), 100);
}

function calculateTimeEvidenceScore(entity) {
  let score = 0;
  
  // Time since verification (longer = higher score, up to 2 years)
  const daysSinceVerification = entity.days_since_verification || 0;
  if (daysSinceVerification >= 730) score += 30;
  else if (daysSinceVerification >= 365) score += 25;
  else if (daysSinceVerification >= 180) score += 20;
  else if (daysSinceVerification >= 90) score += 15;
  else if (daysSinceVerification >= 30) score += 10;
  else score += 5;
  
  // Evidence quality score
  const evidenceQuality = entity.evidence_quality || 0;
  score += evidenceQuality * 0.3;
  
  // Evidence recency (recent evidence = higher score)
  const evidenceRecency = entity.evidence_recency || 0;
  score += evidenceRecency * 20;
  
  // Evidence diversity (different types of evidence)
  const evidenceDiversity = entity.evidence_diversity || 0;
  score += evidenceDiversity * 10;
  
  return Math.min(Math.round(score), 100);
}

function getTrustLevel(score) {
  if (score >= 90) return 'verified';
  if (score >= 80) return 'gold';
  if (score >= 70) return 'silver';
  if (score >= 60) return 'bronze';
  return 'unverified';
}

/**
 * Update trust score in database
 * @param {Object} db - D1 database instance
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} - Updated trust score
 */
export async function updateTrustScore(db, entityId) {
  try {
    // Fetch entity data with all dimensions
    const entity = await db.prepare(`
      SELECT 
        e.*,
        COUNT(DISTINCT ev.id) as evidence_count,
        AVG(ev.quality_score) as evidence_quality,
        MAX(ev.created_at) as evidence_recency_days,
        COUNT(DISTINCT ev.type) as evidence_diversity
      FROM verified_entities e
      LEFT JOIN verification_evidence ev ON ev.entity_id = e.id
      WHERE e.id = ?
      GROUP BY e.id
    `).bind(entityId).first();
    
    if (!entity) {
      throw new Error('Entity not found');
    }
    
    // Calculate trust score
    const trustScore = calculateTrustScore(entity);
    
    // Update entity trust score
    await db.prepare(`
      UPDATE verified_entities 
      SET trust_score = ?, trust_level = ?, trust_score_updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(trustScore.total, trustScore.level, entityId).run();
    
    // Log to trust score history (use old_score/new_score columns from migration 0013)
    await db.prepare(`
      INSERT INTO trust_score_history (id, entity_type, entity_id, old_score, new_score, reason, changed_by, level, breakdown, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      crypto.randomUUID(),
      'verified_entity',
      entityId,
      0, // old_score (placeholder)
      trustScore.total, // new_score
      'Trust score calculation',
      'system',
      trustScore.level,
      JSON.stringify(trustScore.breakdown)
    ).run();
    
    return trustScore;
  } catch (error) {
    console.error('Failed to update trust score:', error);
    throw error;
  }
}

/**
 * Batch update trust scores for all entities
 * @param {Object} db - D1 database instance
 * @returns {Promise<number>} - Number of entities updated
 */
export async function batchUpdateTrustScores(db) {
  try {
    const entities = await db.prepare('SELECT id FROM verified_entities').all();
    
    let updated = 0;
    for (const entity of entities.results) {
      try {
        await updateTrustScore(db, entity.id);
        updated++;
      } catch (error) {
        console.error(`Failed to update trust score for entity ${entity.id}:`, error);
      }
    }
    
    return updated;
  } catch (error) {
    console.error('Failed to batch update trust scores:', error);
    throw error;
  }
}
