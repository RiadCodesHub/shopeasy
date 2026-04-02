'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  MapPin, 
  CreditCard, 
  Package,
  Shield,
  Edit2,
  ShoppingBag,
  Truck,
  DollarSign
} from 'lucide-react';
import { CheckoutFormData } from '../schemas/checkout';
import { useAppSelector } from '@/lib/store/hooks';
import { useDispatch } from 'react-redux';
import { setStep } from '@/lib/store/slices/formSlice';

interface ReviewStepProps {
  shippingCost: number;
  tax: number;
  orderTotal: number;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  shippingCost, 
  tax, 
  orderTotal 
}) => {
  const { watch, setValue, register, formState: { errors } } = useFormContext<CheckoutFormData>();
  const { items } = useAppSelector((state) => state.cart);
  const formData = watch();
  const useShippingAsBilling = watch('useShippingAsBilling');
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const dispatch = useDispatch();

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="card p-6"
    >
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3">
        <div className="p-3 bg-success/10 rounded-xl">
          <CheckCircle className="h-6 w-6 text-success" />
        </div>
        Review Your Order
      </h2>

      {/* Order Items */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Order Items ({items.length})
          </h3>
        </div>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--background-secondary)]">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--background-tertiary)]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[var(--foreground)]">{item.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[var(--foreground-tertiary)] text-sm">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                  <p className="font-semibold text-[var(--foreground)]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Billing Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Shipping Information */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Shipping Information
            </h3>
            <button
              type="button"
              onClick={() => dispatch(setStep(1))}
              className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="bg-[var(--background-tertiary)] rounded-lg p-4 border border-[var(--border)]">
            <p className="font-medium text-[var(--foreground)]">
              {formData.personalInfo?.firstName} {formData.personalInfo?.lastName}
            </p>
            <p className="text-[var(--foreground-secondary)]">{formData.shipping?.address?.street}</p>
            <p className="text-[var(--foreground-secondary)]">
              {formData.shipping?.address?.city}, {formData.shipping?.address?.state} {formData.shipping?.address?.zipCode}
            </p>
            <p className="text-[var(--foreground-secondary)]">{formData.shipping?.address?.country}</p>
            <p className="text-[var(--foreground-secondary)] mt-2">{formData.personalInfo?.phone}</p>
            <p className="text-[var(--foreground-secondary)]">{formData.personalInfo?.email}</p>
            
            {formData.shipping?.deliveryInstructions && (
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">Delivery Instructions:</p>
                <p className="text-sm text-[var(--foreground-tertiary)]">{formData.shipping.deliveryInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" />
              Payment Method
            </h3>
            <button
              type="button"
              onClick={() => dispatch(setStep(2))}
              className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="bg-[var(--background-tertiary)] rounded-lg p-4 border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-accent" />
              <p className="font-medium text-[var(--foreground)]">
                {formData.payment?.paymentMethod === 'credit-card' 
                  ? 'Credit/Debit Card' 
                  : formData.payment?.paymentMethod === 'paypal' 
                    ? 'PayPal' 
                    : formData.payment?.paymentMethod === 'apple-pay' 
                      ? 'Apple Pay' 
                      : 'Google Pay'
                }
              </p>
            </div>
            
            {formData.payment?.paymentMethod === 'credit-card' && formData.payment?.cardNumber && (
              <>
                <p className="text-[var(--foreground-secondary)]">
                  •••• {formData.payment.cardNumber.slice(-4)}
                </p>
                {formData.payment.expiryDate && (
                  <p className="text-[var(--foreground-secondary)]">
                    Expires: {formData.payment.expiryDate}
                  </p>
                )}
              </>
            )}
            
            {formData.payment?.paymentMethod !== 'credit-card' && (
              <p className="text-[var(--foreground-secondary)]">
                You will be redirected to complete your payment securely.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Address (if different) */}
      {!useShippingAsBilling && formData.billing && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Billing Address
          </h3>
          <div className="bg-[var(--background-tertiary)] rounded-lg p-4 border border-[var(--border)]">
            <p className="text-[var(--foreground-secondary)]">{formData.billing.street}</p>
            <p className="text-[var(--foreground-secondary)]">
              {formData.billing.city}, {formData.billing.state} {formData.billing.zipCode}
            </p>
            <p className="text-[var(--foreground-secondary)]">{formData.billing.country}</p>
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-success" />
          Price Summary
        </h3>
        <div className="bg-[var(--background-tertiary)] rounded-lg p-4 border border-[var(--border)]">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--foreground-secondary)]">Subtotal</span>
              <span className="font-medium text-[var(--foreground)]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--foreground-secondary)]">Shipping</span>
              <span className="font-medium text-[var(--foreground)]">
                {shippingCost === 0 ? (
                  <span className="text-success flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    FREE
                  </span>
                ) : (
                  `$${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--foreground-secondary)]">Tax</span>
              <span className="font-medium text-[var(--foreground)]">${tax.toFixed(2)}</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-[var(--foreground)]">Total</span>
              <span className="text-primary">${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Security */}
      <div className="space-y-4">
        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium text-success">
                Secure Checkout
              </p>
              <p className="text-sm text-success/80">
                Your payment is encrypted and secure. We never store your credit card details.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-primary">
                30-Day Return Policy
              </p>
              <p className="text-sm text-primary/80">
                Easy returns within 30 days of delivery. No questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="card p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('agreeToTerms')}
              className="mt-1 h-4 w-4 rounded border-[var(--border)] text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-sm text-[var(--foreground-secondary)]">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-2 text-sm text-error">
              {errors.agreeToTerms.message as string}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewStep;