import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Shield, ArrowLeft, CheckCircle } from 'lucide-react';

const PaymentGatewaySimulation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Extract URL parameters
  const orderId = searchParams.get('order_id') || '';
  const orderAmount = searchParams.get('order_amount') || '0';
  const returnUrl = searchParams.get('return_url') || '/subscription-success';
  const mode = searchParams.get('mode') || 'sandbox';

  useEffect(() => {
    // Auto-fill test card details for demo
    setCardNumber('4111 1111 1111 1111');
    setExpiryDate('12/25');
    setCvv('123');
    setCardholderName('Test User');
  }, []);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate successful payment and redirect back
    const successUrl = `${returnUrl}?payment_status=success&order_id=${orderId}&payment_id=pay_${Date.now()}`;
    window.location.href = successUrl;
  };

  const handleCancel = () => {
    const cancelUrl = `${returnUrl}?payment_status=cancelled&order_id=${orderId}`;
    window.location.href = cancelUrl;
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(parseInt(amount) / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Cashfree Payments</h1>
          </div>
          <p className="text-sm text-gray-600">Secure Payment Gateway - {mode.toUpperCase()} Mode</p>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg">{formatAmount(orderAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Merchant:</span>
              <span>Acadira Education Platform</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'card' && (
              <>
                {/* Card Number */}
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label>Cardholder Name</Label>
                  <Input
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </>
            )}

            {paymentMethod !== 'card' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800">
                  {paymentMethod === 'netbanking' && 'Select your bank to proceed with Net Banking'}
                  {paymentMethod === 'upi' && 'Enter your UPI ID or scan QR code'}
                  {paymentMethod === 'wallet' && 'Choose your preferred wallet'}
                </p>
              </div>
            )}

            {/* Test Card Info */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-800">Test Card Details (Pre-filled)</p>
                  <p className="text-green-700">Card: 4111 1111 1111 1111 (Success)</p>
                  <p className="text-green-700">Use any future expiry date and CVV</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <AnimatedButton
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
                disabled={processing}
                animationType="pulse"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </AnimatedButton>
              
              <AnimatedButton
                onClick={handlePayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={processing}
                animationType="glow"
              >
                {processing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay ${formatAmount(orderAmount)}`
                )}
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>Powered by Cashfree Payments • Sandbox Environment</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewaySimulation;
