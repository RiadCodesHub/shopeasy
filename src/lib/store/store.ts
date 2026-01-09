import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './slices/cartSlice';
import  ProductReducer from "./slices/productSlice";
import uiReducer from './slices/uiSlice';
import reducer from "./slices/cartSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            products: ProductReducer,
            ui: uiReducer,
        }
    },
    );
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];