/**
 * Sam's Hardware PayFast Payment Service
 * 
 * Handles PayFast payment integration through the secure WordPress backend.
 * All sensitive operations (signature generation) happen server-side.
 */

import { API_CONFIG, PAYFAST_CONFIG, SHOP_ROUTES } from '../shop/utils/constants';

export interface PaymentRequest {
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  itemName: string;
  itemDescription?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  formData?: Record<string, string>;
  paymentId?: number;
  error?: string;
  message?: string;
  redirectUrl?: string;
}

/**
 * Generate PayFast payment data via secure server endpoint
 * The server handles all secret keys and signature generation
 */
export async function generatePayFastPaymentData(request: PaymentRequest): Promise<PaymentResponse> {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const payload = {
    order_id: request.orderId,
    order_number: request.orderNumber,
    customer_name: request.customerName,
    customer_email: request.customerEmail,
    customer_phone: request.customerPhone,
    amount: request.amount,
    item_name: request.itemName || `Buildora Hardware Order #${request.orderNumber}`,
    return_url: PAYFAST_CONFIG.RETURN_URL || `${baseUrl}${SHOP_ROUTES.PAYMENT_SUCCESS}`,
    cancel_url: PAYFAST_CONFIG.CANCEL_URL || `${baseUrl}${SHOP_ROUTES.PAYMENT_FAILURE}`,
  };
  
  try {
    // Build the correct API endpoint
    // API_CONFIG.BASE_URL should already include the full path (e.g., https://wordpress.com/wp-json/sams-hardware/v1)
    // If it doesn't, we need to construct it properly
    let apiEndpoint = `${API_CONFIG.BASE_URL}/payments/create`;
    
    // If BASE_URL doesn't include /wp-json/, add it
    if (!API_CONFIG.BASE_URL.includes('/wp-json/')) {
      // Remove trailing slash if present
      const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
      apiEndpoint = `${baseUrl}/wp-json/sams-hardware/v1/payments/create`;
    }
    
    console.log('Calling PayFast API endpoint:', apiEndpoint);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.API_KEY,
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || 'Payment initialization failed',
        redirectUrl: data.redirect_url,
      };
    }
    
    return {
      success: true,
      paymentUrl: data.payment_url,
      formData: data.form_data,
      paymentId: data.payment_id,
    };
  } catch (error: any) {
    console.error('PayFast payment error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect to payment service',
    };
  }
}

/**
 * Submit payment to PayFast by creating and submitting a form
 * This handles the redirect to PayFast's hosted payment page
 * IMPORTANT: Form submission must be synchronous and direct to PayFast (bypasses CloudFront)
 */
export async function submitPayFastPayment(request: PaymentRequest): Promise<{
  success: boolean;
  error?: string;
}> {
  const paymentData = await generatePayFastPaymentData(request);
  
  if (!paymentData.success || !paymentData.formData || !paymentData.paymentUrl) {
    return {
      success: false,
      error: paymentData.error || 'Failed to generate payment data',
    };
  }
  
  // Create and submit the form
  if (typeof window !== 'undefined') {
    // Store order ID in sessionStorage before redirecting
    // PayFast may not return parameters in URL, so we need to store it
    sessionStorage.setItem('pending_order_id', String(request.orderId));
    sessionStorage.setItem('pending_order_number', request.orderNumber);
    
    // Verify the payment URL is correct (must be PayFast domain, not CloudFront)
    const paymentUrl = paymentData.paymentUrl;
    if (!paymentUrl || (!paymentUrl.includes('payfast.co.za') && !paymentUrl.includes('sandbox.payfast.co.za'))) {
      console.error('Invalid PayFast URL:', paymentUrl);
      return {
        success: false,
        error: 'Invalid payment URL configuration',
      };
    }
    
    // Create form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl; // Direct to PayFast, bypasses CloudFront
    form.style.display = 'none';
    
    // Add all form fields from backend response
    Object.entries(paymentData.formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    
    // Append to document body
    document.body.appendChild(form);
    
    // Submit immediately - SYNCHRONOUS (blocks execution)
    // Browser will navigate to PayFast, page will unload
    // Code after this line will NOT execute (page navigates away)
    form.submit();
    
    // This return will never be reached because browser navigates away
    // But we include it for TypeScript/error handling edge cases
    return { success: true };
  }
  
  return {
    success: false,
    error: 'Cannot submit payment form outside of browser environment',
  };
}

/**
 * Process payment for an order
 * Main entry point for payment processing
 */
export async function processPayment(
  orderId: number,
  orderNumber: string,
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
  },
  amount: number,
  itemName?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  return submitPayFastPayment({
    orderId,
    orderNumber,
    customerName: customerDetails.name,
    customerEmail: customerDetails.email,
    customerPhone: customerDetails.phone,
    amount,
    itemName: itemName || `Buildora Hardware Order #${orderNumber}`,
  });
}

/**
 * Verify payment result from URL parameters
 * Called on the success/failure pages to verify the payment
 */
export function verifyPaymentResult(
  searchParams: URLSearchParams
): {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  message?: string;
} {
  const paymentId = searchParams.get('pf_payment_id');
  // PayFast returns custom_str1 (order ID) in the return URL
  // Check multiple possible parameters where order ID might be
  let orderId = searchParams.get('custom_str1') 
    || searchParams.get('m_payment_id')
    || searchParams.get('order_id')
    || searchParams.get('orderId');
  
  // If no order ID in URL, try to get it from sessionStorage
  // This handles cases where PayFast doesn't return parameters in URL
  if (!orderId && typeof window !== 'undefined') {
    orderId = sessionStorage.getItem('pending_order_id') || undefined;
  }
  
  const status = searchParams.get('payment_status');
  
  // Log all parameters for debugging
  console.log('PayFast return parameters:', {
    pf_payment_id: paymentId,
    custom_str1: searchParams.get('custom_str1'),
    m_payment_id: searchParams.get('m_payment_id'),
    payment_status: status,
    orderIdFromStorage: typeof window !== 'undefined' ? sessionStorage.getItem('pending_order_id') : null,
    allParams: Object.fromEntries(searchParams.entries()),
  });
  
  // PayFast redirects with pf_payment_id on success
  // OR if we have an order ID from storage, assume success (user reached success page)
  if (paymentId || (orderId && typeof window !== 'undefined' && window.location.pathname.includes('/payment/success'))) {
    return {
      success: true,
      orderId: orderId || undefined,
      paymentId: paymentId || undefined,
      message: 'Payment completed successfully',
    };
  }
  
  // Check for explicit status
  if (status === 'COMPLETE') {
    return {
      success: true,
      orderId: orderId || undefined,
      message: 'Payment completed successfully',
    };
  }
  
  // Check for failure reason
  const reason = searchParams.get('reason');
  return {
    success: false,
    orderId: orderId || undefined,
    message: reason || 'Payment was not completed',
  };
}

/**
 * Confirm payment with backend and update order status
 * This updates the order status to "processing" when payment is successful
 */
export async function confirmPayment(
  paymentData: {
    orderId?: string;
    paymentId?: string;
    [key: string]: string | undefined;
  }
): Promise<{
  success: boolean;
  error?: string;
  message?: string;
}> {
  console.log('Confirming payment with data:', paymentData);
  
  if (!paymentData.orderId) {
    console.error('Missing order ID in payment data');
    return {
      success: false,
      error: 'missing_order_id',
      message: 'Order ID is required to confirm payment',
    };
  }

  try {
    // Use the existing order update endpoint to change status to "processing"
    const orderId = paymentData.orderId;
    const updateUrl = `${API_CONFIG.BASE_URL}/orders/${orderId}`;
    
    console.log('Updating order status:', { orderId, url: updateUrl });
    
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.API_KEY,
      },
      body: JSON.stringify({
        status: 'processing',
        // Also mark as paid if the backend supports it
        set_paid: true,
      }),
    });

    console.log('Order update response:', { 
      status: response.status, 
      statusText: response.statusText,
      ok: response.ok 
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}` };
      }
      
      console.error('Order update failed:', errorData);
      return {
        success: false,
        error: errorData.error || 'order_update_failed',
        message: errorData.message || `Failed to update order status (${response.status})`,
      };
    }

    let data;
    const responseText = await response.text();
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = {};
    }

    console.log('Order update response data:', data);

    // Handle WordPress backend response format
    // Success if: status 200/204, or data.success is true, or no error in data
    const success = response.status === 200 || response.status === 204 || 
                    (data && (data.success === true || !data.error));
    
    if (!success) {
      console.error('Order update returned unsuccessful response:', data);
      return {
        success: false,
        error: data.error || 'order_update_failed',
        message: data.message || 'Failed to update order status',
      };
    }

    console.log('Order status updated successfully to processing');
    return {
      success: true,
      message: 'Payment confirmed and order status updated to processing',
    };
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    return {
      success: false,
      error: 'network_error',
      message: error.message || 'Failed to connect to payment service',
    };
  }
}
