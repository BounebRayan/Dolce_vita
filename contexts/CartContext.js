"use client";
import React, { createContext, useContext, useReducer } from 'react';

// Define actions
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const CLEAR_CART = 'CLEAR_CART';

// Initial state for the cart
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Reducer function to manage cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: [...state.items, action.payload], // Add new unique item
        totalItems: state.totalItems + 1, // Increment total items
        totalPrice: state.totalPrice + action.payload.price, // Update total price
      };

    case REMOVE_FROM_CART:
      const remainingItems = state.items.filter(item => item.id !== action.payload.id);

      return {
        ...state,
        items: remainingItems,
        totalItems: remainingItems.length,
        totalPrice: remainingItems.reduce((sum, item) => sum + item.price, 0),
      };

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};


// Create CartContext with default values
const CartContext = createContext();

// Custom hook to access CartContext easily
export const useCart = () => useContext(CartContext);

// CartProvider component to wrap around parts of your app that need cart access
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Actions to interact with cart
  const addToCart = (item) => dispatch({ type: ADD_TO_CART, payload: item });
  const removeFromCart = (id) => dispatch({ type: REMOVE_FROM_CART, payload: { id } });
  const clearCart = () => dispatch({ type: CLEAR_CART });

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
