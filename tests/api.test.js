// FILE: /tests/api.test.js

// Basic API testing suite for DSTS
// This provides automated testing for critical API endpoints

// Test configuration
const BASE_URL = "https://duongsaotoasang.com";
const TEST_TIMEOUT = 10000;

// Test results
const results = {
  passed: 0,
  failed: 0,
  total: 0
};

// Test helper functions
async function testEndpoint(name, url, expectedStatus = 200, expectJson = true) {
  results.total++;
  console.log(`Testing: ${name}`);
  
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: expectJson ? {
        'Accept': 'application/json'
      } : {}
    });
    
    const status = response.status;
    const contentType = response.headers.get('content-type') || '';
    
    // Only try to parse JSON if we expect it or content-type says it's JSON
    let data;
    if (expectJson || contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (status === expectedStatus) {
      results.passed++;
      console.log(`✅ PASS: ${name} (${status})`);
      return { success: true, status, data };
    } else {
      results.failed++;
      console.log(`❌ FAIL: ${name} (Expected ${expectedStatus}, got ${status})`);
      return { success: false, status, data };
    }
  } catch (error) {
    results.failed++;
    console.log(`❌ ERROR: ${name} - ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test suite
async function runTests() {
  console.log("=== DSTS API Test Suite ===");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log("");

  // Test 1: Stories API
  await testEndpoint("Stories API", "/api/stories", 200);

  // Test 2: Verify API (expect 500 since no user exists)
  await testEndpoint("Verify API", "/api/verify/1", 500);

  // Test 3: Sponsors API
  await testEndpoint("Sponsors API", "/api/sponsors", 200);

  // Test 4: Map API
  await testEndpoint("Map API", "/api/map", 200);

  // Test 5: Contents API
  await testEndpoint("Contents API", "/api/contents", 200);

  // Test 6: Child Safety Page (HTML, not JSON)
  await testEndpoint("Child Safety Page", "/child-safety", 200, false);

  // Test 7: App Home Route (HTML, not JSON)
  await testEndpoint("App Home Route", "/app/home", 200, false);

  // Test 8: Mentor Onboarding Page (HTML, not JSON)
  await testEndpoint("Mentor Onboarding Page", "/apply/mentor-onboarding", 200, false);

  // Test 9: Child Safety Governance Page (HTML, not JSON)
  await testEndpoint("Child Safety Governance Page", "/child-safety-governance", 200, false);

  // Test 10: Club Membership Flow Page (HTML, not JSON)
  await testEndpoint("Club Membership Flow Page", "/club/membership-flow", 200, false);

  // Test 11: Chapter Operations Page (HTML, not JSON)
  await testEndpoint("Chapter Operations Page", "/chapter-operations", 200, false);

  // Test 12: Trust Layer Page (HTML, not JSON)
  await testEndpoint("Trust Layer Page", "/trust-layer", 200, false);

  // Test 13: NguoiViet Integration Page (HTML, not JSON)
  await testEndpoint("NguoiViet Integration Page", "/nguoiviet-integration", 200, false);

  // Test 14: Health Check API
  await testEndpoint("Health Check API", "/api/monitoring/health", 200);

  // Test 15: Backup API (GET) (returns 401 when no auth provided)
  await testEndpoint("Backup API (GET)", "/api/admin/backup", 401);

  // Test 16: Trust.iai.ONE Verify API (returns 400 when no id provided)
  await testEndpoint("Trust.iai.ONE Verify API", "/api/trust-iai/verify", 400);

  // Test 17: NguoiViet Auth API (returns 500 when not configured)
  await testEndpoint("NguoiViet Auth API", "/api/nguoiviet/auth", 500);

  // Print results
  console.log("");
  console.log("=== Test Results ===");
  console.log(`Total: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log(`Completed at: ${new Date().toISOString()}`);

  return results;
}

// Run tests if executed directly
if (typeof window === 'undefined') {
  runTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, testEndpoint };
}
