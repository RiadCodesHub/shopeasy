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
  ShoppingBag
} from 'lucide-react';
import { CheckoutFormData } from '../schemas/checkout';
import { useAppSelector } from '@/src/lib/store/hooks';
import { UseDispatch } from 'react-redux';
import { setStep } from '@/src/lib/store/slices/formSlice';
import { useDispatch } from 'react-redux';

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
  const { watch, setValue } = useFormContext<CheckoutFormData>();
  const {items} = useAppSelector((state) => state.cart);
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
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        Review Your Order
      </h2>

      {/* Order Items */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order Items ({items.length})
          </h3>
        </div>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-500 text-sm">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                  <p className="font-semibold">
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Shipping Information
            </h3>
            <button
              type="button"
              onClick={() => dispatch(setStep(1))}
              className="text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="font-medium">
              {formData.personalInfo?.firstName} {formData.personalInfo?.lastName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{formData.shipping?.address?.street}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {formData.shipping?.address?.city}, {formData.shipping?.address?.state} {formData.shipping?.address?.zipCode}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{formData.shipping?.address?.country}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{formData.personalInfo?.phone}</p>
            <p className="text-gray-600 dark:text-gray-400">{formData.personalInfo?.email}</p>
            
            {formData.shipping?.deliveryInstructions && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Instructions:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formData.shipping.deliveryInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Payment Method
            </h3>
            <button
              type="button"
              onClick={() => dispatch(setStep(2))}
              className="text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <p className="font-medium">
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
                <p className="text-gray-600 dark:text-gray-400">
                  •••• {formData.payment.cardNumber.slice(-4)}
                </p>
                {formData.payment.expiryDate && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Expires: {formData.payment.expiryDate}
                  </p>
                )}
              </>
            )}
            
            {formData.payment?.paymentMethod !== 'credit-card' && (
              <p className="text-gray-600 dark:text-gray-400">
                You will be redirected to complete your payment securely.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Address (if different) */}
      {!useShippingAsBilling && formData.billing && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Billing Address
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-gray-600 dark:text-gray-400">{formData.billing.street}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {formData.billing.city}, {formData.billing.state} {formData.billing.zipCode}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{formData.billing.country}</p>
          </div>
        </div>)}    

      {/* Price Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Price Summary
        </h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="font-medium">
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Security */}
      <div className="space-y-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-400">
                Secure Checkout
              </p>
              <p className="text-sm text-green-700 dark:text-green-500">
                Your payment is encrypted and secure. We never store your credit card details.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-400">
                30-Day Return Policy
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-500">
                Easy returns within 30 days of delivery. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


export default ReviewStep;