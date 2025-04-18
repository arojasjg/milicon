import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetchRecommendations',
  async ({ type, productId, userId, limit }, { rejectWithValue }) => {
    try {
      let url;
      
      switch (type) {
        case 'personalized':
          url = `/api/recommendations/user/${userId}?limit=${limit}`;
          break;
        case 'popular':
          url = `/api/recommendations/popular?limit=${limit}`;
          break;
        case 'similar':
          url = `/api/recommendations/similar/${productId}?limit=${limit}`;
          break;
        case 'frequently-bought-together':
          url = `/api/recommendations/frequently-bought-together/${productId}?limit=${limit}`;
          break;
        default:
          throw new Error(`Invalid recommendation type: ${type}`);
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const trackProductInteraction = createAsyncThunk(
  'recommendations/trackProductInteraction',
  async ({ userId, productId, interactionType, value = 1.0 }, { rejectWithValue }) => {
    try {
      await axios.post('/api/recommendations/track', {
        userId,
        productId,
        interactionType,
        value
      });
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState: {
    recommendations: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(trackProductInteraction.rejected, (state, action) => {
        // Just log the error, don't update state
        console.error('Failed to track product interaction:', action.payload);
      });
  }
});

export default recommendationSlice.reducer; 