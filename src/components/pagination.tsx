'use client'

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import {
    setCurrentPage,
    setProductPerPage,
    goToNextPage,
    goToPrevPage
} from '@/src/lib/store/slices/productSlice';
import { ChevronLeft, ChevronRight, Grid3x3, List } from 'lucide-react';
import {motion} from 'framer-motion';
import { checkPrime } from "crypto";
import { div } from "framer-motion/client";



const Pagination = () => {
    const dispatch = useAppDispatch();
    const {
        currentPage,
        totalPages,
        productPerPage,
        filteredProducts} = useAppSelector((state) => state.products);
   const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
    const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        
        if(mobile && productPerPage !== 10) {
            dispatch(setProductPerPage(10))
        } else if( !mobile && productPerPage === 10) {
            dispatch(setProductPerPage(20));
        }
    }
checkMobile();
window.addEventListener('resize', checkMobile);
return () => window.removeEventListener('resize', checkMobile);
},
[dispatch, productPerPage]
);

const startIndex = (currentPage - 1) * productPerPage;
const endIndex = startIndex + productPerPage;
const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

if(totalPages <= 1) {
    return null;
}

const handlePageChange = (page : number) => {
  if(page >= 1 && page <= totalPages) {
    dispatch(setCurrentPage(page));
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
};

const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    if(totalPages <= maxVisiblePages) {
        for(let i = 1; i <= totalPages; i++) pages.push(i);

    } else {
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        if(end - start + 1 < maxVisiblePages) {
            start = end - maxVisiblePages + 1;
        }

        if(start > 1) pages.push(1, '...');
        for(let i = start; i <= end; i++) pages.push(i);
        if(end < totalPages) pages.push('...', totalPages);
    }
    return pages;
};

return (
    <div className="mt-8">
        {/*page info */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        {/*items per page */}
       <div className="flex itens-center gap-3">
         <span className="text-sm text-gray-600 dark:text-gray-400">
            Items per Page:
         </span>
         <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
            onClick={() => dispatch(setProductPerPage(10))}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                productPerPage === 10 ? 'bg-white dark:bg-gray-700 shadow' :
                                        'hover:bg-white/50 dark:hover:bg-gray-700/50'
            } `}
            >10</button>
            
            <button
              onClick={() => dispatch(setProductPerPage(20))}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                 productPerPage === 20
                     ? 'bg-white dark:bg-gray-700 shadow'
                                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            20
                        </button>

             <button
                            onClick={() => dispatch(setProductPerPage(30))}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                productPerPage === 30
                                    ? 'bg-white dark:bg-gray-700 shadow'
                                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            30
                        </button>
         </div>
       </div>
        </div>
    {/* pagination Controls*/}
    <div className="flex items-center justify-center gap-2">
        <motion.button
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.05}}
        onClick={() => dispatch(goToPrevPage())}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-all ${
                        currentPage === 1
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
        >
              <ChevronLeft className="h-5 w-5" />
        </motion.button>

    <div className="flex items-center gap-1">
  {getPageNumbers().map((page, index) =>(
    <motion.button key={index}
     whileHover={{ scale: 1.05}}
     whileTap={{ scale: 0.95}}
     onClick={() => typeof page === 'number' && handlePageChange(page)}
      className={`min-w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                page === currentPage
                                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : page === '...'
                                    ? 'text-gray-500 dark:text-gray-400 cursor-default'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                            disabled={page === '...'}
     >
   {page}
    </motion.button>
  ) )}
    </div>
    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch(goToNextPage())}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all ${
                        currentPage === totalPages
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <ChevronRight className="h-5 w-5" />
                </motion.button>
    </div>

    {/* page navigation text */}

    <div className="text-center mt-4">
        Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
    </div>
    </div>
);
};

export default Pagination