'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
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
      label: `Standard Shipping (5-7 days) - ${shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}` 
    },
    { value: 'express', label: 'Express Shipping (2-3 days) - $9.99' },
    { value: 'overnight', label: 'Overnight Shipping - $19.99' }
  ];

  const selectedShippingMethod = watch('shipping.shippingMethod');

  return (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
          <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        Shipping Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

      <div className="mb-6">
        <FormSelect
          label="Shipping Method"
          name="shipping.shippingMethod"
          register={register}
          options={shippingMethods}
          error={shippingErrors?.shippingMethod}
          required
        />
        
        {selectedShippingMethod && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {selectedShippingMethod === 'standard' && 'Delivered in 5-7 business days'}
            {selectedShippingMethod === 'express' && 'Delivered in 2-3 business days'}
            {selectedShippingMethod === 'overnight' && 'Delivered next business day'}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Delivery Instructions (Optional)
        </label>
        <textarea
          {...register('shipping.deliveryInstructions')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 resize-none"
          rows={3}
          placeholder="Leave at the door, call before delivery, etc."
        />
      </div>

      {shippingCost === 0 ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-400">
                🎉 FREE Shipping Applied!
              </p>
              <p className="text-sm text-green-700 dark:text-green-500">
                Your order qualifies for free standard shipping!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-400">
                Shipping: ${shippingCost.toFixed(2)}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-500">
                Add ${(50).toFixed(2)} more to get free shipping
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ShippingStep;