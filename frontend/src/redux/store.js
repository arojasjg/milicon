import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import recommendationReducer from './slices/recommendationSlice';
import authReducer from './slices/authSlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    address: addressReducer,
    order: orderReducer,
    cart: cartReducer,
    products: productReducer,
    recommendations: recommendationReducer,
    reviews: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 