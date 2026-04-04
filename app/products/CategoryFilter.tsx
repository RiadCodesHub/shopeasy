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
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { 
  filterByCategory, 
  filterByPrice,
  searchProducts,
  sortProducts,
  resetFilters 
} from '@/lib/store/slices/productSlice';
import { toggleMobileMenu, toggleFilterMenu } from '@/lib/store/slices/uiSlice';

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

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange({ min: Math.floor(min), max: Math.ceil(max) });
    }
  }, [products]);

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

  const activeFiltersCount = [
    activeCategory !== 'all',
    selectedSort !== 'default',
    priceRange.min > 0 || priceRange.max < 1000,
  ].filter(Boolean).length;

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

  const sortOptions = [
    { value: 'default', label: 'Recommended', icon: <Sparkles className="h-4 w-4" /> },
    { value: 'price-low', label: 'Price: Low to High', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <TrendingUp className="h-4 w-4 rotate-180" /> },
    { value: 'rating', label: 'Top Rated', icon: <Star className="h-4 w-4" /> },
    { value: 'newest', label: 'Newest Arrivals', icon: <Clock className="h-4 w-4" /> },
    { value: 'popular', label: 'Most Popular', icon: <Flame className="h-4 w-4" /> },
    { value: 'discount', label: 'Best Discount', icon: <Percent className="h-4 w-4" /> },
  ];

  return (
    <div className="mb-8">
      {/* Mobile Filter Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 bg-(--background-secondary) rounded-xl shadow-lg mb-4 border border-(--border)">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 bg-linear-to-r from-primary to-accent rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </div>
            <div>
              <p className="font-bold text-lg text-(--foreground)">{filteredProducts.length} Products</p>
              <p className="text-sm text-(--foreground-tertiary)">
                {activeCategory !== 'all' ? `${activeCategory}` : 'All Categories'}
                {selectedSort !== 'default' && ` • ${selectedSort}`}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleFilterMenu())}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {isFilterMenuOpen ? 'Close' : 'Filter'}
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-(--background-secondary) shadow-2xl z-50 overflow-y-auto"
              >
                {/* Filter Header */}
                <div className="sticky top-0 bg-(--background-secondary) border-b border-(--border) p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-r from-primary to-accent rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-(--foreground)">
                          ShopEasy Filters
                        </h3>
                        <p className="text-sm text-(--foreground-tertiary)">Browse by categories</p>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(toggleFilterMenu())}
                      className="p-2 hover:bg-(--background-tertiary) rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-(--foreground-secondary)" />
                    </button>
                  </div>
                </div>

                {/* Filter Content */}
                <div className="p-6 space-y-8">
                  {/* Featured Categories */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-(--foreground)">
                      <Sparkles className="h-5 w-5 text-accent" />
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
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg flex items-center gap-2 text-(--foreground)">
                        <Filter className="h-5 w-5 text-primary" />
                        All Categories
                      </h4>
                      <span className="text-sm text-(--foreground-tertiary)">
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
                              ? 'bg-linear-to-r from-primary to-accent text-white shadow-lg font-semibold'
                              : 'bg-(--background-tertiary) hover:bg-(--background-tertiary)/80 text-(--foreground-secondary)'
                          }`}
                        >
                          {category === 'all' ? 'All Products' : category}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-(--foreground)">
                      <SortAsc className="h-5 w-5 text-primary" />
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
                              ? 'bg-linear-to-r from-primary to-accent text-white shadow-lg'
                              : 'bg-(--background-tertiary) hover:bg-(--background-tertiary)/80 text-(--foreground-secondary)'
                          }`}
                        >
                          {option.icon}
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="sticky bottom-0 bg-(--background-secondary) pt-6 border-t border-(--border)">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearAllFilters}
                        className="flex-1 px-4 py-3 border-2 border-(--border) rounded-xl hover:bg-(--background-tertiary) transition-colors font-medium text-(--foreground-secondary)"
                      >
                        Clear All
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => dispatch(toggleFilterMenu())}
                        className="flex-1 px-4 py-3 bg-linear-to-r from-primary to-accent text-white rounded-xl hover:opacity-90 transition-all font-medium"
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
        <div className="card p-6 mb-6">
          {/* Title and Sort Row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-(--foreground)">
                Browse Products
              </h2>
              <p className="text-(--foreground-secondary)">
                Find exactly what you're looking for
              </p>
            </div>
        
            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-3.5 bg-(--background-tertiary) rounded-xl hover:bg-(--background-tertiary)/80 transition-colors font-medium text-(--foreground-secondary)">
                <SortAsc className="h-4 w-4" />
                <span>{sortOptions.find(o => o.value === selectedSort)?.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-(--background-secondary) rounded-xl shadow-2xl border border-(--border) opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-(--background-tertiary) transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center gap-3 ${
                      selectedSort === option.value
                        ? 'bg-primary/10 text-primary'
                        : 'text-(--foreground-secondary)'
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
            <div>
              <h3 className="font-bold text-lg mb-4 text-(--foreground)">
                Shop by Collection
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
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
                <h3 className="font-bold text-lg text-(--foreground)">
                  Browse All Categories
                </h3>
                <span className="text-sm text-(--foreground-tertiary)">
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
                        ? 'bg-linear-to-r from-primary to-accent text-white shadow-lg'
                        : 'bg-(--background-tertiary) hover:bg-(--background-tertiary)/80 text-(--foreground-secondary)'
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
            className="bg-linear-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-6 border border-primary/20"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-(--background-secondary) rounded-lg shadow border border-(--border)">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-(--foreground)">Active Filters</h4>
                  <p className="text-sm text-(--foreground-secondary)">
                    {filteredProducts.length} products match your criteria
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-(--background-secondary) rounded-full text-sm shadow border border-(--border)">
                    <Tag className="h-3 w-3 text-primary" />
                    <span className="font-medium text-(--foreground)">{activeCategory}</span>
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className="p-1 hover:bg-(--background-tertiary) rounded-full"
                    >
                      <X className="h-3 w-3 text-(--foreground-tertiary)" />
                    </button>
                  </span>
                )}
            
                {selectedSort !== 'default' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-(--background-secondary) rounded-full text-sm shadow border border-(--border)">
                    <SortAsc className="h-3 w-3 text-primary" />
                    <span className="font-medium text-(--foreground)">
                      {sortOptions.find(o => o.value === selectedSort)?.label}
                    </span>
                    <button
                      onClick={() => handleSortChange('default')}
                      className="p-1 hover:bg-(--background-tertiary) rounded-full"
                    >
                      <X className="h-3 w-3 text-(--foreground-tertiary)" />
                    </button>
                  </span>
                )}
                
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-error/10 text-error rounded-full text-sm font-medium hover:bg-error/20 transition-colors"
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
          <p className="text-(--foreground-secondary)">
            Showing <span className="font-bold text-primary">{filteredProducts.length}</span> of{' '}
            <span className="font-bold text-(--foreground)">{products.length}</span> products
            {activeCategory !== 'all' && (
              <> in <span className="font-bold text-accent">{activeCategory}</span></>
            )}
            {selectedSort !== 'default' && (
              <> sorted by <span className="font-bold text-success">
                {sortOptions.find(o => o.value === selectedSort)?.label}
              </span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;