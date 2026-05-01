// components/checkout/CheckoutNavigation.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';

interface CheckoutNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  onBackToCart: () => void;
}

const CheckoutNavigation: React.FC<CheckoutNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  isSubmitting,
  onBackToCart
}) => {

   const safeStep = currentStep || 1;


  return (
    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:justify-between  mt-8">
      {safeStep === 1 ? (
        <button
          type="button"
          onClick={onBackToCart}
          className="flex items-center justify-center gap-2 btn border-2 border-border text-text rounded-lg hover:bg-bg-tertiary transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Cart
        </button>
      ) : (
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center justify-center gap-2 btn border-2 border-border text-text rounded-lg hover:bg-bg-tertiary  transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>
      )}
      
      {safeStep < totalSteps ? (
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-8 py-3 btn btn-primary rounded-lg hover:opacity-90 transition-all font-bold"
        >
          Continue
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      ) : (
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="ml-auto flex items-center justify-center btn bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-5 w-5" />
              Place Order
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default CheckoutNavigation;