'use client';

import { useState, useEffect } from 'react';

import { CartStepper } from './CartStepper';
import { CartTable } from './CartTable';
import CartSummary from './CartSummary';
import { ShippingForm, ShippingFormValues, initialShippingValues, isShippingFormValid } from './ShippingForm';
import { OrderSuccess } from './OrderSuccess';
import { OrderSummary } from './OrderSummary';
import { Button } from '../components/ui/atoms/button/Button';
import StripeCheckout from './StripeCheckout';
import { useStore } from '@/contexts/useStore';

import { CartTableConfirm } from './CartTableConfirm';
import { ShippingSummary } from './ShippingSummary';
import { ConfirmRadios } from './ConfirmRadios';

function CartPage() {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null);
  const [shippingForm, setShippingForm] = useState<ShippingFormValues>(initialShippingValues);
  const [shippingErrors, setShippingErrors] = useState({});
  const [accepts, setAccepts] = useState<string[]>([]);
  const { cart, clearCart } = useStore();
  const [orderResponse, setOrderResponse] = useState<any>(null);

  useEffect(() => {
    if (step === 4 && cart.length > 0) {
      clearCart();
    }
  }, [step]);

  return (
    <div className="py-8 px-4 mt-14 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <CartStepper currentStep={step} onBack={step > 0 ? () => setStep(step - 1) : undefined} />
        {step === 0 && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Producto</h2>
              <CartTable />
            </div>
            <div className="w-full md:w-80 flex-shrink-0">
              <CartSummary onNext={() => setStep(step + 1)} />
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Datos de envío</h2>
              <ShippingForm
                values={shippingForm}
                onChange={(values) => {
                  setShippingForm(values);
                }}
              />
            </div>
            <div className="w-full md:w-80 flex-shrink-0">
              <CartSummary
                onNext={() => {
                  const errors: { [key: string]: string | undefined } = {};
                  const fields = [
                    { name: 'customer_name', value: shippingForm.customer_name },
                    { name: 'customer_last_name', value: shippingForm.customer_last_name },
                    { name: 'customer_email', value: shippingForm.customer_email },
                    { name: 'customer_phone', value: shippingForm.customer_phone },
                    { name: 'street', value: shippingForm.shipping_address.street },
                    { name: 'neighborhood', value: shippingForm.shipping_address.neighborhood },
                    { name: 'municipality', value: shippingForm.shipping_address.municipality },
                    { name: 'state', value: shippingForm.shipping_address.state },
                    { name: 'postalCode', value: shippingForm.shipping_address.postalCode },
                  ];
                  fields.forEach(({ name, value }) => {
                    if (!value || !value.trim()) {
                      errors[name] = 'Campo obligatorio';
                    }
                  });
                  setShippingErrors(errors);
                  if (isShippingFormValid(shippingForm, errors)) {
                    setShippingData(shippingForm);
                    setStep(step + 1);
                  }
                }}
                nextButtonProps={{
                  disabled: !isShippingFormValid(shippingForm, shippingErrors),
                }}
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Ya casi... por favor confirma tu pedido</h2>
                <CartTableConfirm />
              </div>
              {shippingData && (
                <ShippingSummary values={shippingData} onEdit={() => setStep(1)} />
              )}
            </div>
            
            <div className="w-full md:w-80 flex-shrink-0">
              <CartSummary>
                <ConfirmRadios value={accepts} onChange={setAccepts} />
                <Button
                  className="w-full bg-black text-white rounded-full py-3 font-semibold text-base transition hover:bg-gray-900 mt-2"
                  onClick={() => setStep(step + 1)}
                  color="dark"
                  disabled={accepts.length !== 3}
                >
                  Proceder al pago
                </Button>
              </CartSummary>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-2xl font-bold mb-8 text-center">Completa tu pago</h2>
              {shippingData && (
                <StripeCheckout
                  items={cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                  }))}
                  customerEmail={shippingData.customer_email}
                  customerName={shippingData.customer_name + (shippingData.customer_last_name ? ' ' + shippingData.customer_last_name : '')}
                  customerPhone={shippingData.customer_phone}
                  shippingAddress={{
                    line1: shippingData.shipping_address.street,
                    city: shippingData.shipping_address.municipality,
                    state: shippingData.shipping_address.state,
                    postal_code: shippingData.shipping_address.postalCode,
                    country: 'MX',
                    instructions: shippingData.shipping_address.instructions || ''
                  }}
                  shippingInstructions={shippingData.shipping_address.instructions || ''}
                  onSuccess={(orderData) => {
                    setOrderResponse(orderData);
                    setStep(step + 1);
                  }}
                />
              )}
            </div>
          </div>
        )}
        {step === 4 && orderResponse && (
          <OrderSuccess
            trackingNumber={orderResponse.tracking_number}
            shippingData={{
              customer_name: orderResponse.customer_name,
              customer_last_name: '',
              customer_email: orderResponse.customer_email,
              customer_phone: orderResponse.customer_phone,
              shipping_address: orderResponse.shipping_address,
            }}
            summary={
              <OrderSummary
                total={parseFloat(orderResponse.total)}
                orderDetails={orderResponse.orderDetails}
              />
            }
            showExploreMoreButton
          />
        )}
      </div>
    </div>
  );
}
export default CartPage;
