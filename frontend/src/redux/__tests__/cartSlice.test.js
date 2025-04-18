import cartReducer, { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart 
} from '../slices/cartSlice';

describe('Cart Slice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  test('should return the initial state', () => {
    expect(cartReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle adding an item to an empty cart', () => {
    const product = {
      id: 1,
      name: 'Running Shoes',
      price: 99.99,
      imageUrl: '/images/running-shoes.jpg'
    };

    const nextState = cartReducer(initialState, addItem(product));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual({
      id: 1,
      productId: 1,
      name: 'Running Shoes',
      price: 99.99,
      quantity: 1,
      imageUrl: '/images/running-shoes.jpg'
    });
  });

  test('should handle adding an existing item to the cart', () => {
    const currentState = {
      ...initialState,
      items: [
        {
          id: 1,
          productId: 1,
          name: 'Running Shoes',
          price: 99.99,
          quantity: 1,
          imageUrl: '/images/running-shoes.jpg'
        }
      ]
    };

    const product = {
      id: 1,
      name: 'Running Shoes',
      price: 99.99,
      imageUrl: '/images/running-shoes.jpg'
    };

    const nextState = cartReducer(currentState, addItem(product));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(2);
  });

  test('should handle removing an item from the cart', () => {
    const currentState = {
      ...initialState,
      items: [
        {
          id: 1,
          productId: 1,
          name: 'Running Shoes',
          price: 99.99,
          quantity: 1,
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
      ]
    };

    const nextState = cartReducer(currentState, removeItem(1));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].id).toBe(2);
  });

  test('should handle updating item quantity', () => {
    const currentState = {
      ...initialState,
      items: [
        {
          id: 1,
          productId: 1,
          name: 'Running Shoes',
          price: 99.99,
          quantity: 1,
          imageUrl: '/images/running-shoes.jpg'
        }
      ]
    };

    const nextState = cartReducer(currentState, updateQuantity({ id: 1, quantity: 3 }));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(3);
  });

  test('should handle clearing the cart', () => {
    const currentState = {
      ...initialState,
      items: [
        {
          id: 1,
          productId: 1,
          name: 'Running Shoes',
          price: 99.99,
          quantity: 1,
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
      ]
    };

    const nextState = cartReducer(currentState, clearCart());

    expect(nextState.items).toHaveLength(0);
  });
}); 