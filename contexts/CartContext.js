"use client";
import React, { createContext, useContext, useReducer, useEffect, useState } from "react";

// Define actions
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const CLEAR_CART = "CLEAR_CART";
const INIT_CART = "INIT_CART"; // New action for initializing the cart

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
        items: [...state.items, action.payload],
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + action.payload.price,
      };

    case REMOVE_FROM_CART:
      const remainingItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        items: remainingItems,
        totalItems: remainingItems.length,
        totalPrice: remainingItems.reduce((sum, item) => sum + item.price, 0),
      };

    case CLEAR_CART:
      return initialState;

    case INIT_CART:
      return action.payload || initialState; // Use payload to initialize state

    default:
      return state;
  }
};

// Create CartContext
const CartContext = createContext();

// Custom hook to access CartContext
export const useCart = () => useContext(CartContext);

// CartProvider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart state from localStorage after mounting
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartState");
      if (savedCart) {
        dispatch({ type: INIT_CART, payload: JSON.parse(savedCart) });
      }
      setIsMounted(true); // Mark as mounted
    }
  }, []);

  // Save cart state to localStorage on state change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cartState", JSON.stringify(state));
    }
  }, [state, isMounted]);

  // Actions
  const addToCart = (item) => dispatch({ type: ADD_TO_CART, payload: item });
  const removeFromCart = (id) =>
    dispatch({ type: REMOVE_FROM_CART, payload: { id } });
  const clearCart = () => dispatch({ type: CLEAR_CART });

  // Avoid rendering until mounted to prevent hydration errors
  if (!isMounted) return null;

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
