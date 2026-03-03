'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  X, 
  SlidersHorizontal, 
  Search, 
  SortAsc,
  Tag,
  Sparkles,
  Star,
  TrendingUp,
  Clock,
  Zap,

  Percent,
  Flame,
  ShoppingBag
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/src//lib/store/hooks';
import { 
  filterByCategory, 
  filterByPrice,
  searchProducts,
  sortProducts,
  resetFilters 
} from '@/src/lib/store/slices/productSlice';
import { toggleMobileMenu, toggleFilterMenu } from '@/src/lib/store/slices/uiSlice';

const CategoryFilter = () => {
  const dispatch = useAppDispatch();
  const { categories,
         filteredProducts,
         products,
         currentCategory,
         currentPriceRange,
         currentSort } = useAppSelector((state) => state.products);
  const [priceRange, setPriceRange] = useState(currentPriceRange);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  const [activeCategory, setActiveCategory] = useState(currentCategory);
  const [showPriceFilter, setShowPriceFilter] = useState(false);  
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui);
  const { isFilterMenuOpen } = useAppSelector((state) => state.ui);


useEffect(() => {
  setActiveCategory(currentCategory);
}, [currentCategory]);


useEffect(() => {
    setSelectedSort(currentSort);
  }, [currentSort]);

  useEffect(() => {
    setPriceRange(currentPriceRange);
  }, [currentPriceRange]);
  // Calculate price range from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange({ min: Math.floor(min), max: Math.ceil(max) });
    }
  }, [products]);

  // Close mobile menu when category is selected
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    dispatch(filterByCategory(category));
    if (isFilterMenuOpen) {
      dispatch(toggleFilterMenu());
    }
  };

  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);
    dispatch(sortProducts(sortType));
  };

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSelectedSort('default');
    setShowPriceFilter(false);
    
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange({ min: Math.floor(min), max: Math.ceil(max) });
    }
    
    dispatch(resetFilters());
  };

  // Get active filters count
  const activeFiltersCount = [
    activeCategory !== 'all',
    selectedSort !== 'default',
    priceRange.min > 0 || priceRange.max < 1000,
  ].filter(Boolean).length;

  // Featured categories with icons
  const featuredCategories = [
    { 
      name: 'trending', 
      label: 'Trending Now', 
      icon: <Flame className="h-5 w-5" />, 
      color: 'from-red-500 to-orange-500',
      description: 'Hot picks this week'
    },
    { 
      name: 'electronics', 
      label: 'Electronics', 
      icon: <Zap className="h-5 w-5" />, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Gadgets & devices'
    },
    { 
      name: 'fashion', 
      label: 'Fashion', 
      icon: <Sparkles className="h-5 w-5" />, 
      color: 'from-purple-500 to-pink-500',
      description: 'Style & accessories'
    },
    { 
      name: 'home', 
      label: 'Home & Living', 
      icon: <Tag className="h-5 w-5" />, 
      color: 'from-emerald-500 to-teal-500',
      description: 'Home essentials'
    },
    { 
      name: 'top-rated', 
      label: 'Top Rated', 
      icon: <Star className="h-5 w-5" />, 
      color: 'from-amber-500 to-orange-500',
      description: 'Highest rated'
    },
  ];

  return (
    <div className="mb-8">
      {/* Mobile Filter Header */}
      <div className="md:hidden">
        <div className="flex  items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-4">
          <div className="flex  items-center gap-3">
            <div className="relative">
              <div className="p-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </div>
            <div>
              <p className="font-bold text-lg">{filteredProducts.length} Products</p>
              <p className="text-sm text-gray-500">
                {activeCategory !== 'all' ? `${activeCategory}` : 'All Categories'}
                {selectedSort !== 'default' && ` • ${selectedSort}`}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleFilterMenu())}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {isMobileMenuOpen ? 'Close' : 'Filter'}
          </motion.button>
        </div>

        {/* Mobile Filter Menu */}
        <AnimatePresence>
          {isFilterMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => dispatch(toggleFilterMenu())}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              />
              
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ 
                  type: 'spring', 
                  damping: 25,
                  stiffness: 200
                }}
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
              >
                {/* Filter Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          ShopEasy Filters
                        </h3>
                        <p className="text-sm text-gray-500">Browse by categories</p>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(toggleFilterMenu())}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Filter Content */}
                <div className="p-6 space-y-8">
                  {/* Featured Categories */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      Featured Collections
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {featuredCategories.map((cat) => (
                        <motion.button
                          key={cat.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCategoryClick(cat.name)}
                          className={`p-4 rounded-xl bg-linear-to-br ${cat.color} text-white text-left transition-all ${
                            activeCategory === cat.name ? 'ring-4 ring-white/30 shadow-2xl' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {cat.icon}
                            <span className="font-bold">{cat.label}</span>
                          </div>
                          <p className="text-xs opacity-90">{cat.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* All Categories */}
                  <div>
                    <div className="flex items-center justify-between mb-4 ">
                      <h4 className="font-bold text-lg flex  items-center gap-2 text-gray-900 dark:text-white">
                        <Filter className="h-5 w-5 text-blue-500" />
                        All Categories
                      </h4>
                      <span className="text-sm text-gray-500">
                        {categories.length} categories
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <motion.button
                          key={category}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCategoryClick(category)}
                          className={`px-4 py-3 rounded-xl text-center transition-all ${
                            activeCategory === category
                              ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg font-semibold'
                              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {category === 'all' ? 'All Products' : category}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                      <SortAsc className="h-5 w-5 text-blue-500" />
                      Sort By
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sortOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSortChange(option.value)}
                          className={`px-4 py-3 rounded-xl text-center transition-all flex items-center justify-center gap-2 ${
                            selectedSort === option.value
                              ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {option.icon}
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-6 border-t dark:border-gray-800">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearAllFilters}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300"
                      >
                        Clear All
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => dispatch(toggleMobileMenu())}
                        className="flex-1 px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all font-medium"
                      >
                        Show {filteredProducts.length} Products
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        {/* Main Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          {/* Title and Sort Row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Browse Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Find Exactly why you are looking for
              </p>
            </div>
        
            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-3.5 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-gray-700 dark:text-gray-300">
                <SortAsc className="h-4 w-4" />
                <span>{sortOptions.find(o => o.value === selectedSort)?.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center gap-3 ${
                      selectedSort === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-6">
            {/* Featured Categories */}
            <div className=''>
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                Shop by Collection
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {featuredCategories.map((cat) => (
                  <motion.button
                    key={cat.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`shrink-0 w-48 p-4 rounded-xl bg-linear-to-br ${cat.color} text-white transition-all text-left ${
                      activeCategory === cat.name ? 'ring-4 ring-white/30 shadow-2xl' : 'shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        {cat.icon}
                      </div>
                      <span className="font-bold text-lg">{cat.label}</span>
                    </div>
                    <p className="text-sm opacity-90">{cat.description}</p>
                    <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1 inline-block">
                      Shop now →
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* All Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Browse All Categories
                </h3>
                <span className="text-sm text-gray-500">
                  {activeCategory !== 'all' ? `${activeCategory} selected` : `${categories.length} categories`}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                      activeCategory === category
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6 border border-blue-100 dark:border-blue-800/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Active Filters</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredProducts.length} products match your criteria
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-end">
                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm shadow">
                    <Tag className="h-3 w-3" />
                    <span className="font-medium">{activeCategory}</span>
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
            
                {selectedSort !== 'default' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm shadow">
                    <SortAsc className="h-3 w-3" />
                    <span className="font-medium">
                      {sortOptions.find(o => o.value === selectedSort)?.label}
                    </span>
                    <button
                      onClick={() => handleSortChange('default')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  <X className="h-3 w-3" />
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Summary */}
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-bold text-blue-600 dark:text-blue-400">{filteredProducts.length}</span> of{' '}
            <span className="font-bold">{products.length}</span> products
            {activeCategory !== 'all' && (
              <> in <span className="font-bold text-purple-600 dark:text-purple-400">{activeCategory}</span></>
            )}
            
            {selectedSort !== 'default' && (
              <> sorted by <span className="font-bold text-green-600 dark:text-green-400">
                {sortOptions.find(o => o.value === selectedSort)?.label}
              </span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const sortOptions = [
  { value: 'default', label: 'Recommended', icon: <Sparkles className="h-4 w-4" /> },
  { value: 'price-low', label: 'Price: Low to High', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'price-high', label: 'Price: High to Low', icon: <TrendingUp className="h-4 w-4 rotate-180" /> },
  { value: 'rating', label: 'Top Rated', icon: <Star className="h-4 w-4" /> },
  { value: 'newest', label: 'Newest Arrivals', icon: <Clock className="h-4 w-4" /> },
  { value: 'popular', label: 'Most Popular', icon: <Flame className="h-4 w-4" /> },
  { value: 'discount', label: 'Best Discount', icon: <Percent className="h-4 w-4" /> },
];

export default CategoryFilter;