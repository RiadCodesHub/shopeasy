// components/layout/Header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Search,
  User,
  LogOut,
  Settings,
  Package,
  Heart,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { toggleCart } from '@/lib/store/slices/cartSlice';
import { toggleMobileMenu } from '@/lib/store/slices/uiSlice';
import { searchProducts } from '@/lib/store/slices/productSlice';
import CartSidebar from '@/components/cart/CartSidebar';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Get auth session
  const { data: session, status } = useSession();
  
  const { totalQuantity } = useAppSelector((state) => state.cart);
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchProducts(searchQuery));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const removeQuery = () => {
    setSearchQuery('');
    dispatch(searchProducts(''));
  };

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleProfileClick = () => {
    if (!session) {
      router.push('/auth/login');
    } else {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    }
  };

  // Menu items for authenticated users
  const profileMenuItems = [
    { href: '/profile', icon: <User className="h-4 w-4" />, label: 'My Profile' },
    { href: '/orders', icon: <Package className="h-4 w-4" />, label: 'My Orders' },
    { href: '/wishlist', icon: <Heart className="h-4 w-4" />, label: 'Wishlist' },
    { href: '/', icon: <Settings className="h-4 w-4" />, label: 'Settings' },
  ];

  // Admin only menu item
  const adminMenuItem = { 
    href: '/admin/dashboard', 
    icon: <Shield className="h-4 w-4" />, 
    label: 'Admin Dashboard' 
  };

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
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
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
                  className="w-full px-4 py-2 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                />
                <motion.button
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.10 }}
                  whileTap={{ scale: 1.25 }}
                  type="submit"
                  className="absolute right-8 top-2.5"
                >
                  <Search className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </motion.button>
                
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={removeQuery}
                    className="absolute right-2 top-2.5"
                  >
                    <X className="h-5 w-5 text-gray-500 hover:text-gray-600" />
                  </button>
                )}
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {session?.user?.image ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <User className="h-6 w-6" />
                      {status === 'authenticated' && (
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                  )}
                  
                  {session && (
                    <>
                      <span className="hidden md:block text-sm font-medium max-w-25 truncate">
                        {session.user?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className={`hidden md:block h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </motion.button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isProfileMenuOpen && session && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-b">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {session.user?.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {session.user?.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Role: {session.user?.role}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ))}

                        {/* Admin Dashboard (only for admin) */}
                        {session.user?.role === 'admin' && (
                          <Link
                            href={adminMenuItem.href}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors mt-1"
                          >
                            {adminMenuItem.icon}
                            <span className="font-medium">{adminMenuItem.label}</span>
                          </Link>
                        )}

                        {/* Sign Out */}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-2 border-t pt-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Button */}
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
              {searchQuery && (
                <button
                  type="button"
                  onClick={removeQuery}
                  className="absolute right-3 top-2.5"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
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
                    href="/" 
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    onClick={() => dispatch(toggleMobileMenu())}
                  >
                    Deals
                  </Link>
                  
                  {/* Mobile Profile Links */}
                  {session ? (
                    <>
                      <div className="border-t pt-4 mt-2">
                        <p className="text-sm text-gray-500 mb-2">Account</p>
                        <Link 
                          href="/profile" 
                          className="flex items-center gap-2 py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                          onClick={() => dispatch(toggleMobileMenu())}
                        >
                          <User className="h-5 w-5" />
                          My Profile
                        </Link>
                        <Link 
                          href="/orders" 
                          className="flex items-center gap-2 py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                          onClick={() => dispatch(toggleMobileMenu())}
                        >
                          <Package className="h-5 w-5" />
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            dispatch(toggleMobileMenu());
                          }}
                          className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 transition-colors w-full text-left"
                        >
                          <LogOut className="h-5 w-5" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link 
                      href="/auth/login" 
                      className="flex items-center gap-2 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                      onClick={() => dispatch(toggleMobileMenu())}
                    >
                      <User className="h-5 w-5" />
                      Sign In / Register
                    </Link>
                  )}
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