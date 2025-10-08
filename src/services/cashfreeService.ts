// Cashfree Payment Gateway Integration Service

interface CashfreeConfig {
  appId: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
}

interface OrderData {
  order_amount: number;
  order_currency: string;
  order_id: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta?: {
    [key: string]: any;
  };
}

interface PaymentResponse {
  payment_session_id: string;
  order_id: string;
  order_status: string;
}

class CashfreeService {
  private config: CashfreeConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      appId: import.meta.env.VITE_CASHFREE_APP_ID || '',
      secretKey: import.meta.env.VITE_CASHFREE_SECRET_KEY || '',
      environment: (import.meta.env.VITE_CASHFREE_ENV as 'sandbox' | 'production') || 'sandbox'
    };
    
    this.baseUrl = this.config.environment === 'sandbox' 
      ? 'https://sandbox.cashfree.com/pg'
      : 'https://api.cashfree.com/pg';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': this.config.appId,
      'x-client-secret': this.config.secretKey
    };
  }

  async createOrder(orderData: OrderData): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cashfree API Error: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Cashfree order:', error);
      throw error;
    }
  }

  async getOrderStatus(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cashfree API Error: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw error;
    }
  }

  async getPaymentDetails(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/payments`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cashfree API Error: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  }

  generateOrderId(): string {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  generateCustomerId(): string {
    return `CUST_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

export const cashfreeService = new CashfreeService();
export type { OrderData, PaymentResponse };
