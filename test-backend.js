const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('🧪 Testing backend API...');
    
    const testOrder = {
      order_id: `ORDER_TEST_${Date.now()}`,
      order_amount: 9999,
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_TEST_${Date.now()}`,
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        customer_phone: '9999999999'
      },
      order_meta: {
        test: 'true'
      }
    };

    console.log('📝 Sending test order:', JSON.stringify(testOrder, null, 2));

    const response = await fetch('http://localhost:3001/api/create-cashfree-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Backend Error:', {
        status: response.status,
        statusText: response.statusText,
        result: result
      });
    } else {
      console.log('✅ Backend Success:', result);
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testBackend();
