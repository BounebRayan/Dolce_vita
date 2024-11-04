"use client";
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleSubmitCart = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call to submit the cart
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Cart submitted successfully!");
      clearCart();
    } catch (error) {
      console.error("Failed to submit cart:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return <div className="text-center mt-10">Your cart is empty.</div>;
  }

  return (
    <div className="p-4 md:mx-12 lg:mx-32 mt-6">
      <h1 className="text-2xl font-medium mb-4">Your Shopping Cart</h1>

      <div className="grid gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-300 pb-4">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} width={80} height={80} className="object-cover rounded-sm" />
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p>Price: {item.price.toFixed(2)} DT</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleClearCart}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-sm mr-4"
        >
          Clear Cart
        </button>
        <button
          onClick={handleSubmitCart}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Cart'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
