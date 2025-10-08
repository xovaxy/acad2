// Cashfree SDK Type Definitions

declare global {
  interface Window {
    Cashfree: any;
  }
}

interface CashfreeSDK {
  new (config: { mode: 'sandbox' | 'production' }): CashfreeInstance;
}

interface CashfreeInstance {
  checkout(options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult>;
}

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: '_self' | '_blank' | '_parent' | '_top';
}

interface CashfreeCheckoutResult {
  error?: {
    message: string;
    code?: string;
  };
  redirect?: boolean;
  paymentDetails?: any;
}

export { CashfreeSDK, CashfreeInstance, CashfreeCheckoutOptions, CashfreeCheckoutResult };
