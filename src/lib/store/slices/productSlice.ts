import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
}

const initialState : ProductState = {
    products: [],
    filteredProducts: [],
    categories: [],
    status: 'idle',
    error: null,
};

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
        image: '/images/laptop.jpg',
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
        image: '/images/headphones.jpg',
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
        image: '/images/shoes.jpg',
        rating: 4.7,
        stock: 50,
      },
      {
        id: '4',
        name: 'Smart Watch',
        price: 299.99,
        description: 'Fitness tracker with heart rate monitor',
        category: 'electronics',
        image: '/images/watch.jpg',
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
        image: '/images/backpack.jpg',
        rating: 4.4,
        stock: 30,
      },
      {
        id: '6',
        name: 'Coffee Maker',
        price: 79.99,
        description: 'Programmable coffee maker with thermal carafe',
        category: 'home',
        image: '/images/coffee-maker.jpg',
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
        image: '/images/yoga-mat.jpg',
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
        image: '/images/speaker.jpg',
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
        filterByCategory: (state, action) => {
            const category = action.payload;
            if(category === 'all') {
                state.filteredProducts = state.products; 
            } else {
                state.filteredProducts = state.products.filter(
                    product => product.category === category
                );
            }
        },
        filterByPrice: (state, action) => {
            const { min, max } = action.payload;
            state.filteredProducts = state.products.filter(
                product => product.price >= min && product.price <= max
            );
        },

        searchProducts: (state, action) => {
            const query = action.payload.toLowerCase();
            state.filteredProducts = state.products.filter(
                product => 
                    product.name.toLocaleLowerCase().includes(query) ||
                product.description.toLocaleLowerCase().includes(query) ||
                product.category.toLocaleLowerCase().includes(query)
            );
        },
        sortProducts: (state, action: PayloadAction<string>) => {
    const sortType = action.payload;
    let productToSort = [...state.filteredProducts];

    switch (sortType){
      case 'price-low':
        productToSort.sort((a,b) => a.price - b.price);
        break;
      case 'price-high':
        productToSort.sort((a, b) => b.price - a.price);
        'break'
      case 'rating':
        productToSort.sort((a, b) => b.rating - a.rating);
        'break';
      case 'newest':
        productToSort.sort((a, b) => a.stock - b.stock);
        break;
      case 'discount':
        productToSort.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return discountB - discountA;
        });
        break;
        case 'default':
        default:
          const currentFilter : any = state.filteredProducts.length > 0 ?
          state.filteredProducts.map(p => p.id) :
        productToSort = state.products.filter(p => 
          currentFilter.includes(p.id)
        );
        break;
    }
    state.filteredProducts = productToSort;
        },
   resetFilters: (state) => {
    state.filteredProducts = state.products;
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
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { filterByCategory,
               filterByPrice, 
               searchProducts,
               sortProducts,
              resetFilters } = productSlice.actions;
export default productSlice.reducer;
