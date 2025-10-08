// Using built-in fetch (Node.js 18+)

async function testAccountCreation() {
  try {
    console.log('🧪 Testing account creation API...');
    
    const testAccountData = {
      institution: {
        name: 'Test School',
        type: 'school',
        address: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '9999999999',
        website: 'https://testschool.edu',
        studentCount: '101-500'
      },
      admin: {
        firstName: 'Test',
        lastName: 'Admin',
        email: 'test@testschool.edu',
        phone: '9999999999',
        designation: 'Principal',
        password: 'TestPassword123'
      },
      subscription: {
        plan_id: 'starter',
        amount: 9999,
        order_id: `ORDER_TEST_${Date.now()}`,
        payment_details: {
          payment_id: 'test_payment_123',
          payment_method: 'card'
        }
      }
    };

    console.log('📝 Sending test account data...');

    const response = await fetch('http://localhost:3001/api/create-institution-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testAccountData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Account creation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: result
      });
    } else {
      console.log('✅ Account creation successful:', result);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAccountCreation();
