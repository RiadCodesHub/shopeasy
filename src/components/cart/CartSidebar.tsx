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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CartSidebar = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const { items, totalQuantity, totalPrice, isCartOpen } = cart || {
    items: [], 
    totalQuantity: 0, 
    totalPrice: 0, 
    isCartOpen: false
  };
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    if (isMounted) {
      dispatch(toggleCart());
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      handleClose();
    }
  };

   const handleCheckout = () => {
    handleClose();
    if (session) {
      router.push('/checkout');
    } else {
      router.push('/auth/login?returnUrl=/checkout');
    }
  };


  if (!isMounted) {
    return null;
  }

  const safeItems = items || [];
  const safeTotalQuantity = totalQuantity || 0;
  const safeTotalPrice = totalPrice || 0;

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-bg-secondary shadow-2xl z-50 flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-r from-primary to-accent rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-text">
                  Shopping Cart ({safeTotalQuantity})
                </h2>
              </div>
              <button
                onClick={handleClose}
                className=" btn hover:btn-primary"
              >
                <X className="h-6 w-6 text-text-secondary" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {safeItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-bg-tertiary flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-text" />
                  </div>
                  <p className="text-text mb-4">
                    Your cart is empty
                  </p>
                  <Link
                    href="/"
                    onClick={handleClose}
                    className="btn-primary inline-block btn"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative flex items-center gap-4 p-4 bg-bg-tertiary rounded-lg border border-border"
                    >
                      {/* Product Image */}
                      <Link 
                        href={`/products/${item.id}`}
                        onClick={handleClose}
                        className="shrink-0"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg-secondary">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.id}`}
                          onClick={handleClose}
                          className="font-medium text-text hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-primary font-semibold mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="btn hover:btn-primary"
                        >
                          <Minus className="h-4 w-4 text-text" />
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
                          className="btn hover:btn-primary"
                        >
                          <Plus className="h-4 w-4 text-text" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => dispatch(removeItemCompletely(item.id))}
                        className="text-error hover:bg-error/10 btn"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {safeItems.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-border p-6 space-y-4 bg-bg-secondary"
              >
                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-text">
                    <span>Subtotal</span>
                    <span>${safeTotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="divider"></div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-text">Total:</span>
                    <span className="font-bold text-2xl text-primary">
                      ${safeTotalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Auth Status Message */}
                {!session && (
                  <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <p className="text-xs text-center text-warning">
                      ⚠️ You'll need to login before checkout
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href="/cart"
                    onClick={handleClose}
                    className="flex-1 btn-secondary text-center"
                  >
                    View Cart
                  </Link>
                  
                  <button
                    onClick={handleCheckout}
                    className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                  >
                    Checkout
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Clear Cart */}
                <button
                  onClick={handleClearCart}
                  className="btn w-full text-center text-error hover:text-error/80 text-sm transition-colors"
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