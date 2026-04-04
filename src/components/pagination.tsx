'use client';

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import {
  setCurrentPage,
  setProductPerPage,
  goToNextPage,
  goToPrevPage
} from '@/lib/store/slices/productSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Pagination = () => {
  const dispatch = useAppDispatch();
  const {
    currentPage,
    totalPages,
    productPerPage
  } = useAppSelector((state) => state.products);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile && productPerPage !== 10) {
        dispatch(setProductPerPage(10));
      } else if (!mobile && productPerPage === 10) {
        dispatch(setProductPerPage(20));
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch, productPerPage]);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = end - maxVisiblePages + 1;
      }

      if (start > 1) pages.push(1, '...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) pages.push('...', totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-8">

      {/* Items per page */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">

          <span className="text-sm text-(--foreground-secondary)">
            Items per page:
          </span>

          <div className="flex rounded-lg p-1 bg-(--background-tertiary) border border-(--border)">
            {[10, 20, 30].map((num) => (
              <button
                key={num}
                onClick={() => dispatch(setProductPerPage(num))}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium transition-all
                  ${
                    productPerPage === num
                      ? 'bg-(--background) shadow text-(--foreground)'
                      : 'text-(--foreground-secondary) hover:bg-(--background)/50'
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2">

        {/* Prev */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(goToPrevPage())}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg transition-all
            ${
              currentPage === 1
                ? 'text-(--foreground-tertiary) cursor-not-allowed'
                : 'nav-link hover:bg-(--background-tertiary)'
            }
          `}
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        {/* Pages */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              className={`
                min-w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${
                  page === currentPage
                    ? 'bg-primary text-white shadow'
                    : page === '...'
                    ? 'text-(--foreground-tertiary) cursor-default'
                    : 'nav-link hover:bg-(--background-tertiary)'
                }
              `}
            >
              {page}
            </motion.button>
          ))}
        </div>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(goToNextPage())}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg transition-all
            ${
              currentPage === totalPages
                ? 'text-(--foreground-tertiary) cursor-not-allowed'
                : 'nav-link hover:bg-(--background-tertiary)'
            }
          `}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>

      </div>

      {/* Page Info */}
      <div className="text-center mt-4 text-(--foreground-secondary)">
        Page <span className="font-semibold text-(--foreground)">{currentPage}</span> of{' '}
        <span className="font-semibold text-(--foreground)">{totalPages}</span>
      </div>

    </div>
  );
};

export default Pagination;