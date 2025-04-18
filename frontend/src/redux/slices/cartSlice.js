import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return { items: [] };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

// Get cart from API
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/carts');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch cart' }
      );
    }
  }
);

// Add item to cart (API)
export const addItemToCartApi = createAsyncThunk(
  'cart/addItemToCartApi',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/carts/items', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to add item to cart' }
      );
    }
  }
);

// Update cart item quantity (API)
export const updateCartItemApi = createAsyncThunk(
  'cart/updateCartItemApi',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/carts/items/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update cart item' }
      );
    }
  }
);

// Remove item from cart (API)
export const removeItemFromCartApi = createAsyncThunk(
  'cart/removeItemFromCartApi',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/carts/items/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to remove item from cart' }
      );
    }
  }
);

// Clear cart (API)
export const clearCartApi = createAsyncThunk(
  'cart/clearCartApi',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/carts');
      return {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to clear cart' }
      );
    }
  }
);

const initialState = {
  ...loadCartFromStorage(),
  loading: false,
  error: null,
  isInitialized: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local cart operations (for anonymous users)
    addItem: (state, action) => {
      const { id, quantity = 1, ...rest } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.productId === id);
      
      if (existingItemIndex >= 0) {
        // If item already exists, update quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Otherwise add new item
        state.items.push({
          id: state.items.length > 0 ? Math.max(...state.items.map(item => item.id)) + 1 : 1,
          productId: id,
          quantity,
          ...rest
        });
      }
      
      // Save to localStorage
      saveCartToStorage({ items: state.items });
    },
    
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      
      // Save to localStorage
      saveCartToStorage({ items: state.items });
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      
      // Save to localStorage
      saveCartToStorage({ items: state.items });
    },
    
    clearCart: (state) => {
      state.items = [];
      
      // Save to localStorage
      saveCartToStorage({ items: [] });
    },
    
    // Merge local cart with server cart
    mergeWithServerCart: (state, action) => {
      const serverCart = action.payload;
      
      if (serverCart && serverCart.items) {
        // Merge items, keeping the higher quantity for duplicates
        const mergedItems = [...state.items];
        
        serverCart.items.forEach(serverItem => {
          const existingItemIndex = mergedItems.findIndex(
            item => item.productId === serverItem.productId
          );
          
          if (existingItemIndex >= 0) {
            // Take the higher quantity
            mergedItems[existingItemIndex].quantity = Math.max(
              mergedItems[existingItemIndex].quantity,
              serverItem.quantity
            );
          } else {
            // Add new item from server
            mergedItems.push(serverItem);
          }
        });
        
        state.items = mergedItems;
        
        // Save to localStorage
        saveCartToStorage({ items: state.items });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.isInitialized = true;
        
        // Save to localStorage
        saveCartToStorage({ items: state.items });
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cart';
        state.isInitialized = true;
      })
      
      // addItemToCartApi
      .addCase(addItemToCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCartApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        
        // Save to localStorage
        saveCartToStorage({ items: state.items });
      })
      .addCase(addItemToCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add item to cart';
      })
      
      // updateCartItemApi
      .addCase(updateCartItemApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        
        // Save to localStorage
        saveCartToStorage({ items: state.items });
      })
      .addCase(updateCartItemApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update cart item';
      })
      
      // removeItemFromCartApi
      .addCase(removeItemFromCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCartApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        
        // Save to localStorage
        saveCartToStorage({ items: state.items });
      })
      .addCase(removeItemFromCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove item from cart';
      })
      
      // clearCartApi
      .addCase(clearCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartApi.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        
        // Save to localStorage
        saveCartToStorage({ items: [] });
      })
      .addCase(clearCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to clear cart';
      });
  }
});

// Export actions for local cart operations
export const { addItem, removeItem, updateQuantity, clearCart, mergeWithServerCart } = cartSlice.actions;

// Cart selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectIsCartInitialized = (state) => state.cart.isInitialized;

export default cartSlice.reducer; 