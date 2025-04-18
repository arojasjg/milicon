import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

// Async thunk for fetching products with filtering and pagination
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch products' }
      );
    }
  }
);

// Async thunk for fetching a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch product details' }
      );
    }
  }
);

// Async thunk for searching products
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, ...params }, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to search products' }
      );
    }
  }
);

// Async thunk for fetching products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, ...params }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByCategory(categoryId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch products by category' }
      );
    }
  }
);

// Async thunk for fetching featured products
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch featured products' }
      );
    }
  }
);

// Async thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch categories' }
      );
    }
  }
);

// Initial state
const initialState = {
  // Product list state
  products: [],
  filteredProducts: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 12,
  
  // Categories
  categories: [],
  
  // Single product state
  product: null,
  
  // Featured products
  featuredProducts: [],
  
  // Loading and error states
  loading: false,
  loadingSingle: false,
  loadingFeatured: false,
  loadingCategories: false,
  error: null,
  errorSingle: null,
  errorFeatured: null,
  errorCategories: null,
  
  // Filtering and sorting state
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    rating: null,
    searchQuery: '',
  },
  sortBy: 'name', // name, price, rating
  sortOrder: 'asc', // asc, desc
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Filter and sort actions
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        minPrice: null,
        maxPrice: null,
        rating: null,
        searchQuery: '',
      };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.items || [];
        state.totalProducts = action.payload.total || action.payload.items?.length || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loadingSingle = true;
        state.errorSingle = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loadingSingle = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loadingSingle = false;
        state.errorSingle = action.payload?.message || 'Failed to fetch product details';
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload.items || [];
        state.totalProducts = action.payload.total || action.payload.items?.length || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.filters.searchQuery = action.meta.arg.query || '';
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to search products';
      })
      
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload.items || [];
        state.totalProducts = action.payload.total || action.payload.items?.length || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.filters.category = action.meta.arg.categoryId;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products by category';
      })
      
      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loadingFeatured = true;
        state.errorFeatured = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loadingFeatured = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loadingFeatured = false;
        state.errorFeatured = action.payload?.message || 'Failed to fetch featured products';
      })
      
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategories = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategories = action.payload?.message || 'Failed to fetch categories';
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setPageSize,
} = productSlice.actions;

// Export selectors
export const selectProducts = (state) => state.products.products;
export const selectFilteredProducts = (state) => state.products.filteredProducts;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProduct = (state) => state.products.product;
export const selectProductLoading = (state) => state.products.loadingSingle;
export const selectProductError = (state) => state.products.errorSingle;
export const selectFeaturedProducts = (state) => state.products.featuredProducts;
export const selectFeaturedProductsLoading = (state) => state.products.loadingFeatured;
export const selectFeaturedProductsError = (state) => state.products.errorFeatured;
export const selectCategories = (state) => state.products.categories;
export const selectCategoriesLoading = (state) => state.products.loadingCategories;
export const selectCategoriesError = (state) => state.products.errorCategories;
export const selectFilters = (state) => state.products.filters;
export const selectSortBy = (state) => state.products.sortBy;
export const selectSortOrder = (state) => state.products.sortOrder;
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectTotalPages = (state) => state.products.totalPages;
export const selectTotalProducts = (state) => state.products.totalProducts;
export const selectPageSize = (state) => state.products.pageSize;

export default productSlice.reducer; 