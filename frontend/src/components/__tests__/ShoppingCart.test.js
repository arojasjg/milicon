import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ShoppingCart from '../ShoppingCart';

const mockStore = configureStore([thunk]);

describe('ShoppingCart Component', () => {
  let store;
  
  const mockCartItems = [
    {
      id: 1,
      productId: 1,
      name: 'Running Shoes',
      price: 99.99,
      quantity: 2,
      imageUrl: '/images/running-shoes.jpg'
    },
    {
      id: 2,
      productId: 2,
      name: 'Tennis Racket',
      price: 129.99,
      quantity: 1,
      imageUrl: '/images/tennis-racket.jpg'
    }
  ];
  
  beforeEach(() => {
    store = mockStore({
      cart: {
        items: mockCartItems,
        loading: false,
        error: null
      },
      auth: {
        isAuthenticated: true,
        user: { id: 1, email: 'user@example.com' }
      }
    });
    
    store.dispatch = jest.fn();
  });
  
  test('renders shopping cart with items correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ShoppingCart />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Shopping Cart (3 items)')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('Tennis Racket')).toBeInTheDocument();
    expect(screen.getByText('$199.98')).toBeInTheDocument(); // 2 * 99.99
    expect(screen.getByText('$129.99')).toBeInTheDocument();
    expect(screen.getByText('Total: $329.97')).toBeInTheDocument();
  });
  
  test('removes item from cart when remove button is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ShoppingCart />
        </BrowserRouter>
      </Provider>
    );
    
    const removeButtons = screen.getAllByText('Remove');
    userEvent.click(removeButtons[0]);
    
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cart/removeItem',
          payload: 1
        })
      );
    });
  });
  
  test('updates quantity when quantity input is changed', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ShoppingCart />
        </BrowserRouter>
      </Provider>
    );
    
    const quantityInputs = screen.getAllByLabelText('Quantity');
    userEvent.clear(quantityInputs[0]);
    userEvent.type(quantityInputs[0], '3');
    userEvent.tab(); // Trigger blur event
    
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cart/updateQuantity',
          payload: { id: 1, quantity: 3 }
        })
      );
    });
  });
  
  test('redirects to login when checkout is clicked and user is not authenticated', async () => {
    store = mockStore({
      cart: {
        items: mockCartItems,
        loading: false,
        error: null
      },
      auth: {
        isAuthenticated: false,
        user: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ShoppingCart />
        </BrowserRouter>
      </Provider>
    );
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    userEvent.click(checkoutButton);
    
    // In a real test with connected router, we would check if navigation occurred
    // Here we're checking if the login redirect action was dispatched
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth/redirectToLogin'
        })
      );
    });
  });
  
  test('proceeds to checkout when user is authenticated', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ShoppingCart />
        </BrowserRouter>
      </Provider>
    );
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    userEvent.click(checkoutButton);
    
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'checkout/initiate'
        })
      );
    });
  });
  
  test('displays empty cart message when cart is empty', () => {
    store = mockStore({
      cart: {
        items: [],
        loading: false,
        error: null
      },
      auth: {
        isAuthenticated: true,
        user: { id: 1, email: 'user@example.com' }
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ShoppingCart />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });
}); 