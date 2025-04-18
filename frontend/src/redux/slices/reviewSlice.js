import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching product reviews
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      // This would normally make an API call
      // For this example, we'll just return mock data
      return [
        {
          id: 1,
          userId: 'user1',
          userName: 'John Doe',
          productId,
          rating: 4,
          title: 'Great product, highly recommended',
          review: 'I\'ve been using this for a month and it\'s been fantastic. Quality is excellent.',
          date: '2023-03-15',
          verified: true
        },
        {
          id: 2,
          userId: 'user2',
          userName: 'Jane Smith',
          productId,
          rating: 5,
          title: 'Exceeded my expectations',
          review: 'This product is everything I hoped for and more. The build quality is excellent and it works perfectly.',
          date: '2023-02-22',
          verified: true
        }
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for submitting a review
export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      // This would normally make an API call
      // For this example, we'll just simulate a successful API response
      return {
        id: Date.now(),
        ...reviewData,
        verified: true,
        date: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
  submitSuccess: false
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewErrors: (state) => {
      state.error = null;
      state.submitError = null;
    },
    clearSubmitSuccess: (state) => {
      state.submitSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch product reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reviews';
      })
      
      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.reviews = [action.payload, ...state.reviews];
        state.submitSuccess = true;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload || 'Failed to submit review';
      });
  }
});

export const { clearReviewErrors, clearSubmitSuccess } = reviewSlice.actions;

export const selectReviews = (state) => state.reviews.reviews;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;
export const selectReviewSubmitting = (state) => state.reviews.submitting;
export const selectReviewSubmitError = (state) => state.reviews.submitError;
export const selectReviewSubmitSuccess = (state) => state.reviews.submitSuccess;

export default reviewSlice.reducer; 