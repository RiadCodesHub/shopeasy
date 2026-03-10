'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { 
  toggleCart, 
  removeFromCart, 
  removeItemCompletely,
  addToCart,
  clearCart 
} from '@/lib/store/slices/cartSlice';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const CartSidebar = () => {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalPrice, isCartOpen } = useAppSelector(
    (state) => state.cart
  );
  const { data: session } = useSession();

  const handleClose = () => {
    dispatch(toggleCart());
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      handleClose();
    }
  };

  // Determine checkout URL based on auth state
  const checkoutUrl = session ? '/checkout' : '/auth/login?returnUrl=/checkout';

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6" />
                <h2 className="text-xl font-semibold">
                  Shopping Cart ({totalQuantity})
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Your cart is empty
                  </p>
                  <Link
                    href="/"
                    onClick={handleClose}
                    className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {/* Product Image - Link */}
                      <Link 
                        href={`/products/${item.id}`}
                        onClick={handleClose}
                        className="shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </Link>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.id}`}
                          onClick={handleClose}
                          className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => dispatch(addToCart(item))}
                          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => dispatch(removeItemCompletely(item.id))}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t dark:border-gray-800 p-6 space-y-4"
              >
                {/* Total */}
                <div className="flex justify-between text-lg">
                  <span>Total:</span>
                  <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Auth Status Message */}
                {!session && (
                  <p className="text-xs text-center text-amber-600 dark:text-amber-400">
                    ⚠️ You'll need to login before checkout
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href="/cart"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center font-medium"
                  >
                    View Cart
                  </Link>
                  
                  <Link
                    href={checkoutUrl}
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium flex items-center justify-center gap-2"
                  >
                    Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>

                {/* Clear Cart */}
                <button
                  onClick={handleClearCart}
                  className="w-full text-center text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;