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
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-0">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center">
              {/* Step Button */}
              <button
                type="button"
                onClick={() => onStepClick?.(step.number)}
                className={`flex flex-col items-center transition-all ${
                  isActive ? 'opacity-100' : 'opacity-60'
                }`}
              >
                {/* Circle */}
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
                    ${
                      isActive
                        ? 'bg-primary border-primary text-white'
                        : 'border-border text-text bg-bg-secondary'
                    }
                  `}
                >
                  {step.icon}
                </div>

                {/* Title */}
                <span
                  className={`
                    mt-2 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'text-primary'
                        : 'text-text'
                    }
                  `}
                >
                  {step.title}
                </span>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-6 sm:w-24 h-1 mx-2 sm:mx-4 rounded 
                    ${
                      isCompleted
                        ? 'bg-primary'
                        : 'bg-border'
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;