import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { CheckCircle, Mail, Building, CreditCard, Loader2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import anime from '@/lib/anime-wrapper';
import { subscriptionService } from '@/services/subscriptionService';

const SubscriptionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activatingSubscription, setActivatingSubscription] = useState(false);
  const [subscriptionActivated, setSubscriptionActivated] = useState(false);
  
  // Get data from either location state (direct navigation) or URL params (payment gateway return)
  const paymentStatus = searchParams.get('payment_status');
  const paymentOrderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  
  const { 
    institutionName, 
    planName, 
    adminEmail, 
    institutionId,
    adminId,
    subscriptionId,
    accountCreated,
    message,
    nextStep,
    accountId,
    orderId
  } = location.state || {
    institutionName: paymentOrderId ? 'Your Institution' : 'Demo Institution',
    planName: 'Starter Plan',
    adminEmail: 'admin@demo.com'
  };

  useEffect(() => {
    const activateSubscription = async () => {
      // If we have an institution ID and optionally an order ID, activate the subscription
      const orderId = paymentOrderId || location.state?.orderId;
      const instId = institutionId || location.state?.institutionId;
      
      if (instId) {
        try {
          setActivatingSubscription(true);
          console.log(`🔄 Activating subscription for institution: ${instId}, order: ${orderId || 'N/A'}`);
          await subscriptionService.activateSubscriptionAfterPayment(instId, orderId);
          console.log('✅ Subscription activated successfully');
          setSubscriptionActivated(true);
        } catch (error) {
          console.error('❌ Error activating subscription:', error);
          // Continue showing success page even if activation fails
          setSubscriptionActivated(true);
        } finally {
          setActivatingSubscription(false);
        }
      } else {
        // No institution ID found, just show success page
        console.log('ℹ️ No institution ID found, showing success page without activation');
        setSubscriptionActivated(true);
      }
    };

    activateSubscription();
  }, [paymentOrderId, location.state, institutionId]);

  useEffect(() => {
    // Only run animations after subscription activation is complete
    if (!subscriptionActivated) return;
    
    // Celebration animation
    const celebrationElements = document.querySelectorAll('.celebration-item');
    anime({
      targets: celebrationElements,
      scale: [0, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(200),
      easing: 'easeOutBack'
    });

    // Confetti effect
    setTimeout(() => {
      createConfetti();
    }, 800);
  }, [subscriptionActivated]);

  const createConfetti = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const container = document.querySelector('.confetti-container');
    
    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.borderRadius = '2px';
      
      container.appendChild(confetti);

      anime({
        targets: confetti,
        translateY: window.innerHeight + 100,
        translateX: () => anime.random(-100, 100),
        rotate: () => anime.random(0, 360),
        duration: () => anime.random(2000, 4000),
        easing: 'easeInQuad',
        complete: () => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }
      });
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { email: adminEmail } });
  };

  const handleDashboardRedirect = () => {
    navigate('/admin');
  };

  if (!institutionName) {
    // Redirect if no state data
    useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        <div className="confetti-container absolute inset-0 pointer-events-none" />
        
        <Header />
        
        <div className="container mx-auto px-4 py-12">
          {activatingSubscription && (
            <div className="max-w-2xl mx-auto text-center mb-8">
              <Card className="p-8">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-lg font-medium">Activating your subscription...</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  Please wait while we set up your account access.
                </p>
              </Card>
            </div>
          )}
          <div className="max-w-2xl mx-auto text-center space-y-8">
            
            {/* Success Icon */}
            <div className="celebration-item">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="celebration-item space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                {accountCreated ? '🎉 Account Created Successfully!' : '🎉 Subscription Successful!'}
              </h1>
              <p className="text-xl text-muted-foreground">
                {accountCreated 
                  ? 'Welcome to Acadira! Your account has been created. Login to complete your subscription setup.'
                  : 'Welcome to Acadira! Your institution is now ready to transform education with AI.'
                }
              </p>
              {message && (
                <p className="text-lg text-blue-600 font-medium">
                  {message}
                </p>
              )}
              {nextStep && (
                <p className="text-base text-muted-foreground">
                  <strong>Next Step:</strong> {nextStep}
                </p>
              )}
            </div>

            {/* Success Details Card */}
            <Card className="celebration-item">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Account Created Successfully</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Institution</p>
                    <p className="font-semibold">{institutionName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <p className="font-semibold">{planName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Admin Email</p>
                    <p className="font-semibold">{adminEmail}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="font-semibold text-green-600">Active</p>
                  </div>
                  {accountId && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                      <p className="font-mono text-sm">{accountId}</p>
                    </div>
                  )}
                  {orderId && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                      <p className="font-mono text-sm">{orderId}</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Check Your Email</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        We've sent login credentials and setup instructions to <strong>{adminEmail}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="celebration-item">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-start space-x-3 text-left">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Access Your Admin Dashboard</h4>
                      <p className="text-sm text-muted-foreground">
                        Login to your admin panel to configure your institution settings
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 text-left">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Upload Your Curriculum</h4>
                      <p className="text-sm text-muted-foreground">
                        Add your course materials to train the AI tutor for your students
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 text-left">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Add Students</h4>
                      <p className="text-sm text-muted-foreground">
                        Invite your students to start learning with their AI tutor
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="celebration-item flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                onClick={() => navigate('/login')}
                animationType="glow"
                className="px-8"
              >
                {accountCreated ? 'Login to Your Account' : 'Access Admin Panel'}
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => navigate('/')}
                variant="outline"
                animationType="pulse"
                className="px-8"
              >
                Back to Home
              </AnimatedButton>
            </div>

            {/* Support Information */}
            <Card className="celebration-item bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Need Help Getting Started?</h3>
                <p className="text-purple-700 text-sm mb-4">
                  Our team is here to help you set up and make the most of Acadira.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 text-sm">
                  <span className="text-purple-600">📧 support@acadira.com</span>
                  <span className="text-purple-600">📞 +91-XXXX-XXXXXX</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default SubscriptionSuccess;
