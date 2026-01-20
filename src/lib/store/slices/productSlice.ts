import { createSlice, createAsyncThunk, PayloadAction, } from "@reduxjs/toolkit";
import { stat } from "fs";

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: number;
    originalPrice?: number;
    stock: number;
    discount?:number;
}

interface ProductState {
    products: Product[];
    filteredProducts: Product[];
    categories: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentCategory: string;
    currentSearch: string;
    currentSort: string;
    currentPriceRange: { min: number; max: number };
    currentPage: number;
    productPerPage: number;
    totalPages: number;
}

const initialState : ProductState = {
    products: [],
    filteredProducts: [],
    categories: [],
    status: 'idle',
    error: null,
    currentCategory: 'all',
    currentSearch: '',
    currentSort: 'default',
    currentPriceRange: { min: 0, max: 1000 },

    currentPage: 1,
    productPerPage: 20,
    totalPages: 1,
};

const applyAllFilter = (state: ProductState) : Product[]  => {
   let filtered = [...state.products];

const totalFiltered = filtered.length;
const productPerPage = state.productPerPage;
state.totalPages = Math.ceil(totalFiltered / productPerPage)

if(state.currentPage > state.totalPages) {
  state.currentPage = 1;
}

   if(state.currentCategory !== 'all') {
    filtered = filtered.filter(product => 
      product.category === state.currentCategory
    )
   }

   filtered = filtered.filter(product => 
    product.price >= state.currentPriceRange.min &&
    product.price <= state.currentPriceRange.max
   );

  if(state.currentSearch) {
    const query = state.currentSearch.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
     );
  }

   switch (state.currentSort){
      case 'price-low':
        filtered.sort((a,b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return discountB - discountA;
        });
        break;
      case 'populer':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
        case 'default':
        default:
        
        break;    
    }
return filtered;    
        }
   

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Laptop',
        price: 1299.99,
        originalPrice: 1599.99,
        discount: 19,
        description: 'High-performance laptop for professionals',
        category: 'electronics',
        image: '/electronics/laptop.avif',
        rating: 4.5,
        stock: 10,
      },
      {
        id: '2',
        name: 'Wireless Headphones',
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        description: 'Noise-cancelling wireless headphones',
        category: 'electronics',
        image: '/electronics/wirelessheadphones.avif',
        rating: 4.3,
        stock: 25,
      },
      {
        id: '3',
        name: 'Running Shoes',
        price: 89.99,
        originalPrice: 119.99,
        discount: 25,
        description: 'Comfortable running shoes for all terrains',
        category: 'fashion',
        image: '/fashion/running_shoe.jpg',
        rating: 4.7,
        stock: 50,
      },
      {
        id: '4',
        name: 'Smart Watch',
        price: 299.99,
        description: 'Fitness tracker with heart rate monitor',
        category: 'electronics',
        image: '/electronics/smart_watch.avif',
        rating: 4.2,
        stock: 15,
      },
      {
        id: '5',
        name: 'Backpack',
        price: 49.99,
        originalPrice: 69.99,
        discount: 29,
        description: 'Water-resistant backpack with laptop compartment',
        category: 'fashion',
        image: '/fashion/backpack.jpg',
        rating: 4.4,
        stock: 30,
      },
      {
        id: '6',
        name: 'Coffee Maker',
        price: 79.99,
        description: 'Programmable coffee maker with thermal carafe',
        category: 'home',
        image: '/home/coffee_machine.jpg',
        rating: 4.6,
        stock: 20,
      },
      {
        id: '7',
        name: 'Yoga Mat',
        price: 29.99,
        originalPrice: 39.99,
        discount: 25,
        description: 'Premium non-slip yoga mat',
        category: 'sports',
        image: '/sports/yoga_mat.jpg',
        rating: 4.8,
        stock: 100,
      },
      {
        id: '8',
        name: 'Bluetooth Speaker',
        price: 129.99,
        originalPrice: 169.99,
        discount: 24,
        description: 'Portable speaker with 360° sound',
        category: 'electronics',
        image: '/electronics/bluetooth_speaker.jpg',
        rating: 4.1,
        stock: 18,
      },
    ];
  return mockProducts;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
      setCurrentPage: (state, action: PayloadAction<number>) => {
    state.currentPage = action.payload;
   },

   setProductPerPage: (state, action: PayloadAction<number>) => {
    state.productPerPage = action.payload;
    state.totalPages = Math.ceil(state.filteredProducts.length / state.productPerPage);
    state.currentPage = 1
   },

   goToNextPage: (state) => {
    if(state.currentPage < state.totalPages) {
      state.currentPage += 1;
    }
   },

   goToPrevPage: (state) => {
    if(state.currentPage > 1) {
  state.currentPage -= 1 ;
    }
   },

   filterByCategory: (state, action) => {
            const category = action.payload;
            state.currentCategory = category;
            state.currentPage = 1;
            state.filteredProducts = applyAllFilter(state);
        },
   filterByPrice: (state, action) => {
            const { min, max } = action.payload;
            state.currentPriceRange = {min, max};
            state.currentPage = 1;
            state.filteredProducts = applyAllFilter(state)
        },

   searchProducts: (state, action) => {
            const query = action.payload;
            state.currentSearch = query;
            state.currentPage = 1;
            state.filteredProducts = applyAllFilter(state);
        },
   sortProducts: (state, action: PayloadAction<string>) => {
           const sortType = action.payload;
           state.currentSort = sortType;
           state.currentPage = 1;
           state.filteredProducts = applyAllFilter(state);
        },
   resetFilters: (state) => {
    state.currentCategory = 'all';
    state.currentSearch = '';
    state.currentSort = 'default';
    state.currentPriceRange = {min: 0, max: 1000};
    state.currentPage = 1;
    state.filteredProducts = state.products;
    state.totalPages = Math.ceil(state.products.length / 20)
   },
    },

    extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.categories = ['all', ...new Set(action.payload.map(p => p.category))];
        if (action.payload.length > 0) {
                    const prices = action.payload.map(p => p.price);
                    state.currentPriceRange = {
                        min: Math.min(...prices),
                        max: Math.max(...prices)
                    }}
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const {
        filterByCategory,
        filterByPrice, 
        searchProducts,
        sortProducts,
        resetFilters,
        setCurrentPage,
        setProductPerPage,
        goToNextPage,
        goToPrevPage                
            } = productSlice.actions;
export default productSlice.reducer;
