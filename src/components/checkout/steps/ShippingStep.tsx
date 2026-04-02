'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, Zap, Package } from 'lucide-react';
import FormInput from '@/components/checkout/ui/FormInput';
import FormSelect from '@/components/checkout/ui/FormSelect';

const ShippingStep = ({ shippingCost = 5.99 }: { shippingCost?: number }) => {
  const { register, formState: { errors }, watch } = useFormContext();
  
  // Type cast to access nested errors
  const shippingErrors = errors.shipping as any;
  const addressErrors = shippingErrors?.address as any;
  
  const shippingMethods = [
    { 
      value: 'standard', 
      label: `Standard Shipping (5-7 days)`, 
      icon: <Package className="h-4 w-4" />,
      description: 'Delivered in 5-7 business days',
      price: shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`
    },
    { 
      value: 'express', 
      label: 'Express Shipping (2-3 days)', 
      icon: <Zap className="h-4 w-4" />,
      description: 'Delivered in 2-3 business days',
      price: '$9.99'
    },
    { 
      value: 'overnight', 
      label: 'Overnight Shipping', 
      icon: <Clock className="h-4 w-4" />,
      description: 'Delivered next business day',
      price: '$19.99'
    }
  ];

  const selectedShippingMethod = watch('shipping.shippingMethod');

  // Get the selected method details
  const selectedMethod = shippingMethods.find(m => m.value === selectedShippingMethod);

  return (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="card p-6"
    >
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Truck className="h-6 w-6 text-primary" />
        </div>
        Shipping Information
      </h2>
      
      {/* Address Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Delivery Address</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Street Address"
            name="shipping.address.street"
            register={register}
            error={addressErrors?.street}
            required
            placeholder="123 Main St"
          />

          <FormInput
            label="City"
            name="shipping.address.city"
            register={register}
            error={addressErrors?.city}
            required
            placeholder="New York"
          />

          <FormInput
            label="State"
            name="shipping.address.state"
            register={register}
            error={addressErrors?.state}
            required
            placeholder="NY"
          />

          <FormInput
            label="ZIP Code"
            name="shipping.address.zipCode"
            register={register}
            error={addressErrors?.zipCode}
            required
            placeholder="10001"
          />

          <FormInput
            label="Country"
            name="shipping.address.country"
            register={register}
            error={addressErrors?.country}
            required
            placeholder="United States"
          />
        </div>
      </div>

      {/* Shipping Method Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Shipping Method</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {shippingMethods.map((method) => (
            <label
              key={method.value}
              className={`relative flex cursor-pointer rounded-lg border-2 p-4 transition-all ${
                selectedShippingMethod === method.value
                  ? 'border-primary bg-primary/5'
                  : 'border-[var(--border)] bg-[var(--background-secondary)] hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                value={method.value}
                {...register('shipping.shippingMethod')}
                className="sr-only"
              />
              <div className="flex w-full items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedShippingMethod === method.value
                    ? 'bg-primary text-white'
                    : 'bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]'
                }`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${
                      selectedShippingMethod === method.value
                        ? 'text-primary'
                        : 'text-[var(--foreground)]'
                    }`}>
                      {method.label}
                    </p>
                    <p className="font-semibold text-primary">
                      {method.price}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--foreground-tertiary)]">
                    {method.description}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
        
        {selectedShippingMethod && selectedMethod && (
          <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-sm text-[var(--foreground-secondary)]">
                {selectedMethod.description}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Delivery Instructions */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
          Delivery Instructions (Optional)
        </label>
        <textarea
          {...register('shipping.deliveryInstructions')}
          className="input-field resize-none"
          rows={3}
          placeholder="Leave at the door, call before delivery, gate code, etc."
        />
        <p className="mt-1 text-xs text-[var(--foreground-tertiary)]">
          Special instructions for the delivery driver
        </p>
      </div>

      {/* Shipping Cost Banner */}
      {shippingCost === 0 ? (
        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/20 rounded-lg">
              <Truck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-success">
                🎉 FREE Shipping Applied!
              </p>
              <p className="text-sm text-success/80">
                Your order qualifies for free standard shipping!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-primary">
                Shipping: ${shippingCost.toFixed(2)}
              </p>
              <p className="text-sm text-primary/80">
                Add ${(50 - (shippingCost === 5.99 ? (50 - (shippingCost === 5.99 ? 44.01 : 0)) : 0)).toFixed(2)} more to get free shipping
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ShippingStep;