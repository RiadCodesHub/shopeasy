'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/lib/store/hooks';
import { fetchProducts } from '@/src/lib/store/slices/productSlice';
import ProductCard from '@/app/products/ProductCard';
import Pagination from '../pagination';



export default function ProductGrid() {
  const dispatch = useAppDispatch();
  const { filteredProducts, status, error,
        productPerPage, currentPage
          } = useAppSelector((state) => state.products);

 const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

  const startIndex = (currentPage - 1) * productPerPage;
  const endIndex = startIndex + productPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
  

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if(filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your filters or search terms
        </p>
        </div>
    );
  }

  

  return (
<div>
<div className={`grid gap-6 ${
                isMobile 
                    ? 'grid-cols-1' 
                    : productPerPage === 30 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
{paginatedProducts.map((product, index) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        index={index} 
                    />
                ))}
            </div>
<Pagination />
  </div>
  );
}