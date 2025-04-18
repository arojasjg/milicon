import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';
import { fetchCart } from './cartSlice';

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Parse the token payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

// Get stored token from localStorage or sessionStorage
const getStoredToken = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return !isTokenExpired(token) ? token : null;
};

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.login(credentials);
      
      // Store token based on remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('token', response.token);
        localStorage.removeItem('rememberMe');
      }
      
      // Fetch server cart after login
      dispatch(fetchCart());
      
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Login failed. Please check your credentials.' }
      );
    }
  }
);

// Register thunk
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Registration failed. Please try again.' }
      );
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // Call the logout service
    userService.logout();
    
    // Clear user data from state
    return null;
  }
);

// Refresh token thunk
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.refreshToken();
      
      // Store the new token
      if (localStorage.getItem('rememberMe') === 'true') {
        localStorage.setItem('token', response.token);
      } else {
        sessionStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to refresh token.' }
      );
    }
  }
);

// Fetch user profile thunk
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch user profile.' }
      );
    }
  }
);

// Initial state
const initialState = {
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  user: null,
  loading: false,
  error: null,
  registerSuccess: false,
};

// Auth slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear any error message
    clearError: (state) => {
      state.error = null;
    },
    // Reset register success flag
    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
    // Clear all auth state
    clearAuth: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Token refresh cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Profile fetch cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user profile';
      });
  },
});

// Export actions
export const { clearError, resetRegisterSuccess, clearAuth } = authSlice.actions;

// Export selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectRegisterSuccess = (state) => state.auth.registerSuccess;

export default authSlice.reducer; 