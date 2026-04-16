
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { apiRequest } from '../contexts/apiClient';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  items: { productId: string; quantity: number }[];
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    instructions?: string;
  };
  shippingInstructions?: string;
  onSuccess?: (orderData: any) => void;
}

interface PaymentIntentResponse {
  clientSecret: string;
}


function CheckoutForm({ items, customerEmail, customerName, customerPhone, shippingAddress, shippingInstructions, onSuccess }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Call API to create PaymentIntent using apiRequest
    let clientSecret = '';
    try {
      // No enviar instructions a Stripe
      const { instructions, ...shippingAddressForStripe } = shippingAddress;
      const resp = await apiRequest<PaymentIntentResponse>('/create-payment-intent', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY_PAYMENT as string,
        },
        body: { items, customerEmail, customerName, shippingAddress: shippingAddressForStripe },
      });
      clientSecret = resp.clientSecret;
    } catch (err) {
      const msg = (typeof err === 'object' && err && 'message' in err) ? (err as any).message : 'Error al crear el pago';
      setError(msg || 'Error al crear el pago');
      setLoading(false);
      return;
    }

    // 2. Confirm payment with Stripe Elements
    if (!stripe || !elements) {
      setError('Stripe no está listo.');
      setLoading(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);
    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      setError('Faltan campos de tarjeta.');
      setLoading(false);
      return;
    }


    // Use CardNumberElement for payment_method
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: { name: customerName, email: customerEmail },
      },
    });

    if (result.error) {
      setError(result.error.message || 'Error al procesar el pago');
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      // Extra step: create order before show success screen
      try {
        const orderBody = {
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: `${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postal_code}, ${shippingAddress.country}`,
          shipping_instructions: shippingInstructions || shippingAddress.instructions || '',
          payment_method: 'Stripe',
          products: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        };
        const orderResp = await apiRequest('/orders', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY_PAYMENT || ''
          },
          body: orderBody,
        });
        setSuccess(true);
        if (onSuccess) onSuccess(orderResp.order);
      } catch {
        setError('Pago realizado, pero error al crear la orden.');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
        <CardNumberElement className="p-2 border rounded w-full" />
      </div>
      <div className="mb-4 flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Expiración</label>
          <CardExpiryElement className="p-2 border rounded w-full" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">CVC</label>
          <CardCvcElement className="p-2 border rounded w-full" />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-black text-white rounded-full py-3 font-semibold text-base transition hover:bg-gray-900 mt-2"
      >
        {loading ? 'Procesando...' : 'Pagar'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">¡Pago exitoso!</div>}
    </form>
  );
}


export default function StripeCheckout(props: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
