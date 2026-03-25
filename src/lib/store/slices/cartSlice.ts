import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    isCartOpen: boolean;
}

const loadCartFromStorage = () : CartState => {
    if(typeof window === 'undefined') {
        return {
            items: [],
            totalQuantity : 0,
            totalPrice : 0,
            isCartOpen : false,
        };
    }

    try {
        const savedCart = localStorage.getItem('shopeasy-cart');
        if(savedCart) {
            const parsed = JSON.parse(savedCart);
            return {
                items: parsed.items || [],
                totalQuantity: parsed.totalQuantity || 0,
                totalPrice: parsed.totalPrice || 0,
                isCartOpen : false,
            }
        }
    } catch (error) {
        console.error('Failed to load cart from storage:', error);
    }

    return {
        items : [],
        totalQuantity : 0,
        totalPrice : 0,
        isCartOpen : false,
    }
}

const calculateTotals = (items : CartItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
        totalPrice, totalQuantity
    };
}

const initialState: CartState = loadCartFromStorage();

const saveCartToStorage = (state : CartState) => {
    if(typeof window !== 'undefined') {
        const save = {
            items : state.items,
            totalQuantity : state.totalQuantity,
            totalPrice: state.totalPrice,
        };
        localStorage.setItem('shopeasy-cart', JSON.stringify(save));
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
         const {id, name, price, image, quantity = 1} = action.payload;
         const existingItem = state.items.find((item) => item.id === action.payload.id);
         if(existingItem) {
            existingItem.quantity += quantity;
            } else {
                state.items.push({id, name, price, image, quantity });
            }
        const {totalQuantity, totalPrice} = calculateTotals(state.items);

         state.totalQuantity = totalQuantity;
         state.totalPrice = totalPrice;
         saveCartToStorage(state);
        },
        removeFromCart: (state, action : PayloadAction<string>) => {
        const existingItem = state.items.find((item) => item.id === action.payload);
          if(existingItem) {
            if(existingItem.quantity === 1) {
                state.items = state.items.filter((item) => item.id !== action.payload);
            } else {
                existingItem.quantity -= 1;
            }
         const {totalQuantity, totalPrice} = calculateTotals(state.items);

         state.totalQuantity = totalQuantity;
         state.totalPrice = totalPrice;
         saveCartToStorage(state);

          }
        },
        removeItemCompletely: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            
          const {totalQuantity, totalPrice} = calculateTotals(state.items);

          state.totalQuantity = totalQuantity;
          state.totalPrice = totalPrice;
          saveCartToStorage(state);
        },
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        clearCart:(state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            saveCartToStorage(state);
        },
},
});

export const {
    addToCart,
    removeFromCart,
    removeItemCompletely,
    toggleCart,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;