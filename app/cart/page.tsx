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
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to submit the cart with delivery details
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Commande finalisée avec succès !");
      clearCart();
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de la soumission de la commande:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 text-lg">
        <div className="text-center mt-10">Votre panier est vide</div>
        <Link href="/" className="underline">Retour à la page d'accueil</Link>
      </div>
    );
  }

  const totalPrice = items.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);

  return (
    <div className="p-4 md:mx-12 lg:mx-32 mt-6 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-2xl font-medium mb-4 md:text-3xl">Shopping ({items.length} articles)</h1>
        
        <div className="grid gap-6">
          {items.map((item: CartItem) => (
            <div key={item.id} className="relative flex items-center justify-between border-b border-gray-300 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-[100px] h-[100px] overflow-hidden">
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
                className="absolute top-0 right-0 text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-medium mb-4">Récapitulatif de la commande</h2>
        <p className="text-lg">Total: {totalPrice.toFixed(2)} DT</p>
        
        {showForm ? (
          <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block font-medium">Nom complet:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Numéro de téléphone:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Adresse de livraison:</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Finalisation en cours...' : 'Finaliser l\'achat'}
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded mt-4"
          >
            Finaliser l'achat
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
