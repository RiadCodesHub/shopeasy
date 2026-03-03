// components/checkout/OrderSummary.tsx
'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ShoppingBag, Tag, Truck, Shield } from 'lucide-react';
import { useAppSelector } from '@/src/lib/store/hooks';

const OrderSummary = () => {
  const { watch } = useFormContext();
  const { items } = useAppSelector((state) => state.cart);
  
  const shippingMethod = watch('shipping.shippingMethod') || 'standard';
  const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'express' ? 9.99 : shippingMethod === 'overnight' ? 19.99 : 0;
  const tax = subTotal * 0.08;
  const total = subTotal + shippingCost + tax;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <ShoppingBag className='h-5 w-5' />
        Order Summary
      </h3>

      {/* Cart Items */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Items ({items.length})
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-t dark:border-gray-700 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-medium">${subTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipping
          </span>
          <span className="font-medium">
            {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6">
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Promo code"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
      
      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t dark:border-gray-700">
        <div className="flex items-center justify-center gap-6 text-gray-500">
          <div className="flex flex-col items-center">
            <Shield className="h-8 w-8 mb-1" />
            <span className="text-xs">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="h-8 w-8 mb-1" />
            <span className="text-xs">Free Shipping</span>
          </div>
          <div className="flex flex-col items-center">
            <Tag className="h-8 w-8 mb-1" />
            <span className="text-xs">Best Price</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;