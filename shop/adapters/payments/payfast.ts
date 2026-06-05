import { PaymentProvider, PaymentStartRequest, PaymentStartResult } from '../../core/ports';
import { generatePayFastPaymentData, submitPayFastPayment } from '../../../services/payfast';

export const PayFastPaymentProvider: PaymentProvider = {
  async startPayment(req: PaymentStartRequest): Promise<PaymentStartResult> {
    // SECURITY UPDATE: Use WordPress secure endpoint instead of client-side form generation
    // This will call the WordPress backend which handles all PayFast secrets and signature generation
    const result = await submitPayFastPayment({
      orderId: req.orderId,
      orderNumber: req.orderNumber,
      customerName: req.customerName,
      customerEmail: req.customerEmail,
      customerPhone: req.customerPhone,
      amount: req.amount,
      itemName: req.itemName,
      itemDescription: req.itemDescription,
    });

    if (!result.success) {
      throw new Error(result.error || 'Payment initialization failed');
    }

    // submitPayFastPayment handles the redirect internally (form submission)
    // Return a success result indicating redirect will happen
    return {
      method: 'redirect-url',
      url: '/payment/success', // Fallback URL (actual redirect handled by submitPayFastPayment)
      fields: {}, // WordPress handles all form data generation
    };
  },
};


