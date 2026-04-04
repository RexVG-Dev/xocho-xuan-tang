'use client';

import { useEffect, useState } from 'react';

import { CartStepper } from './CartStepper';
import { CartTable } from './CartTable';
import { CartSummary } from './CartSummary';
import { ShippingForm, ShippingFormValues, initialShippingValues } from './ShippingForm';
import { OrderSuccess } from './OrderSuccess';
import { OrderSummary } from './OrderSummary';
import { Button } from '../components/ui/atoms/button/Button';
import { useApiRequest } from '../contexts/useApiRequest';

const mockOrderResponse = {
  id: '4a33a76e-2dd6-4b45-80c9-d4b117ebfef6',
  order_date: '2026-03-31T19:34:37.174Z',
  total: '623.4',
  status: 'packing',
  shipping_address: 'Av. Siempreviva 742, Springfield',
  payment_method: 'Stripe',
  tracking_number: 'JIBQ-90795',
  customer_email: 'ana.lopez@example.com',
  customer_name: 'Ana Lopez',
  customer_phone: '5543452343',
  orderDetails: [
    {
      id: '2423487b-99d1-4583-9a96-8631f4dd31b5',
      order_id: '4a33a76e-2dd6-4b45-80c9-d4b117ebfef6',
      product_id: '4680ee70-6443-4aeb-99dc-a70627aa5bdd',
      quantity: 2,
      unit_price: '100',
      product: {
        id: '4680ee70-6443-4aeb-99dc-a70627aa5bdd',
        name: 'Nuevo Nombre',
        description: 'SARTEN de teflón,',
        price: '100',
        sku: 'SARTEN-002',
        stock: 20,
        main_image_url: 'https://res.cloudinary.com/dphrt50s2/image/upload/v1760319490/product_images/SARTEN-002/SARTEN-002_1760319488792.jpg',
        discount_value: '0',
        discount_type: 'amount',
        active: true,
        created_at: '2025-06-09T01:16:04.866Z',
        updated_at: '2026-03-31T19:34:37.190Z',
      },
    },
    {
      id: 'c7e9f004-4134-4ba3-a108-339ba6043f06',
      order_id: '4a33a76e-2dd6-4b45-80c9-d4b117ebfef6',
      product_id: 'a22e9b64-34e7-4d41-a5cb-bf0eb030440f',
      quantity: 1,
      unit_price: '423.4',
      product: {
        id: 'a22e9b64-34e7-4d41-a5cb-bf0eb030440f',
        name: 'Bocina JBL 2',
        description: 'Bocina para escuchar tu música en donde quieras, cuenta con una capacidad de 8 horas libres',
        price: '423.4',
        sku: 'BOCINA-003',
        stock: 16,
        main_image_url: 'https://res.cloudinary.com/dphrt50s2/image/upload/v1760240952/product_images/BOCINA-001/BOCINA-001_01.jpg',
        discount_value: '0.1',
        discount_type: 'percentage',
        active: true,
        created_at: '2025-06-09T01:14:22.983Z',
        updated_at: '2026-03-31T19:34:37.199Z',
      },
    },
  ],
  orderStatusHistory: [
    {
      id: 49,
      order_id: '4a33a76e-2dd6-4b45-80c9-d4b117ebfef6',
      status: 'packing',
      change_date: '2026-03-31T19:34:37.200Z',
      user_id: 'f94f057a-6ebf-48df-a0e2-7902ba491903',
      observations: 'Orden creada y procesando.',
    },
  ],
};
import { CartTableConfirm } from './CartTableConfirm';
import { ShippingSummary } from './ShippingSummary';
import { ConfirmRadios } from './ConfirmRadios';

export default function CartPage() {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null);
  const [shippingForm, setShippingForm] = useState<ShippingFormValues>(initialShippingValues);
  const [accepts, setAccepts] = useState<string[]>([]);

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
              <ShippingForm values={shippingForm} onChange={setShippingForm} />
            </div>
            <div className="w-full md:w-80 flex-shrink-0">
              <CartSummary onNext={() => {
                const valid =
                  shippingForm.customer_name.trim() &&
                  shippingForm.customer_last_name.trim() &&
                  shippingForm.customer_email.trim() &&
                  shippingForm.customer_phone.trim() &&
                  shippingForm.shipping_address.address.trim() &&
                  shippingForm.shipping_address.postal_code.trim() &&
                  shippingForm.shipping_address.city.trim() &&
                  shippingForm.shipping_address.country.trim();
                if (valid) {
                  setShippingData(shippingForm);
                  setStep(step + 1);
                } else {
                  alert('Por favor completa todos los campos obligatorios.');
                }
              }} />
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
                  disabled={!accepts.includes('privacy')}
                  onClick={() => setStep(step + 1)}
                  color="primary"
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
              <Button
                className="w-full max-w-xs bg-black text-white rounded-full py-3 font-semibold text-base transition hover:bg-gray-900"
                onClick={() => setStep(step + 1)}
                color="primary"
              >
                Ir a confirmación
              </Button>
            </div>
          </div>
        )}
        {step === 4 && (
          <OrderSuccess
            trackingNumber={mockOrderResponse.tracking_number}
            shippingData={{
              customer_name: mockOrderResponse.customer_name,
              customer_last_name: '',
              customer_email: mockOrderResponse.customer_email,
              customer_phone: mockOrderResponse.customer_phone,
              shipping_address: mockOrderResponse.shipping_address,
            }}
            summary={
              <OrderSummary
                total={parseFloat(mockOrderResponse.total)}
                orderDetails={mockOrderResponse.orderDetails}
              />
            }
          />
        )}
      </div>
    </div>
  );
}
