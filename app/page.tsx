'use client';

import { useEffect } from "react";
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from '@/lib/store/slices/productSlice';
import ProductGrid from "@/components/products/ProductGrid";
import HeroSection from "@/components/layouts/HeroSection";
import CategoryFilter from "./products/CategoryFilter";
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, status, filteredProducts } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="space-y-12 pb-12">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container mx-auto px-4"
        >
          <CategoryFilter />
        </motion.div>

        {/* Featured Products Section */}
        <section className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-text">
                  Featured Products
                </h2>
              </div>
              <p className="text-text-secondary">
                Discover our most popular items
              </p>
            </motion.div>
            
            <Link 
              href="/products"
              className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Loading State */}
          {status === 'loading' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4).map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-bg-tertiary rounded-xl animate-pulse"
                />
              ))]}
            </div>
          ) : status === 'failed' ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
                <svg className="h-12 w-12 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-error font-medium mb-2">Failed to load products</p>
              <p className="text-text-secondary mb-4">Please try again later</p>
              <button 
                onClick={() => dispatch(fetchProducts())}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          ) : (
            <ProductGrid />
          )}
        </section>

        {/* Summer Sale Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient shadow-xl">
            <div className="relative z-10 p-8 md:p-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Limited Time Offer
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Summer Sale!
              </h3>
              <p className="text-white/90 text-lg mb-6 max-w-md">
                Up to 50% off on selected items. Don't miss out on these amazing deals!
              </p>
              
              <Link 
                href="/products?category=sale"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-white/20 to-transparent" />
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
            
            {/* Floating Elements */}
            <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden md:block">
              <div className="text-7xl opacity-20 animate-float">☀️</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}