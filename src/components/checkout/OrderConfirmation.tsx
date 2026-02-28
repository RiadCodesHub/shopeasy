// components/checkout/OrderConfirmation.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface OrderConfirmationProps {
  orderId?: string;
  onContinueShopping: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  orderId, 
  onContinueShopping 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Order Confirmed! 🎉
        </h1>
        
        {orderId && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Order #{orderId}
          </p>
        )}
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your purchase. We've sent a confirmation email.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <p className="font-medium">Estimated delivery: 3-5 business days</p>
          </div>
          <p className="text-sm text-gray-500">
            You will receive tracking details shortly.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FileText className="h-5 w-5" />
            View Order Details
          </Link>
          
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Continue Shopping
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;