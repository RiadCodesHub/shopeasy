import {  z } from 'zod';

export const addressSchema = z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "city is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(3, "Invalid ZIP code"),
    country: z.string().min(1, "Country is required")
});

export const personalSchema = z.object({
    firstName : z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("invalid email address"),
    phone: z.string().regex(/^\d{11}$/, "Phone must be 11 digits")
});

export const shippingSchema = z.object({
    address: addressSchema,
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  deliveryInstructions: z.string().optional()
});

export const paymentSchema = z.object({
    paymentMethod: z.enum(['credit-card', 'paypal', 'apple-pay']),
    cardNumber: z.string().optional(),
     expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  saveCard: z.boolean().default(false)
}).superRefine((data, ctx) => {
  if(data.paymentMethod === 'credit-card') {
    if(!data.cardNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cradit number is required',
        path:['cardNumber'],
      });
    }

    if(!data.expiryDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expiry date is required',
        path:['expiryDate'],
      });
    }

    if(!data.cvv) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'cvv is required',
        path:['cvv'],
      });
    }
  }
})

export const checkoutSchema = z.object({
  personalInfo: personalSchema,
  shipping: shippingSchema,
  billing: addressSchema.optional(),
  payment: paymentSchema,
  useShippingAsBilling: z.boolean().default(true),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })

})

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type PersonalInfoData = z.infer<typeof personalSchema>;
export type ShippingData = z.infer<typeof shippingSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type AddressData = z.infer<typeof addressSchema>; 


