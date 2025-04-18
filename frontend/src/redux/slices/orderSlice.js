import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    // This would normally make an API call with try/catch
    // For demo purposes, we'll return mock data directly
    return [
      {
        id: '1001',
        date: '2023-04-01',
        status: 'delivered',
        total: 129.99,
        items: [
          { id: 'p1', name: 'Running Shoes', price: 89.99, quantity: 1 },
          { id: 'p2', name: 'Water Bottle', price: 19.99, quantity: 2 }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        }
      },
      {
        id: '1002',
        date: '2023-04-15',
        status: 'processing',
        total: 54.99,
        items: [
          { id: 'p3', name: 'Yoga Mat', price: 54.99, quantity: 1 }
        ],
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Other City',
          state: 'NY',
          zipCode: '67890',
          country: 'USA'
        }
      }
    ];
  }
);

// Async thunk for fetching order details
export const fetchOrderDetails = createAsyncThunk(
  'order/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      // This would normally make an API call
      // For demo purposes, we'll return mock data
      if (orderId === '1001') {
        return {
          id: '1001',
          date: '2023-04-01',
          status: 'delivered',
          total: 129.99,
          items: [
            { id: 'p1', name: 'Running Shoes', price: 89.99, quantity: 1 },
            { id: 'p2', name: 'Water Bottle', price: 19.99, quantity: 2 }
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'USA'
          },
          paymentMethod: 'Credit Card',
          trackingNumber: '1Z999AA10123456784'
        };
      } else {
        return {
          id: '1002',
          date: '2023-04-15',
          status: 'processing',
          total: 54.99,
          items: [
            { id: 'p3', name: 'Yoga Mat', price: 54.99, quantity: 1 }
          ],
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Other City',
            state: 'NY',
            zipCode: '67890',
            country: 'USA'
          },
          paymentMethod: 'PayPal',
          trackingNumber: null
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders cases
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      })
      
      // Fetch order details cases
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order details';
      });
  }
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer; 