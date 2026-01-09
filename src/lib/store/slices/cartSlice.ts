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

const initialState: CartState =  {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    isCartOpen: false,
    }

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{
            id: string;
            name: string;
            price: number;
            image: string;
            quantity?:number;
        }>) => {
        const {id, name, price, image, quantity = 1} = action.payload;
         const existingItem = state.items.find((item) => item.id === action.payload.id);
         if(existingItem) {
            existingItem.quantity += quantity;
            } else {
                state.items.push({id, name, price, image, quantity:quantity});
            }
         state.totalQuantity += quantity;
         state.totalPrice += price * quantity;
        },
        removeFromCart: (state, action : PayloadAction<string>) => {
            const itemId = action.payload;
            const existingItem = state.items.find((item) => item.id === itemId);
          if(existingItem) {
            if(existingItem.quantity === 1) {
                state.items = state.items.filter((item) => item.id !== itemId);
            } else {
                existingItem.quantity -= 1;
            }
            state.totalQuantity -= 1;
             state.totalPrice -= existingItem.price;
          }
        },
        removeItemCompletely: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            const existingItem = state.items.find(item => item.id === itemId);
            if(existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalPrice -= existingItem.price * existingItem.quantity;
                state.items = state.items.filter(item => item.id !== itemId);
                }
        },
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        clearCart:(state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
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