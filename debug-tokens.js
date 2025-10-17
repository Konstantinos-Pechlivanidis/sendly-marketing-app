// Debug script to test both session ID and access token
const BASE_URL = "https://sendly-marketing-backend.onrender.com";
const SESSION_ID = "offline_sms-blossom-dev.myshopify.com";
const ACCESS_TOKEN = "shpua_87fa59cd1662ff4a01c0b573..."; // This is truncated
const SHOP_DOMAIN = "sms-blossom-dev.myshopify.com";

async function testWithToken(token, tokenType) {
  console.log(`\n🔍 Testing with ${tokenType}:`);
  console.log(`🔑 Token: ${token}`);
  
  try {
    const response = await fetch(`${BASE_URL}/dashboard/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Shopify-Shop-Domain': SHOP_DOMAIN
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ SUCCESS with ${tokenType}!`);
      console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(`❌ FAILED with ${tokenType}:`, text);
    }
  } catch (error) {
    console.error(`💥 ERROR with ${tokenType}:`, error.message);
  }
}

async function runTokenTests() {
  console.log('🚀 Testing Authentication Tokens...');
  console.log(`🏪 Shop Domain: ${SHOP_DOMAIN}`);
  
  // Test with Session ID (what we should use)
  await testWithToken(SESSION_ID, "Session ID");
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 If Session ID works, that\'s what we should use!');
  console.log('💡 If Session ID fails, we need to use Access Token');
  console.log('='.repeat(50));
}

runTokenTests();
