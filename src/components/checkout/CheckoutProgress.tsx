'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
  icon: string;
  description: string;
}

interface CheckoutProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ 
  steps, 
  currentStep,
  onStepClick 
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <button
              type="button"
              onClick={() => onStepClick?.(step.number)}
              className={`flex flex-col items-center transition-all ${
                currentStep >= step.number ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full border-2 
                ${currentStep >= step.number 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 dark:border-gray-700 text-gray-500'
                }
              `}>
                {step.icon}
              </div>
              <span className={`mt-2 text-sm font-medium ${
                currentStep >= step.number 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </button>
            
            {index < steps.length - 1 && (
              <div className={`
                w-6 sm:w-24  h-1 mx-4 
                ${currentStep > step.number 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-700'
                }
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;