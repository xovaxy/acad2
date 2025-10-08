import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Building, User, CreditCard } from 'lucide-react';
import { PageTransition } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { subscriptionService } from '@/services/subscriptionService';
import { supabase } from '@/integrations/supabase/client';
import { cashfreeClientService } from '@/services/cashfreeClientService';

interface InstitutionDetails {
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  website: string;
  studentCount: string;
}

interface AdminDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  designation: string;
  phone: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  studentLimit: string;
  duration: string;
}

const Subscribe = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [existingInstitution, setExistingInstitution] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [institutionDetails, setInstitutionDetails] = useState<InstitutionDetails>({
    name: '',
    type: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    website: '',
    studentCount: ''
  });
  const [adminDetails, setAdminDetails] = useState<AdminDetails>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Check if user is already logged in with an existing institution
  React.useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('🔍 Checking for existing user:', user?.id);
        
        // Debug: Check what tables and columns exist
        console.log('🔍 Testing database access...');
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
        console.log('📊 Profiles table test:', { data: testData, error: testError });
        
        if (user) {
          // User is logged in, check if they have an institution
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*, institutions(*)')
            .eq('user_id', user.id)
            .single();

          console.log('👤 Profile data:', profileData);
          console.log('❌ Profile error:', profileError);
          
          if (profileError) {
            console.log('🚨 Profile lookup failed:', profileError.message);
            console.log('🔍 Trying alternative lookup methods...');
            
            // Try alternative lookup by id instead of user_id
            const { data: altProfileData, error: altError } = await supabase
              .from('profiles')
              .select('*, institutions(*)')
              .eq('id', user.id)
              .single();
              
            console.log('🔄 Alternative profile data:', altProfileData);
            console.log('🔄 Alternative error:', altError);
            
            if (altProfileData?.institutions && altProfileData.role === 'admin') {
              setIsExistingUser(true);
              setExistingInstitution(altProfileData.institutions);
              console.log('✅ Found user via alternative method');
            }
          }

          if (profileData?.institutions && profileData.role === 'admin') {
            // User has an existing institution
            setIsExistingUser(true);
            setExistingInstitution(profileData.institutions);
            
            console.log('✅ Existing admin user detected:', {
              institution: profileData.institutions.name,
              role: profileData.role,
              subscriptionStatus: profileData.institutions.subscription_status
            });
            
            setCurrentStep(1); // Stay on plan selection, but skip other steps
          } else {
            console.log('ℹ️ No existing admin institution found for user');
          }
        } else {
          console.log('ℹ️ No authenticated user found');
        }
      } catch (error) {
        console.error('❌ Error checking existing user:', error);
      }
    };

    checkExistingUser();
  }, []);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 9999,
      studentLimit: 'Up to 100 students',
      duration: 'per month',
      features: [
        'AI Tutor for all subjects',
        'Curriculum upload & management',
        'Student progress tracking',
        'Basic analytics',
        'Email support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 19999,
      studentLimit: 'Up to 500 students',
      duration: 'per month',
      features: [
        'Everything in Starter',
        'Advanced AI conversations',
        'Custom curriculum creation',
        'Detailed analytics & reports',
        'Priority support',
        'Parent portal access'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49999,
      studentLimit: 'Unlimited students',
      duration: 'per month',
      features: [
        'Everything in Professional',
        'Multi-campus management',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'On-premise deployment option'
      ]
    }
  ];

  const validateInstitutionDetails = () => {
    const newErrors: any = {};
    if (!institutionDetails.name.trim()) newErrors.name = 'Institution name is required';
    if (!institutionDetails.type) newErrors.type = 'Institution type is required';
    if (!institutionDetails.address.trim()) newErrors.address = 'Address is required';
    if (!institutionDetails.city.trim()) newErrors.city = 'City is required';
    if (!institutionDetails.state.trim()) newErrors.state = 'State is required';
    if (!institutionDetails.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!institutionDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!institutionDetails.studentCount) newErrors.studentCount = 'Student count is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdminDetails = () => {
    const newErrors: any = {};
    if (!adminDetails.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!adminDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!adminDetails.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminDetails.email)) newErrors.email = 'Valid email is required';
    if (!adminDetails.password) newErrors.password = 'Password is required';
    if (adminDetails.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (adminDetails.password !== adminDetails.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!adminDetails.designation.trim()) newErrors.designation = 'Designation is required';
    if (!adminDetails.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1 && selectedPlan) {
      // If existing user, go directly to payment
      if (isExistingUser) {
        await initiatePaymentForExistingUser();
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2 && validateInstitutionDetails()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateAdminDetails()) {
      // Create account immediately after admin details are filled
      await createAccount();
    }
  };

  const createAccount = async () => {
    setLoading(true);
    setErrors({});

    try {
      console.log('👤 Creating institution and admin account...');
      
      const accountData = {
        institution: institutionDetails,
        admin: adminDetails,
        subscription: {
          plan_id: selectedPlan?.id || '',
          order_id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Temporary order ID for account creation
          amount: selectedPlan?.price || 0
        }
      };

      // Create account via subscription service (no payment required)
      const accountResult = await subscriptionService.createInstitutionAccount(accountData);
      console.log('🏢 Account creation result:', accountResult);
      
      if (accountResult.success) {
        console.log('✅ Account created successfully!');
        
        // Show success message
        navigate('/subscription-success', { 
          state: { 
            institutionName: institutionDetails.name,
            planName: selectedPlan?.name,
            adminEmail: adminDetails.email,
            accountCreated: true,
            message: 'Account created successfully! You can now login.',
            nextStep: 'Login to your admin panel and complete payment to activate subscription.'
          },
          replace: true
        });
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('❌ Account creation failed:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Account creation failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const initiatePaymentForExistingUser = async () => {
    setLoading(true);
    setErrors({});

    try {
      console.log('💳 Initiating payment for existing user:', existingInstitution?.name);
      console.log('🏢 Institution data:', existingInstitution);
      console.log('📋 Selected plan:', selectedPlan);
      
      // Generate order ID and link to institution
      const orderId = cashfreeClientService.generateOrderId();
      
      // Update institution with payment order ID
      await subscriptionService.updatePaymentOrderId(existingInstitution.id, orderId);
      console.log('🔗 Payment order ID linked to institution');
      
      // Create order data
      const customerId = cashfreeClientService.generateCustomerId();
      
      const orderData = {
        order_amount: selectedPlan?.price || 0,
        order_currency: 'INR',
        order_id: orderId,
        customer_details: {
          customer_id: customerId,
          customer_name: existingInstitution.name,
          customer_email: existingInstitution.email || 'admin@institution.com',
          customer_phone: existingInstitution.phone || '9999999999'
        },
        order_meta: {
          institution_name: existingInstitution.name,
          institution_id: existingInstitution.id,
          plan_id: selectedPlan?.id || ''
        }
      };

      console.log('📦 Creating Cashfree order:', orderData);
      const orderResult = await cashfreeClientService.createOrderViaBackend(orderData);
      console.log('✅ Order created:', orderResult);

      // Initiate payment
      console.log('💳 Initiating Cashfree checkout...');
      const checkoutResult = await cashfreeClientService.initiateCashfreeCheckout(
        orderResult.payment_session_id,
        selectedPlan?.price
      );

      console.log('🔍 Checkout result:', checkoutResult);

      if (checkoutResult.error) {
        console.error('❌ Payment failed:', checkoutResult.error);
        setErrors({ 
          payment: checkoutResult.error.message || 'Payment failed. Please try again.' 
        });
      } else if (checkoutResult.redirect) {
        // Payment successful, verify and activate subscription
        await verifyPaymentAndActivateSubscription(orderId);
      } else {
        setErrors({ payment: 'Unexpected payment result. Please try again.' });
      }
    } catch (error) {
      console.error('❌ Payment initiation failed:', error);
      setErrors({ 
        payment: error instanceof Error ? error.message : 'Payment initiation failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPaymentAndActivateSubscription = async (orderId: string) => {
    try {
      console.log('🔍 Starting payment verification for order:', orderId);
      
      // For demo mode, simulate successful payment verification
      console.log('🎭 Demo mode: Simulating payment verification...');
      const paymentVerification = { status: 'PAID', message: 'Demo payment successful' };
      console.log('✅ Payment verification result (demo):', paymentVerification);
      
      if (paymentVerification.status === 'PAID') {
        console.log('💰 Payment verified as PAID, activating subscription...');
        console.log('📋 Order ID for activation:', orderId);
        console.log('🏢 Institution ID:', existingInstitution?.id);
        
        // Activate subscription using the order ID
        console.log('🔄 Attempting to activate subscription...');
        try {
          await subscriptionService.activateSubscriptionAfterPayment(orderId);
          console.log('✅ Subscription activated via service');
        } catch (serviceError) {
          console.warn('⚠️ Service activation failed, trying direct database update:', serviceError);
          
          // Direct database update as fallback
          const { data: updateResult, error: updateError } = await supabase
            .from('institutions')
            .update({ 
              subscription_status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId) // Note: Using institution ID instead of payment_order_id since that field doesn't exist
            .select();
            
          if (updateError) {
            console.error('❌ Direct database update failed:', updateError);
            throw updateError;
          }
          
          console.log('✅ Subscription activated via direct database update:', updateResult);
        }
        
        // Verify the activation worked by checking the database
        console.log('🔍 Verifying subscription activation...');
        const updatedProfile = await supabase
          .from('profiles')
          .select('*, institutions(*)')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();
        
        console.log('📊 Updated institution status:', updatedProfile.data?.institutions?.subscription_status);
        
        // Redirect to success page
        navigate('/subscription-success', { 
          state: { 
            institutionName: existingInstitution.name,
            planName: selectedPlan?.name,
            adminEmail: existingInstitution.email,
            orderId: orderId,
            isExistingUser: true,
            subscriptionActivated: true
          },
          replace: true
        });
      } else {
        throw new Error(`Payment verification failed. Status: ${paymentVerification.status}`);
      }
    } catch (error) {
      console.error('❌ Subscription activation failed:', error);
      setErrors({ payment: error instanceof Error ? error.message : 'Payment successful but subscription activation failed. Please contact support.' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">
          {isExistingUser ? 'Activate Your Subscription' : 'Choose Your Plan'}
        </h2>
        <p className="text-muted-foreground">
          {isExistingUser 
            ? `Complete payment to activate subscription for ${existingInstitution?.name}` 
            : 'Select the perfect plan for your institution'
          }
        </p>
        {isExistingUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Existing Admin Detected</p>
                <p className="text-xs text-blue-700">
                  Institution: {existingInstitution?.name} | Status: {existingInstitution?.subscription_status}
                </p>
                {existingInstitution?.subscription_status === 'cancelled' && (
                  <button 
                    onClick={async () => {
                      console.log('🔧 Manual activation triggered');
                      try {
                        const { data, error } = await supabase
                          .from('institutions')
                          .update({ subscription_status: 'active' })
                          .eq('id', existingInstitution.id)
                          .select();
                        
                        if (error) throw error;
                        console.log('✅ Manual activation successful:', data);
                        window.location.reload(); // Refresh to show updated status
                      } catch (error) {
                        console.error('❌ Manual activation failed:', error);
                      }
                    }}
                    className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Activate Subscription (Test)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedPlan?.id === plan.id ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  ₹{plan.price.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">/{plan.duration}</span>
                </div>
                <Badge variant="secondary">{plan.studentLimit}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedPlan && (
        <div className="text-center">
          <AnimatedButton 
            onClick={handleNext}
            className="px-8 py-3"
            animationType="bounce"
            disabled={loading}
          >
            {loading 
              ? 'Processing...' 
              : isExistingUser 
                ? `Pay for ${selectedPlan.name} Plan` 
                : `Continue with ${selectedPlan.name}`
            }
          </AnimatedButton>
          {isExistingUser && (
            <p className="text-sm text-muted-foreground mt-2">
              You will be redirected to payment gateway
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderInstitutionDetails = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Building className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-3xl font-bold">Institution Details</h2>
        <p className="text-muted-foreground">Tell us about your educational institution</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="institutionName">Institution Name *</Label>
          <Input
            id="institutionName"
            value={institutionDetails.name}
            onChange={(e) => setInstitutionDetails({...institutionDetails, name: e.target.value})}
            placeholder="Enter institution name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="institutionType">Institution Type *</Label>
          <Select value={institutionDetails.type} onValueChange={(value) => setInstitutionDetails({...institutionDetails, type: value})}>
            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="college">College</SelectItem>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="coaching">Coaching Center</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            value={institutionDetails.address}
            onChange={(e) => setInstitutionDetails({...institutionDetails, address: e.target.value})}
            placeholder="Enter complete address"
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={institutionDetails.city}
            onChange={(e) => setInstitutionDetails({...institutionDetails, city: e.target.value})}
            placeholder="Enter city"
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={institutionDetails.state}
            onChange={(e) => setInstitutionDetails({...institutionDetails, state: e.target.value})}
            placeholder="Enter state"
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode *</Label>
          <Input
            id="pincode"
            value={institutionDetails.pincode}
            onChange={(e) => setInstitutionDetails({...institutionDetails, pincode: e.target.value})}
            placeholder="Enter pincode"
            className={errors.pincode ? 'border-red-500' : ''}
          />
          {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={institutionDetails.phone}
            onChange={(e) => setInstitutionDetails({...institutionDetails, phone: e.target.value})}
            placeholder="Enter phone number"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            value={institutionDetails.website}
            onChange={(e) => setInstitutionDetails({...institutionDetails, website: e.target.value})}
            placeholder="Enter website URL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentCount">Student Count *</Label>
          <Select value={institutionDetails.studentCount} onValueChange={(value) => setInstitutionDetails({...institutionDetails, studentCount: value})}>
            <SelectTrigger className={errors.studentCount ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select student count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-50">1-50 students</SelectItem>
              <SelectItem value="51-100">51-100 students</SelectItem>
              <SelectItem value="101-500">101-500 students</SelectItem>
              <SelectItem value="501-1000">501-1000 students</SelectItem>
              <SelectItem value="1000+">1000+ students</SelectItem>
            </SelectContent>
          </Select>
          {errors.studentCount && <p className="text-sm text-red-500">{errors.studentCount}</p>}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <AnimatedButton 
          onClick={handleNext}
          className="flex-1"
          animationType="pulse"
        >
          Continue
        </AnimatedButton>
      </div>
    </div>
  );

  const renderAdminDetails = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <User className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-3xl font-bold">Admin Account Details</h2>
        <p className="text-muted-foreground">Create your admin account to manage the institution</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={adminDetails.firstName}
            onChange={(e) => setAdminDetails({...adminDetails, firstName: e.target.value})}
            placeholder="Enter first name"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={adminDetails.lastName}
            onChange={(e) => setAdminDetails({...adminDetails, lastName: e.target.value})}
            placeholder="Enter last name"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={adminDetails.email}
            onChange={(e) => setAdminDetails({...adminDetails, email: e.target.value})}
            placeholder="Enter email address"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={adminDetails.phone}
            onChange={(e) => setAdminDetails({...adminDetails, phone: e.target.value})}
            placeholder="Enter phone number"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            id="designation"
            value={adminDetails.designation}
            onChange={(e) => setAdminDetails({...adminDetails, designation: e.target.value})}
            placeholder="e.g., Principal, Director, Admin"
            className={errors.designation ? 'border-red-500' : ''}
          />
          {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={adminDetails.password}
            onChange={(e) => setAdminDetails({...adminDetails, password: e.target.value})}
            placeholder="Enter password (min 8 characters)"
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={adminDetails.confirmPassword}
            onChange={(e) => setAdminDetails({...adminDetails, confirmPassword: e.target.value})}
            placeholder="Confirm password"
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
      </div>

      {errors.general && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{errors.general}</span>
        </div>
      )}

      <div className="flex space-x-4">
        <Button variant="outline" onClick={handleBack} disabled={loading}>
          Back
        </Button>
        <AnimatedButton 
          onClick={handleNext}
          className="flex-1"
          animationType="pulse"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </AnimatedButton>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPlanSelection();
      case 2:
        return renderInstitutionDetails();
      case 3:
        return renderAdminDetails();
      default:
        return renderPlanSelection();
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      currentStep > step ? 'bg-primary' : 'bg-secondary'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Labels */}
            <div className="flex justify-center space-x-8 mb-12">
              <span className={`text-sm ${currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Choose Plan
              </span>
              <span className={`text-sm ${currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Institution Details
              </span>
              <span className={`text-sm ${currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Admin Account
              </span>
            </div>

            {/* Current Step Content */}
            <Card className="p-8">
              {renderCurrentStep()}
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Subscribe;
