// components/checkout/steps/PaymentStep.tsx
'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CreditCard, WalletCards, Apple } from 'lucide-react';
import FormSelect from '@/components/checkout/ui/FormSelect';
import FormInput from '@/components/checkout/ui/FormInput';
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
      className="card p-6"
    >
      <h3 className="text-2xl font-bold text-(--foreground) mb-6 flex items-center gap-3">
        <div className="p-3 bg-accent/10 rounded-xl">
          <CreditCard className="h-6 w-6 text-accent" />
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
                ? 'border-accent bg-accent/10'
                : 'border-(--border) hover:border-accent/50 bg-(--background-secondary)'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${
                selectedMethod === method.value 
                  ? 'bg-accent text-white'
                  : 'bg-(--background-tertiary) text-(--foreground-secondary)'
              }`}>
                {method.icon}
              </div>
              <span className={`font-medium ${
                selectedMethod === method.value 
                  ? 'text-accent'
                  : 'text-(--foreground-secondary)'
              }`}>
                {method.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Credit card details */}
      {selectedMethod === 'credit-card' && (
        <div className="space-y-4 border-t border-(--border) pt-6">
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
              className="h-4 w-4 text-accent rounded border-(--border) focus:ring-accent focus:ring-offset-0"
            />
            <label 
              htmlFor="saveCard" 
              className="ml-2 text-sm text-(--foreground-secondary)"
            >
              Save card for future purchases
            </label>
          </div>
        </div>
      )}

      {/* PayPal/Apple Pay Message */}
      {selectedMethod !== 'credit-card' && (
        <div className="border-t border-(--border) pt-6">
          <div className="bg-info/10 border border-info/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-info/20 rounded-lg">
                <WalletCards className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-info font-medium mb-1">
                  {selectedMethod === 'paypal' ? 'PayPal Checkout' : 'Apple Pay Checkout'}
                </p>
                <p className="text-sm text-info/80">
                  You will be redirected to {selectedMethod === 'paypal' ? 'PayPal' : 'Apple Pay'} 
                  to complete your payment securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="mt-6 pt-6 border-t border-(--border)">
        <div className="flex items-center justify-center gap-2 text-sm text-(--foreground-tertiary)">
          <CreditCard className="h-4 w-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;