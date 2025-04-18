import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching addresses
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    // This would normally make an API call with try/catch
    // For demo purposes, we'll return mock data directly
    return [
      {
        id: '1',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
        isDefault: true
      },
      {
        id: '2',
        street: '456 Oak Ave',
        city: 'Other City',
        state: 'NY',
        zipCode: '67890',
        country: 'USA',
        isDefault: false
      }
    ];
  }
);

// Async thunk for adding an address
export const addAddress = createAsyncThunk(
  'address/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      // This would normally make an API call
      // For demo purposes, we'll just return the data with a mock ID
      return {
        ...addressData,
        id: Date.now().toString() // Mock ID generation
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating an address
export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      // This would normally make an API call
      // For demo purposes, we'll just return the data
      return addressData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting an address
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      // This would normally make an API call
      // For demo purposes, we'll just return the ID
      return addressId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  addresses: [],
  loading: false,
  error: null,
  success: false,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    resetAddressState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearAddressError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses cases
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch addresses';
      })
      
      // Add address cases
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
        state.success = true;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add address';
        state.success = false;
      })
      
      // Update address cases
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update address';
        state.success = false;
      })
      
      // Delete address cases
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete address';
        state.success = false;
      });
  },
});

export const { resetAddressState, clearAddressError } = addressSlice.actions;
export default addressSlice.reducer; 