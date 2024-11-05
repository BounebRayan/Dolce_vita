"use client";
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
  image: string;
}

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
    return (
      <div className='flex flex-col items-center gap-1 text-lg'>
        <div className="text-center mt-10">Il semble que votre panier soit vide</div>
        <Link href={'/'} className='underline'>Retour à la page d'accueil</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:mx-12 lg:mx-32 mt-6">
      <h1 className="text-2xl font-medium mb-4 md:text-3xl">Votre panier</h1>

      <div className="grid gap-6">
        {items.map((item: CartItem) => (
          <div key={item.id} className="flex items-center  justify-between border-b border-gray-300 pb-4">
            <div className="flex items-center gap-4">
              <div className='w-[100px] h-[100px] overflow-hidden'>
              <Image src={item.image} alt={item.name} width={120} height={120} className="object-cover rounded-sm" />
              </div>
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p>Prix: {item.price.toFixed(2)} DT</p>
                <p>Couleur: {item.color}</p>
                <p>Quantité: {item.quantity}</p>
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

      <div className="mt-6 flex">
        <button
          onClick={handleClearCart}
          className="flex-grow sm:flex-grow-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-sm mr-4"
        >
          Clear Cart
        </button>
        <button
          onClick={handleSubmitCart}
          className="flex-grow sm:flex-grow-0 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Cart'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
