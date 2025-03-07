"use client";
import Link from 'next/link';
import { useCart } from '../../../contexts/CartContext';
import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { RiExternalLinkLine } from "react-icons/ri";
import { MdOutlineLocalShipping } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CartItem {
  productId: any;
  reference: string;
  id: string;
  productName: string;
  price: number;
  color: string;
  quantity: number;
  image: string;
}

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState<number | null>(null);
  const [appliedPromoCodes, setAppliedPromoCodes] = useState<string[]>([]); // Store used promo codes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId);
  };

  const totalPriceBeforeDiscount = items.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);
  const shippingFee = totalPriceBeforeDiscount > 300 ? 0 : 8;

  const handlePromocode = async () => {
    if (!promoCode.trim()) {
      toast.error('Code promo requis');
      return;
    }

    if (appliedPromoCodes.includes(promoCode)) {
      toast.error('Ce code promo a déjà été appliqué');
      return;
    }

    try {
      const res = await fetch(`/api/promocode?code=${promoCode}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setDiscount(data.discount);
        setAppliedPromoCodes([...appliedPromoCodes, promoCode]); // Track applied promo code
        toast.success(`Code promo appliqué: ${data.discount}% de réduction`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'application du code promo:", error);
      toast.error('Une erreur est survenue lors de l\'application du code promo');
    }
  };

  const finalPrice = discount ? totalPriceBeforeDiscount * (1 - discount / 100) : totalPriceBeforeDiscount;
  const totalPriceWithShipping = finalPrice + shippingFee;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      name,
      phoneNumber: phone,
      address,
      totalPrice: totalPriceWithShipping,
      products: items.map((item: { productId: any; color: any; image: any; reference: any; productName: any; price: any; }) => ({
        product: item.productId,
        color: item.color,
        image: item.image,
        reference: item.reference,
        productName: item.productName,
        price: item.price,
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
        toast.success('Commande finalisée avec succès ! Nous vous appellerons bientôt pour confirmer votre commande.');
        clearCart();
        setShowForm(false);
      } else {
        const errorData = await response.json();
        toast.error(`Erreur: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la commande:', error);
      toast.error('Une erreur est survenue lors de la soumission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 text-xl mt-10">
        <div className="text-center mt-10">Il semble que votre panier est vide</div>
        <Link href="/" className="underline flex items-center gap-2">
          Jetez un coup d’œil à nos derniers produits <RiExternalLinkLine className='h-4 w-4 text-black'/>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:mx-12 lg:mx-32 mt-2 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-3xl font-light mb-4 md:text-3xl">Votre panier ({items.length} articles)</h1>

        <div className="grid gap-4">
          {items.map((item: CartItem) => (
            <div key={item.id} className="relative flex items-center justify-between border-b border-gray-300 pb-3">
              <div className="flex items-start gap-4">
                <div className="w-[110px] h-[110px] overflow-hidden rounded-md flex-grow flex items-center justify-center">
                  <Image src={item.image} alt={item.productName} width={140} height={140} className="object-cover rounded-sm" />
                </div>
                <div>
                  <Link href={`/product/${item.productId}`} className='flex items-center gap-2'>
                    <h2 className="text-2xl font-normal cursor-pointer">{item.productName} </h2>
                    <RiExternalLinkLine className='h-4 w-4 text-black'/>
                  </Link>
                  <p>Référence: {item.reference}</p>
                  <p>Couleur: {item.color}</p>
                  <p>Prix article: {item.price} DT</p>
                </div>
              </div>
              <button onClick={() => handleRemove(item.id)} className="absolute top-0 right-0">
                <XMarkIcon className="h-5 w-5 transform text-gray-500 transition duration-300 hover:scale-125"/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-sm shadow-md">
        <h2 className="text-2xl font-light mb-1">Récapitulatif de la commande</h2>
        <p className="text-lg mb-1">
          Montant Total: <span className="font-semibold">{totalPriceWithShipping.toFixed(2)} DT</span>
          {shippingFee > 0 && <span className="text-sm text-gray-600"> (8 DT frais de transport inclus)</span>}
        </p>

        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="promoCode" className="text-sm font-medium text-gray-700">Code Promo ({appliedPromoCodes.length}  appliqué)</label>
          <input
            type="text"
            id="promoCode"
            className="p-2 border border-gray-300 outline-none"
            placeholder="Entrez votre code promo"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button onClick={handlePromocode} className="p-2 border border-black w-full">
            Soumettre
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleFormSubmit} className="mt-2 space-y-3">
            <div>
              <label className="block">Nom complet:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-1 border rounded-sm outline-none" required />
            </div>
            <div>
              <label className="block">Numéro de téléphone:</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-1 border rounded-sm outline-none" required />
            </div>
            <div>
              <label className="block">Adresse de livraison:</label>
              <input type="text" onChange={(e) => setAddress(e.target.value)} className="w-full p-1 border rounded-sm outline-none" required />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-[#dcc174] hover:bg-[#b89f53] text-black border border-black rounded-sm mt-3" disabled={isSubmitting}>
              {isSubmitting ? 'Finalisation en cours...' : 'Finaliser l\'achat'}
            </button>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full px-4 py-2 bg-[#dcc174] hover:bg-[#b89f53] text-black border border-black rounded-sm mt-3">
            Finaliser l'achat
          </button>
        )}
        <div className="border-t border-gray-300 pt-3 pb-1 flex justify-center items-center gap-2 mt-2">
                  <MdOutlineLocalShipping className='h-5 w-5 text-black' /><p>Livraison à domicile sur toute la Tunisie (dans 48h)</p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
