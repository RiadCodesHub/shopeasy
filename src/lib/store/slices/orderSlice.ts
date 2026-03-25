import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

interface OrderItem {
    productId: string;
    name: string;
    price : number;
    quantity: number;
    image : string;
}

export interface CustomerInfo {
    firstName: string;
    lastName : string;
    email: string;
    phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
    _id: string;
    orderId: string;
    items: OrderItem[];
    customerInfo: CustomerInfo;
    shippingAddress: ShippingAddress;
    shippingMethod: 'standard' | 'express' | 'free';
    shippingCost: number;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    lastFourDigits?: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    createdAt: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
}

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
    pagination : {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        hasMore: boolean;
    }    ;
}

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    pagination : {
        currentPage: 1,
        totalPages : 1,
        totalOrders: 0,
        hasMore: false
    }
};

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async({page = 1, limit = 10}: {page?: number; limit?: number}) =>{
        const response = await fetch(`/api/orders?page=${page}&limit=${limit}`);
        if(!response.ok) {
           throw new Error("Failed to fetch Orers");
        }
        return response.json();
    }
);

export const fetchOrderById = createAsyncThunk<Order, string>(
    'orders/fetchOrderById',
    async (orderId : string) => {
        const response = await fetch(`/api/orders/${orderId}`);
        if(!response.ok) {
            throw new Error('Failed to fetch order');
        }
        return response.json();
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
     extraReducers: (builder) => {
            builder
            .addCase(fetchOrders.pending, (state, action) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch orders';
        
            })
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })

            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch order'
            })
        }
})

export const {clearCurrentOrder, clearError} = orderSlice.actions;
export default orderSlice.reducer;