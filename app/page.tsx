'use client';

import { useEffect } from "react";
import {motion} from 'framer-motion';
import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { fetchProducts } from '@/src/lib/store/slices/productSlice';
import ProductGrid from "@/src/components/products/ProductGrid";
import HeroSection from "@/src/components/layouts/HeroSection";
import CategoryFilter from "@/app/products/CategoryFilter";



export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, status, filteredProducts } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if(status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [status, dispatch]);

  return (
    <div className="space-y-12">
      <HeroSection />
    {/*Category Filter*/}
      <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{ duration: 0.5, delay: 0.2}}
      >
        <CategoryFilter />
      </motion.div>

      <section>
        <div className="flex justify-between items-center mb-8">
          <motion.div
          initial={{ opacity: 0, x: -20}}
          animate={{ opacity: 1, x: 0}}
          transition={{ duration: 0.5}}
          >
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover our most popular items
            </p>

          </motion.div>
      
        </div>
       {status === 'loading' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : status === 'failed' ? (
          <div className="text-center py-12">
            <p className="text-red-500">Fasiled to load products</p>
          </div>
        ) : (
          <ProductGrid  /> 
        )}
      </section>

    <motion.div
     initial={{ opacity: 0, scale: 0.95}}
     animate= {{ opacity: 1, scale: 1}}
     transition={{ duration: 0.5 }}
     className="relative rounded-2xl overflow-hidden bg-linear-to-r from-primary to-accent p-8"
    >
  <div className="relative z-10 text-white">
    <h3 className="text-2xl font-bold mb-2">Summer Sale!</h3>
    <p className="mb-4">Up to 50% off on selected items</p>
    <button className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
      Shop Now
    </button>
  </div>
  <div className="absolute right-0 top-0 bottom-0 w-1/3">
          <div className="absolute inset-0 bg-gradient-to-left from-transparent to-primary/50" />
        </div>
    </motion.div>
    </div>
  )
}