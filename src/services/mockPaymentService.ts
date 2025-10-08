// Mock Payment Service for Development
// This simulates the backend API endpoints until you set up your actual backend

interface MockOrderResponse {
  payment_session_id: string;
  order_id: string;
  status: string;
}

interface MockPaymentVerification {
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  order_id: string;
  payment_id?: string;
}

class MockPaymentService {
  private orders: Map<string, any> = new Map();

  async createCashfreeOrder(orderData: any): Promise<MockOrderResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store order data
    this.orders.set(orderId, {
      ...orderData,
      status: 'CREATED',
      created_at: new Date().toISOString()
    });

    return {
      payment_session_id: paymentSessionId,
      order_id: orderId,
      status: 'CREATED'
    };
  }

  async verifyPayment(orderId: string): Promise<MockPaymentVerification> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const order = this.orders.get(orderId);
    if (!order) {
      return {
        status: 'FAILED',
        order_id: orderId
      };
    }

    // Simulate successful payment (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;

    const result: MockPaymentVerification = {
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      order_id: orderId,
      payment_id: isSuccess ? `pay_${Date.now()}` : undefined
    };

    // Update order status
    this.orders.set(orderId, {
      ...order,
      status: result.status,
      payment_id: result.payment_id,
      updated_at: new Date().toISOString()
    });

    return result;
  }

  async createInstitutionAccount(accountData: any): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate account creation (95% success rate)
    const isSuccess = Math.random() > 0.05;

    if (!isSuccess) {
      throw new Error('Account creation failed. Please try again.');
    }

    return {
      success: true,
      institution_id: `inst_${Date.now()}`,
      admin_id: `admin_${Date.now()}`,
      message: 'Account created successfully'
    };
  }

  // Mock Cashfree checkout simulation
  simulateCashfreeCheckout(paymentSessionId: string): Promise<{ redirect: boolean; error?: any }> {
    return new Promise((resolve) => {
      // Simulate user interaction with payment gateway
      setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success rate
        
        if (isSuccess) {
          resolve({ redirect: true });
        } else {
          resolve({ 
            error: { 
              message: 'Payment failed. Please try again.',
              code: 'PAYMENT_FAILED'
            }
          });
        }
      }, 2000); // Simulate 2 second payment process
    });
  }
}

export const mockPaymentService = new MockPaymentService();
