import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Async thunk for tracking product interactions (for personalized recommendations)
 */
export const trackProductInteraction = createAsyncThunk(
  'recommendations/trackInteraction',
  async (interactionData, { rejectWithValue }) => {
    try {
      // This would normally make an API call to record the interaction
      // For this example, we'll just return success
      return { success: true, ...interactionData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for fetching recommendations
 */
export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetchRecommendations',
  async ({ type, productId, userId, limit = 4 }, { rejectWithValue }) => {
    try {
      // This would normally make an API call
      // For this example, we'll return mock data based on type
      
      // Delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock product data
      const generateMockProducts = (count, prefix) => {
        return Array.from({ length: count }, (_, i) => ({
          product: {
            id: `${prefix}-${i + 1}`,
            name: `${prefix} Product ${i + 1}`,
            price: 19.99 + (i * 10),
            imageUrl: null,
            averageRating: 3.5 + (Math.random() * 1.5),
            category: { id: 'cat1', name: 'Category 1' }
          },
          reason: `Based on your ${type === 'personalized' ? 'browsing history' : 'selection'}`
        }));
      };
      
      // Return different mock data based on recommendation type
      switch (type) {
        case 'personalized':
          return generateMockProducts(limit, 'Personal');
        
        case 'popular':
          return generateMockProducts(limit, 'Popular');
        
        case 'similar':
          return generateMockProducts(limit, 'Similar');
        
        case 'frequently-bought-together':
          return generateMockProducts(limit, 'Together');
        
        default:
          return [];
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  recommendations: [],
  loading: false,
  error: null
};

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Track interaction cases
      .addCase(trackProductInteraction.pending, (state) => {
        // No need to change state for tracking
      })
      .addCase(trackProductInteraction.fulfilled, (state, action) => {
        // Could update state if needed (e.g., add to a list of tracked items)
      })
      .addCase(trackProductInteraction.rejected, (state, action) => {
        // Could log errors, but not critical to UI
      })
      
      // Fetch recommendations cases
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
        state.error = action.payload || 'Failed to fetch recommendations';
      });
  }
});

export const { clearRecommendations } = recommendationSlice.actions;

export default recommendationSlice.reducer; 