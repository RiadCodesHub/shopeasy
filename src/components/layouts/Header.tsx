'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Search,
  User
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/src/lib/store/hooks';
import { toggleCart } from '@/src/lib/store/slices/cartSlice';
import { toggleMobileMenu } from '@/src/lib/store/slices/uiSlice';
import { searchProducts } from '@/src/lib/store/slices/productSlice';
import CartSidebar from '@/src/components/cart/CartSidebar';
import Link from 'next/link';
import { button } from 'framer-motion/client';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const { totalQuantity } = useAppSelector((state) => state.cart);
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
   dispatch(searchProducts(searchQuery));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  }

  const removeQuery = () => {
    setSearchQuery('');
  dispatch(searchProducts(''));
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="text-2xl font-bold text-primary">
                Shop<span className="text-accent">Easy</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/deals" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                Deals
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-4 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                />
                <motion.button
                initial={{scale: 1}}
                whileHover={{scale:1.10}}
                whileTap={{scale: 1.25}}
                 className='absolute right-3 top-2.5 '
                >
                  <Search className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </motion.button>
                
                {searchQuery && (
                  <button className="absolute rigt-4 top-2.5"
                         onClick={removeQuery}
                  >
                     <X className="h-5 w-5 text-gray-500 hover:text-gray-600" />
                  </button>
                )}
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <User className="h-6 w-6" />
              </button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalQuantity > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalQuantity}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => dispatch(toggleMobileMenu())}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  <Link 
                    href="/" 
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    onClick={() => dispatch(toggleMobileMenu())}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/products" 
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    onClick={() => dispatch(toggleMobileMenu())}
                  >
                    Products
                  </Link>
                  <Link 
                    href="/categories" 
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    onClick={() => dispatch(toggleMobileMenu())}
                  >
                    Categories
                  </Link>
                  <Link 
                    href="/deals" 
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    onClick={() => dispatch(toggleMobileMenu())}
                  >
                    Deals
                  </Link>
                  <Link 
                    href="/account" 
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    onClick={() => dispatch(toggleMobileMenu())}
                  >
                    Account
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default Header;