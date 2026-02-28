// components/checkout/steps/PaymentStep.tsx
'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CreditCard, WalletCards, Apple } from 'lucide-react';
import FormSelect from '@/src/components/checkout/ui/FormSelect';
import FormInput from '@/src/components/checkout/ui/FormInput';
import { CheckoutFormData } from '../schemas/checkout';

const PaymentStep = () => {
  const { 
    register, 
    formState: { errors }, 
    watch, 
    setValue 
  } = useFormContext<CheckoutFormData>();
  
  const paymentMethods = [
    { 
      value: 'credit-card', 
      label: 'Credit/Debit Card', 
      icon: <CreditCard className="h-5 w-5" /> 
    },
    { 
      value: 'paypal', 
      label: 'PayPal', 
      icon: <WalletCards className="h-5 w-5" /> 
    },
    { 
      value: 'apple-pay', 
      label: 'Apple Pay', 
      icon: <Apple className="h-5 w-5" /> 
    }
  ];

  const selectedMethod = watch('payment.paymentMethod') || 'credit-card';

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
          <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        Payment Method
      </h3>

      {/* Payment method selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {paymentMethods.map((method) => (
          <button
            key={method.value}
            type="button"
            onClick={() => {
              setValue('payment.paymentMethod', method.value as any);
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedMethod === method.value
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                selectedMethod === method.value 
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {method.icon}
              </div>
              <span className="font-medium">{method.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Credit card details */}
      {selectedMethod === 'credit-card' && (
        <div className="space-y-4 border-t dark:border-gray-700 pt-6">
          <FormInput
            label="Card Number"
            name="payment.cardNumber"
            register={register}
            error={errors.payment?.cardNumber}
            placeholder="1234 5678 9012 3456"
            maxLength={16}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Expiry Date (MM/YY)"
              name="payment.expiryDate"
              register={register}
              error={errors.payment?.expiryDate}
              placeholder="12/25"
              maxLength={5}
            />

            <FormInput
              label="CVV"
              name="payment.cvv"
              type="password"
              register={register}
              error={errors.payment?.cvv}
              placeholder="123"
              maxLength={4}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              {...register('payment.saveCard')}
              className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
            />
            <label 
              htmlFor="saveCard" 
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Save card for future purchases
            </label>
          </div>
        </div>
      )}

      {/* PayPal/Apple Pay Message */}
      {selectedMethod !== 'credit-card' && (
        <div className="border-t dark:border-gray-700 pt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300">
              You will be redirected to {selectedMethod === 'paypal' ? 'PayPal' : 'Apple Pay'} 
              to complete your payment securely.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentStep;