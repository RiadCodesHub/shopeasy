'use client';

import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ArrowLeft,
  Tag,
  Shield,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  X,
  ChevronLeft,
  Home
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { 
  removeFromCart, 
  removeItemCompletely,
  addToCart,
  clearCart 
} from '@/lib/store/slices/cartSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const CartPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {data : session} = useSession();
  const { items, totalQuantity, totalPrice } = useAppSelector((state) => state.cart);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if(!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleProceedToCheckout = () => {
    if (items.length > 0) {
     if(session) {
      router.push('/checkout');
     } else {
      router.push('/auth/login?returnUrl=/checkout');
     }
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
              <h1 className="text-lg font-bold">Cart</h1>
              <div className="w-10"></div> {/* Spacer for alignment */}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Your cart is empty
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 px-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            
            <div className="flex flex-col gap-3 px-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Home className="h-5 w-5" />
                Continue Shopping
              </Link>
              
              <Link
                href="/deals"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                <Tag className="h-5 w-5" />
                View Deals
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
              <p className="text-xs text-gray-500">{totalQuantity} items</p>
            </div>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-red-600 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-t shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${orderTotal.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMobileSummary(!showMobileSummary)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium"
              >
                Details
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Order Summary Modal */}
      {showMobileSummary && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Order Summary</h3>
                <button
                  onClick={() => setShowMobileSummary(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
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
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-600 text-white rounded-xl">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {totalQuantity} item{totalQuantity !== 1 ? 's' : ''} in your cart
                </p>
              </div>
            </div>

            {/* Progress Bar - Desktop Only */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
                    1
                  </div>
                  <span className="font-medium">Cart</span>
                </div>
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    2
                  </div>
                  <span className="font-medium">Checkout</span>
                </div>
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    3
                  </div>
                  <span className="font-medium">Confirmation</span>
                </div>
              </div>
              
              <button
                onClick={() => dispatch(clearCart())}
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-sm lg:shadow-xl p-4 lg:p-6 mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
                  Cart Items
                </h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                    >
                      {/* Product Image - Mobile Stacked */}
                      <div className="flex gap-4">
                        <Link href={`/products/${item.id}`} className="shrink-0">
                          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        </Link>

                        {/* Product Info - Mobile Stacked */}
                        <div className="flex-1 sm:hidden">
                          <Link 
                            href={`/products/${item.id}`}
                            className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1 block text-sm"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ${item.price.toFixed(2)}
                            </p>
                            <button
                              onClick={() => dispatch(removeItemCompletely(item.id))}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Product Info - Desktop */}
                      <div className="hidden sm:flex flex-1">
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <Link 
                                href={`/products/${item.id}`}
                                className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1 block"
                              >
                                {item.name}
                              </Link>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Item # {item.id}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900 dark:text-white">
                                ${item.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                ${(item.price * item.quantity).toFixed(2)} total
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                                <button
                                  onClick={() => dispatch(removeFromCart(item.id))}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium text-sm lg:text-base">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => dispatch(addToCart({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
                                    quantity: 1
                                  }))}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => dispatch(removeItemCompletely(item.id))}
                                className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden lg:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls - Mobile */}
                      <div className="sm:hidden flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                              quantity: 1,
                            }))}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping & Promo - Desktop Only */}
              <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Continue Shopping
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
                      />
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Shopping - Mobile Only */}
              <div className="lg:hidden mt-6">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Order Summary
                  </h2>

                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            FREE
                          </span>
                        ) : (
                          '$5.99'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-medium">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          ${orderTotal.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Including ${tax.toFixed(2)} in taxes
                      </p>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-400">
                          Secure Checkout
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          Your payment is protected
                        </p>
                      </div>
                    </div>
                  </div>

                  {!session && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-400 text-center">
                        🔒 You'll need to login before checkout
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToCheckout}
                    className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all font-bold text-lg mb-4 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>

                  {/* Payment Methods */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">We accept</p>
                    <div className="flex justify-center gap-3">
                      {['Visa', 'MasterCard', 'PayPal', 'Apple Pay'].map((method) => (
                        <div
                          key={method}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                        >
                          <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <Truck className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-gray-500">On orders over $50</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">30-Day Returns</p>
                      <p className="text-sm text-gray-500">Easy returns policy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <Package className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Secure Packaging</p>
                      <p className="text-sm text-gray-500">Items arrive safely</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add padding bottom for mobile fixed button */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default CartPage;