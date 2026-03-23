import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './slices/cartSlice';
import  ProductReducer from "./slices/productSlice";
import uiReducer from './slices/uiSlice';
import formReducer from '../store/slices/formSlice';
import orderReducer from '../store/slices/orderSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            products: ProductReducer,
            form : formReducer,
            ui: uiReducer,
            orders: orderReducer,
        }
    },
    );
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];