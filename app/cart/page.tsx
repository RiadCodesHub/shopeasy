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
  const { data: session } = useSession();
  const { items, totalQuantity, totalPrice } = useAppSelector((state) => state.cart);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    if (items.length > 0) {
      if (session) {
        router.push('/checkout');
      } else {
        router.push('/auth/login?returnUrl=/checkout');
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-(--background)">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-10 bg-(--background-secondary)shadow-sm border-b border-(--border)">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-(--foreground-secondary)">
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
              <h1 className="text-lg font-bold text-text">Cart</h1>
              <div className="w-10"></div>
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
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
            
            <h1 className="text-2xl font-bold text-text mb-3">
              Your cart is empty
            </h1>
            
            <p className="text-(--foreground-secondary) mb-8 px-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            
            <div className="flex flex-col gap-3 px-4">
              <Link
                href="/"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Home className="h-5 w-5" />
                Continue Shopping
              </Link>
              
              <Link
                href="/deals"
                className="btn-secondary inline-flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-(--background)">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-20 bg-(--background-secondary)shadow-sm border-b border-(--border)">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-(--foreground-secondary)">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-bold text-text">Shopping Cart</h1>
              <p className="text-xs text- (--foreground-tertiary)">{totalQuantity} items</p>
            </div>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-error text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-(--background-secondary) border-t border-(--border) shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text- (--foreground-tertiary)">Total</p>
              <p className="text-xl font-bold text-text">
                ${orderTotal.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMobileSummary(!showMobileSummary)}
                className="btn-secondary text-sm py-2"
              >
                Details
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="btn-primary text-sm py-2"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Order Summary Modal */}
      {showMobileSummary && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-(--background-secondary)rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto border-t border-(--border)"
          >
            <div className="sticky top-0 bg-(--background-secondary)border-b border-(--border) px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text">Order Summary</h3>
                <button
                  onClick={() => setShowMobileSummary(false)}
                  className="p-2 hover:bg-(--background-tertiary) rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-(--foreground-secondary)" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-(--foreground-secondary)">Subtotal</span>
                <span className="font-medium text-text">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--foreground-secondary)">Shipping</span>
                <span className="font-medium text-text">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--foreground-secondary)">Tax</span>
                <span className="font-medium text-text">${tax.toFixed(2)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-text">Total</span>
                <span className="text-primary">${orderTotal.toFixed(2)}</span>
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
              <div className="p-3 bg-primary text-white rounded-xl">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text">
                  Shopping Cart
                </h1>
                <p className="text-text">
                  {totalQuantity} item{totalQuantity !== 1 ? 's' : ''} in your cart
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white">
                    1
                  </div>
                  <span className="font-medium">Cart</span>
                </div>
                <div className="w-12 h-1 bg-bg"></div>
                <div className="flex items-center gap-2 text-text">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-bg-tertiary">
                    2
                  </div>
                  <span className="font-medium">Checkout</span>
                </div>
                <div className="w-12 h-1 bg-(--border)"></div>
                <div className="flex items-center gap-2 text-text">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-bg-tertiary">
                    3
                  </div>
                  <span className="font-medium">Confirmation</span>
                </div>
              </div>
              
              <button
                onClick={() => dispatch(clearCart())}
                className="text-error hover:text-error/80 font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-text mb-4 lg:mb-6">
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
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="flex gap-4">
                        <Link href={`/products/${item.id}`} className="shrink-0">
                          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-bg-tertiary">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        </Link>

                        {/* Product Info - Mobile */}
                        <div className="flex-1 sm:hidden">
                          <Link 
                            href={`/products/${item.id}`}
                            className="font-semibold text-text hover:text-primary mb-1 block text-sm"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-text">
                              ${item.price.toFixed(2)}
                            </p>
                            <button
                              onClick={() => dispatch(removeItemCompletely(item.id))}
                              className="text-error hover:text-error/80"
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
                                className="font-semibold text-text hover:text-primary mb-1 block"
                              >
                                {item.name}
                              </Link>
                              <p className="text- text-sm">
                                Item # {item.id}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-text">
                                ${item.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-text-secondary">
                                ${(item.price * item.quantity).toFixed(2)} total
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-border rounded-lg">
                                <button
                                  onClick={() => dispatch(removeFromCart(item.id))}
                                  className="p-2 hover:bg-bg-secondary transition-colors"
                                >
                                  <Minus className="h-4 w-4 text-text-secondary" />
                                </button>
                                <span className="w-8 text-center font-medium text-text">
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
                                  className="p-2 hover:bg-bg-tertiary transition-colors"
                                >
                                  <Plus className="h-4 w-4 text-text-secondary" />
                                </button>
                              </div>
                              <button
                                onClick={() => dispatch(removeItemCompletely(item.id))}
                                className="text-error hover:text-error/80 flex items-center gap-1 text-sm transition-colors"
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
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="p-2 hover:bg-bg-tertiary"
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
                            className="p-2 hover:bg-bg-tertiary"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-text-secondary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping - Desktop */}
              <div className="hidden lg:block card">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/"
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Continue Shopping
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="input-field flex-1"
                      />
                      <button className="btn-primary">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Shopping - Mobile */}
              <div className="lg:hidden mt-6">
                <Link
                  href="/"
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <div className="card mb-6">
                  <h2 className="text-xl font-bold text-text mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="font-medium text-text">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Shipping</span>
                      <span className="font-medium text-text">
                        {shippingCost === 0 ? (
                          <span className="text-success flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            FREE
                          </span>
                        ) : (
                          '$5.99'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Tax</span>
                      <span className="font-medium text-text">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-text">Total</span>
                      <span className="text-primary">
                        ${orderTotal.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Including ${tax.toFixed(2)} in taxes
                    </p>
                  </div>

                  {/* Security Info */}
                  <div className="mb-6 p-4 bg-success/10 rounded-xl border border-success/20">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium text-success">
                          Secure Checkout
                        </p>
                        <p className="text-sm text-success/80">
                          Your payment is protected
                        </p>
                      </div>
                    </div>
                  </div>

                  {!session && (
                    <div className="mb-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <p className="text-sm text-warning text-center">
                        🔒 You'll need to login before checkout
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToCheckout}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-lg mb-4"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>

                  {/* Payment Methods */}
                  <div className="text-center">
                    <p className="text-sm text-text-secondary mb-2">We accept</p>
                    <div className="flex justify-center gap-3">
                      {['Visa', 'MasterCard', 'PayPal', 'Apple Pay'].map((method) => (
                        <div
                          key={method}
                          className="p-2 bg-(--background-tertiary) rounded-lg"
                        >
                          <CreditCard className="h-6 w-6 text-text-secondary" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-xl shadow-sm border border-(--border)">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-text">Free Shipping</p>
                      <p className="text-sm text-text-secondary">On orders over $50</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-xl shadow-sm border border-(--border)">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-text">30-Day Returns</p>
                      <p className="text-sm text-text-secondary">Easy returns policy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-xl shadow-sm border border-(--border)">
                    <Package className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-text">Secure Packaging</p>
                      <p className="text-sm text-text-secondary">Items arrive safely</p>
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