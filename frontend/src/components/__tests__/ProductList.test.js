import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ProductList from '../ProductList';

const mockStore = configureStore([thunk]);

describe('ProductList Component', () => {
  let store;
  
  const mockProducts = [
    {
      id: 1,
      name: 'Running Shoes',
      description: 'Professional running shoes',
      price: 99.99,
      imageUrl: '/images/running-shoes.jpg',
      category: { id: 1, name: 'Footwear' }
    },
    {
      id: 2,
      name: 'Tennis Racket',
      description: 'Professional tennis racket',
      price: 129.99,
      imageUrl: '/images/tennis-racket.jpg',
      category: { id: 2, name: 'Tennis' }
    }
  ];
  
  beforeEach(() => {
    store = mockStore({
      products: {
        items: mockProducts,
        loading: false,
        error: null,
        totalPages: 1,
        currentPage: 0
      },
      cart: {
        items: []
      }
    });
    
    store.dispatch = jest.fn();
  });
  
  test('renders product list correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('Tennis Racket')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$129.99')).toBeInTheDocument();
  });
  
  test('displays loading state', () => {
    store = mockStore({
      products: {
        items: [],
        loading: true,
        error: null
      },
      cart: {
        items: []
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });
  
  test('displays error message', () => {
    store = mockStore({
      products: {
        items: [],
        loading: false,
        error: 'Failed to load products'
      },
      cart: {
        items: []
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Error: Failed to load products')).toBeInTheDocument();
  });
  
  test('adds product to cart when "Add to Cart" button is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );
    
    const addToCartButtons = screen.getAllByText('Add to Cart');
    userEvent.click(addToCartButtons[0]);
    
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cart/addItem'
        })
      );
    });
  });
  
  test('navigates to product details when product is clicked', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );
    
    const productCards = screen.getAllByTestId('product-card');
    userEvent.click(productCards[0]);
    
    // In a real test, we would check if the navigation occurred
    // Here we're just checking if the link has the correct href
    expect(productCards[0].closest('a')).toHaveAttribute('href', '/products/1');
  });
}); 