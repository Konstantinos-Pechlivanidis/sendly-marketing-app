// Test script to verify backend accepts access token
const BASE_URL = "https://sendly-marketing-backend.onrender.com";
const SHOP_DOMAIN = "sms-blossom-dev.myshopify.com";

// You'll need to get the full access token from the debug panel
// It should be something like: shpua_87fa59cd1662ff4a01c0b573...
const ACCESS_TOKEN = "YOUR_FULL_ACCESS_TOKEN_HERE"; // Replace with actual token

async function testAccessToken() {
  console.log('🚀 Testing Access Token Authentication...');
  console.log(`🏪 Shop Domain: ${SHOP_DOMAIN}`);
  console.log(`🔑 Access Token: ${ACCESS_TOKEN.substring(0, 30)}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/dashboard/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'X-Shopify-Shop-Domain': SHOP_DOMAIN
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ SUCCESS! Access Token works!`);
      console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(`❌ FAILED:`, text);
    }
  } catch (error) {
    console.error(`💥 ERROR:`, error.message);
  }
}

if (ACCESS_TOKEN === "YOUR_FULL_ACCESS_TOKEN_HERE") {
  console.log('❌ Please replace ACCESS_TOKEN with your actual token from the debug panel');
  console.log('💡 Copy the full access token from the Dashboard debug panel');
} else {
  testAccessToken();
}
