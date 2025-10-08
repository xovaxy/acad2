const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'], // Allow your frontend
  credentials: true
}));
app.use(express.json());

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com'; // Change to https://api.cashfree.com for production

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend server is running', timestamp: new Date().toISOString() });
});

// Create Cashfree order
app.post('/api/create-cashfree-order', async (req, res) => {
  try {
    console.log('📝 Received order request:', JSON.stringify(req.body, null, 2));

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return res.status(500).json({
        error: 'Cashfree credentials not configured in backend environment'
      });
    }

    // Validate required fields
    if (!req.body.order_id || !req.body.order_amount || !req.body.customer_details) {
      return res.status(400).json({
        error: 'Missing required fields: order_id, order_amount, customer_details'
      });
    }

    // Format and validate phone number
    let customerPhone = req.body.customer_details.customer_phone.toString().replace(/\D/g, ''); // Remove non-digits
    
    // If phone number is too short, use a default valid Indian number for testing
    if (customerPhone.length < 10) {
      console.log(`⚠️ Phone number too short (${customerPhone}), using default test number`);
      customerPhone = '9999999999'; // Valid 10-digit Indian number
    }
    
    // Ensure Indian phone numbers start with country code
    if (customerPhone.length === 10 && !customerPhone.startsWith('+91')) {
      customerPhone = '+91' + customerPhone;
    } else if (customerPhone.length === 10) {
      customerPhone = '+91' + customerPhone;
    }

    // Validate and format the order data for Cashfree API
    const orderData = {
      order_id: req.body.order_id,
      order_amount: parseFloat(req.body.order_amount), // Ensure it's a number
      order_currency: req.body.order_currency || 'INR',
      customer_details: {
        customer_id: req.body.customer_details.customer_id,
        customer_name: req.body.customer_details.customer_name,
        customer_email: req.body.customer_details.customer_email,
        customer_phone: customerPhone // Use formatted phone number
      },
      order_meta: req.body.order_meta || {},
      order_note: `Acadira subscription for ${req.body.customer_details.customer_name}`
    };

    // Additional validation
    if (orderData.order_amount <= 0) {
      return res.status(400).json({
        error: 'Order amount must be greater than 0'
      });
    }

    if (!orderData.customer_details.customer_email.includes('@')) {
      return res.status(400).json({
        error: 'Invalid customer email format'
      });
    }

    // Validate phone number format
    if (!orderData.customer_details.customer_phone.match(/^\+91[6-9]\d{9}$/)) {
      console.log(`⚠️ Phone format validation failed for: ${orderData.customer_details.customer_phone}`);
      // Use a default valid number for testing
      orderData.customer_details.customer_phone = '+919999999999';
    }

    console.log('🚀 Sending to Cashfree API:', JSON.stringify(orderData, null, 2));

    const response = await fetch(`${CASHFREE_BASE_URL}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Cashfree API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      return res.status(response.status).json({
        error: 'Cashfree API Error',
        details: data,
        sentData: orderData
      });
    }

    console.log('✅ Cashfree order created successfully:', data);
    res.json(data);

  } catch (error) {
    console.error('❌ Backend error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Verify payment
app.get('/api/verify-payment/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log('Verifying payment for order:', orderId);

    const response = await fetch(`${CASHFREE_BASE_URL}/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Payment verification error:', data);
      return res.status(response.status).json({
        error: 'Payment verification failed',
        details: data
      });
    }

    console.log('✅ Payment verification result:', data);
    res.json(data);

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create institution account (Real implementation with Supabase)
app.post('/api/create-institution-account', async (req, res) => {
  try {
    console.log('🏢 Creating real institution account:', JSON.stringify(req.body, null, 2));
    
    const { institution, admin, subscription } = req.body;
    
    // Validate required data (subscription is optional for account creation)
    if (!institution || !admin) {
      return res.status(400).json({
        error: 'Missing required data: institution, admin'
      });
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    
    // Start a transaction-like process
    let institutionId, adminId;
    
    try {
      // 1. Create Institution record
      console.log('📝 Creating institution record...');
      const { data: institutionData, error: institutionError } = await supabase
        .from('institutions')
        .insert([{
          name: institution.name,
          type: institution.type,
          address: institution.address,
          city: institution.city,
          state: institution.state,
          pincode: institution.pincode,
          phone: institution.phone,
          website: institution.website,
          student_count: institution.studentCount,
          subscription_plan: subscription?.plan_id || 'starter',
          subscription_amount: subscription?.amount || 9999,
          payment_order_id: null, // No payment order initially - will be set during payment
          subscription_status: 'inactive', // Set as inactive initially, will be activated after payment
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (institutionError) {
        console.error('❌ Institution creation error:', institutionError);
        
        // Provide specific error message for RLS violations
        if (institutionError.message.includes('row-level security policy')) {
          throw new Error(`Database security policy error. Please run the RLS fix script in your database. Details: ${institutionError.message}`);
        }
        
        throw new Error(`Failed to create institution: ${institutionError.message}`);
      }

      institutionId = institutionData.id;
      console.log('✅ Institution created with ID:', institutionId);

      // 2. Create Admin user record in profiles table
      console.log('👤 Creating admin user record in profiles...');
      
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true
      });

      if (authError) {
        console.error('❌ Auth user creation error:', authError);
        // Rollback: Delete the institution if auth creation fails
        await supabase.from('institutions').delete().eq('id', institutionId);
        throw new Error(`Failed to create auth user: ${authError.message}`);
      }

      const userId = authData.user.id;
      console.log('✅ Auth user created with ID:', userId);

      // Then, update the automatically created profile with admin role and institution link
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId, // Primary key (links to auth user)
          user_id: userId, // Required field in your profiles table
          email: admin.email,
          first_name: admin.firstName,
          last_name: admin.lastName,
          full_name: `${admin.firstName} ${admin.lastName}`,
          phone: admin.phone,
          designation: admin.designation,
          role: 'admin', // Set as admin role
          institution_id: institutionId, // Link to institution
          status: 'active',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select()
        .single();

      if (profileError) {
        console.error('❌ Profile update error:', profileError);
        // Rollback: Delete auth user and institution
        await supabase.auth.admin.deleteUser(userId);
        await supabase.from('institutions').delete().eq('id', institutionId);
        throw new Error(`Failed to update user profile: ${profileError.message}`);
      }

      adminId = userId;
      console.log('✅ Admin profile updated with ID:', adminId);

      // 3. Create subscription record
      console.log('💳 Creating subscription record...');
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([{
          institution_id: institutionId,
          plan_id: subscription.plan_id,
          amount: subscription.amount,
          currency: 'INR',
          order_id: subscription.order_id,
          payment_details: subscription.payment_details,
          status: 'active',
          start_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (subscriptionError) {
        console.error('❌ Subscription creation error:', subscriptionError);
        // Rollback: Delete auth user and institution
        await supabase.auth.admin.deleteUser(adminId);
        await supabase.from('institutions').delete().eq('id', institutionId);
        throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
      }

      console.log('✅ Subscription created:', subscriptionData.id);

      // 4. Send welcome email (optional - can be implemented later)
      console.log('📧 Welcome email would be sent to:', admin.email);

      // Return success response
      const response = {
        success: true,
        account_id: `acc_${institutionId}`,
        institution_id: institutionId,
        admin_id: adminId,
        subscription_id: subscriptionData.id,
        message: 'Institution account created successfully',
        login_details: {
          email: admin.email,
          login_url: `${req.headers.origin}/login`,
          institution_name: institution.name
        }
      };

      console.log('🎉 Account creation completed successfully:', response);
      res.json(response);

    } catch (dbError) {
      console.error('❌ Database transaction error:', dbError);
      throw dbError;
    }

  } catch (error) {
    console.error('❌ Account creation failed:', error);
    res.status(500).json({
      error: 'Account creation failed',
      message: error.message,
      details: error.details || 'Please try again or contact support'
    });
  }
});

// Activate subscription after payment completion
app.post('/api/activate-subscription', async (req, res) => {
  try {
    const { order_id } = req.body;
    
    if (!order_id) {
      return res.status(400).json({
        error: 'Missing required field: order_id'
      });
    }

    console.log('🔄 Activating subscription for order:', order_id);

    // Update subscription status in institutions table
    const { data, error } = await supabase
      .from('institutions')
      .update({ 
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('payment_order_id', order_id)
      .select();

    if (error) {
      console.error('❌ Subscription activation error:', error);
      return res.status(500).json({
        error: 'Failed to activate subscription',
        details: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'No institution found with the provided order ID'
      });
    }

    console.log('✅ Subscription activated for institution:', data[0].name);
    
    res.json({
      success: true,
      message: 'Subscription activated successfully',
      institution: {
        id: data[0].id,
        name: data[0].name,
        subscription_status: data[0].subscription_status
      }
    });

  } catch (error) {
    console.error('❌ Subscription activation failed:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update payment order ID for existing institution
app.post('/api/update-payment-order', async (req, res) => {
  try {
    const { institution_id, order_id } = req.body;
    
    if (!institution_id || !order_id) {
      return res.status(400).json({
        error: 'Missing required fields: institution_id, order_id'
      });
    }

    console.log('🔄 Updating payment order ID for institution:', institution_id);

    // Update payment_order_id in institutions table
    const { data, error } = await supabase
      .from('institutions')
      .update({ 
        payment_order_id: order_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', institution_id)
      .select();

    if (error) {
      console.error('❌ Payment order update error:', error);
      return res.status(500).json({
        error: 'Failed to update payment order ID',
        details: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'No institution found with the provided ID'
      });
    }

    console.log('✅ Payment order ID updated for institution:', data[0].name);
    
    res.json({
      success: true,
      message: 'Payment order ID updated successfully',
      institution: {
        id: data[0].id,
        name: data[0].name,
        payment_order_id: data[0].payment_order_id
      }
    });

  } catch (error) {
    console.error('❌ Payment order update failed:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Cashfree Backend Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Cashfree Environment: ${CASHFREE_BASE_URL}`);
  console.log(`🔑 App ID: ${CASHFREE_APP_ID ? `${CASHFREE_APP_ID.substring(0, 10)}...` : 'NOT SET'}`);
});

module.exports = app;
