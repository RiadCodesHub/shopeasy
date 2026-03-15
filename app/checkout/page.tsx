// app/checkout/page.tsx
'use client';

import { useEffect } from 'react';
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
  resetForm ,
  setSubmitting
} from '@/lib/store/slices/formSlice';
import { useRouter } from 'next/navigation'; 
import PersonalInfoStep from '@/components/checkout/steps/PersonalInfoStep';
import { checkoutSchema, type CheckoutFormData } from '@/components/checkout/schemas/checkout';
import ShippingStep from '@/components/checkout/steps/ShippingStep';
import PaymentStep from '@/components/checkout/steps/PaymentStep';
import ReviewStep from '@/components/checkout/steps/ReviewStep';
import OrderSummary from '@/components/checkout/OrderSummary';
import CheckoutNavigation from '@/components/checkout/CheckoutNavigation';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import { useSession } from 'next-auth/react'; 


const CheckoutPage = () => {
  const router = useRouter(); 
  const dispatch = useAppDispatch();
  
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const { currentStep, formData, isSubmitted, isSubmitting, orderId } = useAppSelector((state) => state.form);
  
  const {data: sesson, status} = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = !!sesson;
  const user = sesson?.user;

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema) as any ,
    mode: 'onChange',
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: user?.email || '',
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
      billing: undefined,
      useShippingAsBilling: true,
      agreeToTerms: true,
    },
  });

  const { handleSubmit, trigger, formState: {isValid, errors}, watch, setValue } = methods;
  
  useEffect(() => {
  if(user?.email) {
    setValue('personalInfo.email', user.email)
  }

}, [user, setValue]);

 useEffect(() => {
  if(isLoading) return;

  if(!isAuthenticated) {
    router.push(`/auth/login?returnUrl=${encodeURIComponent('/checkout')}`)
    return;
  }

  if(items.length === 0 && !isSubmitted) {
    router.push('/cart');
  }
 }, [isAuthenticated, isLoading, items, isSubmitted, router]);

 if(isLoading) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
  )
 }

 if(!isAuthenticated) {
  return null;
 }

 if(items.length === 0 && !isSubmitted) {
  return null;
 }

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingCost + tax;

  //step vaidation function
  const validationStep = async( step: number) => {
    if(step === 1) {
       return await trigger([
        'personalInfo.firstName',
        'personalInfo.lastName',
        'personalInfo.email',
        'personalInfo.phone',
        'shipping.address.street',
        'shipping.address.city',
        'shipping.address.state',
        'shipping.address.zipCode',
        'shipping.address.country',
        'shipping.shippingMethod'
       ]); }
       

    if(step === 2) {
       const paymentMethod = watch('payment.paymentMethod');
       if(paymentMethod === 'credit-card') {
        return await trigger(['payment.cardNumber', 'payment.cvv', 'payment.expiryDate'])
       }
       return true;
      }

      if(step === 3) {
        return await trigger(['agreeToTerms']);
      }
    
        return false;

    }

   const handleNextStep = async () => {
    const isValidStep = await validationStep(currentStep);
    if(!isValidStep) {
      console.log('Step validation failed:', errors);
      return
    }
    
    if (currentStep < 3) {
      dispatch(nextStep());
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
       dispatch(setSubmitting(true));
      
      const orderPayload = {
        ...data,
        userId : user?.id,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totals: {
          subtotal: totalPrice,
          shipping: shippingCost,
          tax,
          total: orderTotal,
        }
      };

      console.log('Order submitted:', orderPayload);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newOrderId = `SHOP-${Date.now().toString().slice(-8)}`;

      dispatch(submissionSuccess(newOrderId));
      dispatch(clearCart());
    } catch (error) {
      console.error('Order submission error:', error);
    }
  };

  const handleBackToCart = () => {
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    dispatch(resetForm());
    router.push('/');
  };

  if (isSubmitted) {
    return (
      <OrderConfirmation
        orderId={orderId}
        onContinueShopping={handleContinueShopping}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Information', icon: '📦', description: 'Enter personal & shipping details' },
    { number: 2, title: 'Payment', icon: '💳', description: 'Select payment method' },
    { number: 3, title: 'Review', icon: '✓', description: 'Confirm your order' },
  ];

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <CheckoutProgress 
            steps={steps} 
            currentStep={currentStep}
            onStepClick={(step) => {
              if(step <= currentStep) {
              dispatch(setStep(step));
            }}
          }
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form Steps */}
              <div className="lg:col-span-2 space-y-8">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <>
                    <PersonalInfoStep
                       key='personalInfo'
                       />
                    <ShippingStep 
                      key="shipping"
                      shippingCost={shippingCost}
                    />
                    </>
                  )}
                  
                  {currentStep === 2 && (
                    <PaymentStep key="payment" />
                  )}
                  
                  {currentStep === 3 && (
                    <ReviewStep 
                      key="review"
                      shippingCost={shippingCost}
                      tax={tax}
                      orderTotal={orderTotal}
                    />
                  )}
                </AnimatePresence>

                <CheckoutNavigation
                  currentStep={currentStep}
                  totalSteps={3}
                  onNext={handleNextStep}
                  onPrev={() => dispatch(prevStep())}
                  isSubmitting={isSubmitting}
                  onBackToCart={handleBackToCart}
                />
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default CheckoutPage;