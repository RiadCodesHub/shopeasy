// components/checkout/CheckoutProgress.tsx
'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  icon: string;
  description: string;
}

interface CheckoutProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const CheckoutProgress = ({ steps, currentStep, onStepClick }: CheckoutProgressProps) => {

  if (!steps.length) return null;
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div key={step.number} className="flex-1 relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 transition-colors ${
                    isCompleted ? 'bg-primary' : 'bg-(--border)'
                  }`}
                  style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 1rem)' }}
                />
              )}
              
              {/* Step Button */}
              <button
                onClick={() => step.number <= currentStep && onStepClick(step.number)}
                disabled={step.number > currentStep}
                className="relative flex flex-col items-center group w-full"
              >
                {/* Icon Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    transition-all duration-300 relative z-10
                    ${isCompleted 
                      ? 'bg-primary text-white' 
                      : isCurrent 
                        ? 'bg-primary text-white ring-4 ring-primary/20' 
                        : 'bg-(--background-tertiary) text-(--foreground-tertiary)'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.icon}</span>
                  )}
                </motion.div>
                
                {/* Title */}
                <span className={`
                  text-sm font-medium mb-1
                  ${isCurrent ? 'text-primary' : 'text-(--foreground-secondary)'}
                `}>
                  {step.title}
                </span>
                
                {/* Description */}
                <span className="text-xs text-(--foreground-tertiary) hidden sm:block">
                  {step.description}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;