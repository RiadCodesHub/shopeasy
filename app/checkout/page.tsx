'use client';

import { useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { clearCart } from '@/lib/store/slices/cartSlice';
import {
  setStep,
  nextStep,
  prevStep,
  submissionSuccess,
  resetForm,
  setSubmitting,
  updateFormData
} from '@/lib/store/slices/formSlice';
import { useRouter } from 'next/navigation';

import PersonalInfoStep from '@/components/checkout/steps/PersonalInfoStep';
import ShippingStep from '@/components/checkout/steps/ShippingStep';
import PaymentStep from '@/components/checkout/steps/PaymentStep';
import ReviewStep from '@/components/checkout/steps/ReviewStep';

import OrderSummary from '@/components/checkout/OrderSummary';
import CheckoutNavigation from '@/components/checkout/CheckoutNavigation';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';

import { checkoutSchema, type CheckoutFormData } from '@/components/checkout/schemas/checkout';

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { items = [], totalPrice = 0 } = useAppSelector((state) => state.cart);
  const { currentStep, formData, isSubmitted, isSubmitting, orderId } =
    useAppSelector((state) => state.form);

  const methods = useForm<CheckoutFormData>({
  resolver: zodResolver(checkoutSchema),
  mode: 'onChange',
  defaultValues: formData || {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    shipping: {
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Bangladesh',
      },
      shippingMethod: 'standard',
      deliveryInstructions: '',
    },
    payment: {
      paymentMethod: 'credit-card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      saveCard: false,
    },
    agreeToTerms: false,
    useShippingAsBilling: true,
  },
});

  const { handleSubmit, trigger, formState: { errors, isValid }, watch } = methods;


  useEffect(() => {
    const sub = watch((value) => {
      if (value) dispatch(updateFormData(value as CheckoutFormData));
    });
    return () => sub.unsubscribe();
  }, [watch, dispatch]);

  
  useEffect(() => {
    if (!items) return;
    if (items.length === 0 && !isSubmitted) {
      router.push('/cart');
    }
  }, [items, isSubmitted, router]);

  // pricing
  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = Number((totalPrice * 0.08).toFixed(2));
  const orderTotal = Number((totalPrice + shippingCost + tax).toFixed(2));

  // validation
  const validateStep = useCallback(async (step: number) => {
  if (step === 1) {
    return await trigger(['personalInfo', 'shipping']);
  }

  if (step === 2) {
    return await trigger(['payment']);
  }

  if (step === 3) {
    return await trigger(['agreeToTerms']);
  }

  return false;
}, [trigger]);

  const handleNextStep = async () => {
    const ok = await validateStep(currentStep);
    if (ok && currentStep < 3) dispatch(nextStep());
  };

  const handlePrevStep = () => {
    if (currentStep > 1) dispatch(prevStep());
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      dispatch(setSubmitting(true));

      const valid = await trigger();
      if (!valid) {
        dispatch(setSubmitting(false));
        return;
      }

      await new Promise((r) => setTimeout(r, 1200));

      const id = `SHOP-${Date.now().toString().slice(-8)}`;

      dispatch(submissionSuccess(id));
      dispatch(clearCart());

    } catch (e) {
      dispatch(setSubmitting(false));
    }
  };

  const handleContinueShopping = () => {
    dispatch(resetForm());
    router.push('/');
  };

  // steps
  const steps = [
    { number: 1, title: 'Shipping', icon: '🚚', description: 'Delivery details' },
    { number: 2, title: 'Payment', icon: '💳', description: 'Payment method' },
    { number: 3, title: 'Review', icon: '✓', description: 'Confirm order' },
  ];

  // loading
  if (isSubmitting) {
    return <div className="text-center py-20">Processing...</div>;
  }

  if (isSubmitted) {
    return (
      <OrderConfirmation
        orderId={orderId}
        onContinueShopping={handleContinueShopping}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">

          <CheckoutProgress
            steps={steps}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step <= currentStep) dispatch(setStep(step));
            }}
          />

          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="grid lg:grid-cols-3 gap-8">

              {/* LEFT */}
              <div className="lg:col-span-2">

                <AnimatePresence mode="wait">

                  {currentStep === 1 && (
                    <>
                      <PersonalInfoStep />
                      <ShippingStep shippingCost={shippingCost} />
                    </>
                  )}

                  {currentStep === 2 && (
                    <PaymentStep />
                  )}

                  {currentStep === 3 && (
                    <ReviewStep
                      shippingCost={shippingCost}
                      tax={tax}
                      orderTotal={orderTotal}
                    />
                  )}

                </AnimatePresence>

              </div>

              {/* RIGHT */}
              <OrderSummary  />

            </div>

            <CheckoutNavigation
              currentStep={currentStep}
              totalSteps={3}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              isSubmitting={isSubmitting}
              onBackToCart={() => router.push('/cart')}
            />

          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default CheckoutPage;