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
      // Check if item is already in the cart
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let updatedItems;
      
      if (existingItem) {
        // If item exists, update quantity
        updatedItems = state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: item.quantity + action.payload.quantity } 
            : item
        );
      } else {
        // Otherwise, add new item to cart
        updatedItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };

    case REMOVE_FROM_CART:
      // Remove item from cart
      const filteredItems = state.items.filter(item => item.id !== action.payload.id);
      
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
