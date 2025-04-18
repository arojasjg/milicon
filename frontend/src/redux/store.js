import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    address: addressReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 