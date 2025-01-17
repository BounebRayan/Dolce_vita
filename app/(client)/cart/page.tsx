"use client";
import Link from 'next/link';
import { useCart } from '../../../contexts/CartContext';
import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
  
    const orderData = {
      name,
      phoneNumber: phone,
      address,
      products: items.map((item: {
        reference: any;
        productName: any; productId: any; color: any; image: any; 
}) => ({
        product: item.productId, 
        color: item.color,
        image: item.image,
        reference : item.reference,
        productName : item.productName,
      })),
    };
  
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Commande finalisée avec succès !');
        clearCart();
        setShowForm(false);
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la commande:', error);
      alert('Une erreur est survenue lors de la soumission.');
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
    <div className="p-4 md:mx-12 lg:mx-32 mt-2 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-3xl font-light mb-4 md:text-3xl">Shopping ({items.length} articles)</h1>
        
        <div className="grid gap-4">
          {items.map((item: CartItem) => (
            <div key={item.id} className="relative flex items-center justify-between border-b border-gray-300 pb-3">
              <div className="flex items-start gap-3">
                <div className="w-[140px] h-[140px] overflow-hidden">
                  <Image src={item.image} alt={item.name} width={140} height={140} className="object-cover rounded-sm" />
                </div>
                <div>
                  <h2 className="text-2xl font-normal cursor-pointer"><Link href={`/product/${item.id}`}>{item.name}</Link></h2>
                  <p>Prix: {item.price} DT</p>
                  <p>Couleur: {item.color}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-0 right-0"
              >
                <XMarkIcon className="h-5 w-5 transform text-gray-500 transition duration-300 hover:scale-105"/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-sm shadow-md">
        <h2 className="text-2xl font-light mb-1">Récapitulatif de la commande</h2>
        <p className="text-lg">Total: {totalPrice} DT</p>
        
        {showForm ? (
          <form onSubmit={handleFormSubmit} className="mt-2 space-y-3">
            <div>
              <label className="block">Nom complet:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-1 border rounded-sm"
                required
              />
            </div>
            <div>
              <label className="block">Numéro de téléphone:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-1 border rounded-sm"
                required
              />
            </div>
            <div>
              <label className="block">Adresse de livraison:</label>
              <input
                type="text"
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-1 border rounded-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#dcc174] hover:bg-[#b89f53] text-black border border-black rounded-sm mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Finalisation en cours...' : 'Finaliser l\'achat'}
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full px-4 py-2 bg-[#dcc174] hover:bg-[#b89f53] text-black border border-black rounded-sm mt-3"
          >
            Finaliser l'achat
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
