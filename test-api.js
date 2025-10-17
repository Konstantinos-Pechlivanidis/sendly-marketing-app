// Test script to verify backend API connectivity
const BASE_URL = "https://sendly-marketing-backend.onrender.com";
const SESSION_TOKEN = "offline_sms-blossom-dev.myshopify.com";
const SHOP_DOMAIN = "sms-blossom-dev.myshopify.com";

async function testEndpoint(endpoint, description) {
  console.log(`\n🔍 Testing: ${description}`);
  console.log(`📍 URL: ${BASE_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SESSION_TOKEN}`,
        'X-Shopify-Shop-Domain': SHOP_DOMAIN
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`✅ Response:`, JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(`📄 Response:`, text);
    }
  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log(`🔑 Session Token: ${SESSION_TOKEN}`);
  console.log(`🏪 Shop Domain: ${SHOP_DOMAIN}`);
  
  await testEndpoint('/health', 'Health Check (no auth needed)');
  await testEndpoint('/dashboard/overview', 'Dashboard Overview');
  await testEndpoint('/dashboard/quick-stats', 'Dashboard Quick Stats');
  await testEndpoint('/campaigns', 'Campaigns List');
  await testEndpoint('/contacts', 'Contacts List');
  
  console.log('\n✨ Tests completed!');
}

runTests();

