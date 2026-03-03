import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CheckoutFormData } from '@/src/components/checkout/schemas/checkout';

interface FormState {
    currentStep: number;
    formData: CheckoutFormData;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isSubmitted: boolean;
    orderId?: string;
}

const initialState: FormState = {
    currentStep: 1,
    formData: {
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
                country: "Bangladesh",
            },
            shippingMethod: 'standard',
            deliveryInstructions: ''
        },
        billing: undefined,
        payment: {
            paymentMethod: 'credit-card',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            saveCard: false
        },
        useShippingAsBilling: true,
        agreeToTerms: false
    },
    errors: {},
    isSubmitting: false,
    isSubmitted: false,
    orderId: undefined
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        updateFormData: (state, action: PayloadAction<Partial<CheckoutFormData>>) => {
            state.formData = { ...state.formData, ...action.payload };
            // If "same as shipping" is checked, copy shipping to billing
            if (state.formData.useShippingAsBilling && state.formData.shipping?.address) {
                state.formData.billing = { ...state.formData.shipping.address };
            }
        },

        

        toggleSameAsShipping: (state, action: PayloadAction<boolean>) => {
            state.formData.useShippingAsBilling = action.payload;
            if (action.payload && state.formData.shipping?.address) {
                state.formData.billing = { ...state.formData.shipping.address };
            } else {
                state.formData.billing = undefined;
            }
        },

        nextStep: (state) => {
            if (state.currentStep < 4) {
                state.currentStep += 1;
            }
        },

        prevStep: (state) => {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
            }
        },

        setStep: (state, action: PayloadAction<number>) => {
            if (action.payload >= 1 && action.payload <= 4) {
                state.currentStep = action.payload;
            }
        },

        setErrors: (state, action: PayloadAction<Record<string, string>>) => {
            state.errors = action.payload;
        },

        clearErrors: (state) => {
            state.errors = {};
        },

        setSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },

        submissionSuccess: (state, action: PayloadAction<string>) => {
            state.isSubmitting = false;
            state.isSubmitted = true;
            state.orderId = action.payload;
            state.currentStep = 1;
        },

        submissionFailed: (state, action: PayloadAction<string>) => {
            state.isSubmitting = false;
            state.errors.submission = action.payload;
        },

        setSubmitted: (state, action: PayloadAction<boolean>) => {
            state.isSubmitted = action.payload;
        },

        resetForm: () => {
            return initialState;
        },

        initializeFromCart: (state, action: PayloadAction<{
            email?: string;
            items: any[]
        }>) => {
            if (action.payload.email) {
                state.formData.personalInfo.email = action.payload.email;
            }
        }
    }
});

export const {
    updateFormData,
    toggleSameAsShipping,
    nextStep,
    prevStep,
    setStep,
    setErrors,
    clearErrors,
    setSubmitting,
    submissionSuccess,
    submissionFailed,
    setSubmitted,
    resetForm,
    initializeFromCart
} = formSlice.actions;

export default formSlice.reducer;