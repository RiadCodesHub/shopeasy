'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  CreditCard, 
  Truck, 
  Shield,
  CheckCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Package,
  Clock,
  ArrowRight,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/src/lib/store/hooks';
import { clearCart } from '@/src/lib/store/slices/cartSlice';
import Link from 'next/link';

const CheckoutPage = () => {
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
    
    // Billing Information
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    
    // Payment Information
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    
    // Order Notes
    notes: '',
    
    // Terms
    acceptTerms: false,
    subscribeNewsletter: true
  });

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // If "same as shipping" is checked, copy shipping address to billing
    if (name === 'sameAsShipping' && (e.target as HTMLInputElement).checked) {
      setFormData(prev => ({
        ...prev,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingState: prev.state,
        billingZipCode: prev.zipCode
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle order submission
      console.log('Order submitted:', formData);
      setOrderPlaced(true);
      dispatch(clearCart());
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: <Truck className="h-5 w-5" />, description: 'Enter delivery details' },
    { number: 2, title: 'Payment', icon: <CreditCard className="h-5 w-5" />, description: 'Select payment method' },
    { number: 3, title: 'Review', icon: <CheckCircle className="h-5 w-5" />, description: 'Confirm your order' },
  ];

  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'paypal', name: 'PayPal', icon: 'PP' },
    { id: 'apple-pay', name: 'Apple Pay', icon: 'AP' },
    { id: 'google-pay', name: 'Google Pay', icon: 'GP' },
  ];

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Package className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
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
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your purchase. Your order #SHOP-{Date.now().toString().slice(-8)} has been placed successfully.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-blue-500" />
              <p className="font-medium">Estimated delivery: 3-5 business days</p>
            </div>
            <p className="text-sm text-gray-500">
              You will receive an email confirmation shortly with tracking details.
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
            
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex flex-col items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 dark:border-gray-700 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number 
                      ? 'text-blue-600' 
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 mx-4 ${
                    currentStep > step.number 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <MapPin className="h-6 w-6 text-blue-500" />
                      Shipping Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Shipping Method
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="standard"
                              defaultChecked
                              className="h-4 w-4 text-blue-600"
                            />
                            <Truck className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Standard Shipping</p>
                              <p className="text-sm text-gray-500">3-5 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold">
                            {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                          </span>
                        </label>
                        
                        <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="express"
                              className="h-4 w-4 text-blue-600"
                            />
                            <Truck className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Express Shipping</p>
                              <p className="text-sm text-gray-500">1-2 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold">$14.99</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-blue-500" />
                      Payment Method
                    </h2>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              paymentMethod === method.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {typeof method.icon === 'string' ? (
                              <div className="text-lg font-semibold">{method.icon}</div>
                            ) : (
                              method.icon
                            )}
                            <p className="mt-2 text-sm font-medium">{method.name}</p>
                          </button>
                        ))}
                      </div>
                      
                      {/* Credit Card Form */}
                      {paymentMethod === 'credit-card' && (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Card Number *
                            </label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                required
                                placeholder="1234 5678 9012 3456"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Name on Card *
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                required
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Expiry Date *
                              </label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                  type="text"
                                  name="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={handleInputChange}
                                  required
                                  placeholder="MM/YY"
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CVV *
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                  type="text"
                                  name="cvv"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  required
                                  placeholder="123"
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="saveCard"
                              checked={formData.saveCard}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Save card for future purchases
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                    
                    {/* Billing Address */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Billing Address
                        </h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="sameAsShipping"
                            checked={formData.sameAsShipping}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Same as shipping address
                          </span>
                        </label>
                      </div>
                      
                      {!formData.sameAsShipping && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Billing Address *
                            </label>
                            <input
                              type="text"
                              name="billingAddress"
                              value={formData.billingAddress}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="billingCity"
                              value={formData.billingCity}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              name="billingState"
                              value={formData.billingState}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              name="billingZipCode"
                              value={formData.billingZipCode}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      Review Your Order
                    </h2>
                    
                    {/* Order Summary */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Order Items ({items.length})
                      </h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </h4>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-gray-500 text-sm">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                                <p className="font-semibold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Shipping & Billing Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Shipping Information
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                          <p className="text-gray-600 dark:text-gray-400">{formData.address}</p>
                          {formData.apartment && (
                            <p className="text-gray-600 dark:text-gray-400">{formData.apartment}</p>
                          )}
                          <p className="text-gray-600 dark:text-gray-400">
                            {formData.city}, {formData.state} {formData.zipCode}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">{formData.country}</p>
                          <p className="text-gray-600 dark:text-gray-400 mt-2">{formData.phone}</p>
                          <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Payment Method
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <p className="font-medium">Credit Card</p>
                          </div>
                          {formData.cardNumber && (
                            <p className="text-gray-600 dark:text-gray-400">
                              •••• {formData.cardNumber.slice(-4)}
                            </p>
                          )}
                          <p className="text-gray-600 dark:text-gray-400">
                            {formData.cardName}
                          </p>
                          {formData.expiryDate && (
                            <p className="text-gray-600 dark:text-gray-400">
                              Expires: {formData.expiryDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Notes */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Special instructions for delivery..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 resize-none"
                      />
                    </div>
                    
                    {/* Terms */}
                    <div className="mb-6">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          required
                          className="h-4 w-4 mt-1 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          I agree to the{' '}
                          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                          </Link>{' '}
                          and understand that my order is subject to availability and confirmation.
                        </span>
                      </label>
                      
                      <label className="flex items-start mt-4">
                        <input
                          type="checkbox"
                          name="subscribeNewsletter"
                          checked={formData.subscribeNewsletter}
                          onChange={handleInputChange}
                          className="h-4 w-4 mt-1 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Subscribe to our newsletter for updates and exclusive offers
                        </span>
                      </label>
                    </div>
                    
                    {/* Security Notice */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-400">
                            Secure Checkout
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-500">
                            Your payment is encrypted and secure. We never store your credit card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Back
                  </motion.button>
                )}
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ml-auto flex items-center gap-2 px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all font-bold"
                >
                  {currentStep === 3 ? (
                    <>
                      Place Order
                      <Lock className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Order Summary
                  </h3>
                  
                  {/* Order Items Preview */}
                  <div className="mb-6">
                    <div className="space-y-4">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      
                      {items.length > 3 && (
                        <div className="text-center text-sm text-gray-500">
                          +{items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">${orderTotal.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Including ${tax.toFixed(2)} in taxes
                      </p>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  {/* Need Help */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      Need help?{' '}
                      <a href="#" className="font-medium underline">Contact our support team</a>{' '}
                      or call 1-800-SHOPEASY
                    </p>
                  </div>
                  
                  {/* Return Policy */}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        30-Day Return Policy
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Easy returns within 30 days of delivery. Some restrictions apply.
                    </p>
                  </div>
                </div>
                
                {/* Back to Cart */}
                <div className="mt-4 text-center">
                  <Link
                    href="/cart"
                    className="text-blue-600 hover:text-blue-500 font-medium flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;