'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns'; // Import date-fns
import order from '@/models/order';

interface Order {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
  products: {
    product: {
      productName: string;
      _id: string;
      name: string;
      price: number;
    };
    reference: string;
    color: string;
    image: string;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
  notes: string;
  shippedAt: string;
  deliveredAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('Pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notes,setNotes] = useState<string>('');

  const handleSearchClick = async () => {
try {
      setLoading(true);
      const response = await axios.get('/api/orders/search', {
        params: {
          ...(statusFilter && { status:statusFilter }),
          ...(searchQuery && { q:searchQuery }),
        },
      });
      setOrders(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (status:string) => {
    try {
      const response = await axios.get('/api/orders/search', {
        params: {
          ...(status && { status }),
          ...(searchQuery && { q:searchQuery }),
        },
      });
      setOrders(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId: string) => {
    
    try {
      const order = orders.find((order) => order._id === orderId);
      if (!order) {
        alert('Order not found!');
        return;
      }
  
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: 'Confirmed',
        notes: order.notes || ''// Send the status in the request body
      });
      alert('Order confirmed!');
      fetchOrders(statusFilter); // Refresh orders after confirmation
    } catch (err: any) {
      console.error(err);
      alert('Failed to confirm the order. Please try again.');
    }
  };


  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const cancellOrder = async (orderId: string) => {
    try {
      const order = orders.find((order) => order._id === orderId);
      if (!order) {
        alert('Order not found!');
        return;
      }
  

      const response = await axios.put(`/api/orders/${orderId}`, {
        status: 'Cancelled',
        notes: order.notes || ''
      });
      alert('Order cancelled!');
      fetchOrders(statusFilter); // Refresh orders after cancellation
    } catch (err: any) {
      console.error(err);
      alert('Failed to cancel the order. Please try again.');
    }
  };

  const shipOrder = async (orderId: string) => {
    try {
      const order = orders.find((order) => order._id === orderId);
      if (!order) {
        alert('Order not found!');
        return;
      }
  
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: 'Shipped',
        notes: order.notes || '',
        shippedAt: new Date().toISOString(), // Add the shippedAt date
      });
      alert('Order marked as shipped!');
      fetchOrders(statusFilter); // Refresh orders after marking as shipped
    } catch (err: any) {
      console.error(err);
      alert('Failed to mark the order as shipped. Please try again.');
    }
  };

  const deliverOrder = async (orderId: string) => {
    try {
      const order = orders.find((order) => order._id === orderId);
      if (!order) {
        alert('Order not found!');
        return;
      }
  
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: 'Delivered',
        notes: order.notes || '', // Use the notes field of the specific order
        deliveredAt: new Date().toISOString(), // Add the deliveredAt date
      });
  
      alert('Order marked as delivered!');
      fetchOrders(statusFilter); // Refresh orders after marking as delivered
    } catch (err: any) {
      console.error(err);
      alert('Failed to mark the order as delivered. Please try again.');
    }
  };
  
  function handleStatusFilterChange(event: ChangeEvent<HTMLSelectElement>): void {
    setStatusFilter(event.target.value);
  }

  const deleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);
      alert('Order deleted!');
      fetchOrders(statusFilter);
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete the order. Please try again.');
    }
  };

  function updateNotes(id: string, value: string): void {
    const orderIndex = orders.findIndex((order) => order._id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found.');
    }
  
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], notes: value };
  
    setOrders(updatedOrders);
  }

  return (
    <div className="p-3 px-4  sm:px-12">
            <h1 className="text-2xl font-semibold mb-2">Commandes</h1>
            {/* Search Input */}
            <div><label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Rechercher une commande :
        </label>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par ID, nom ou téléphone"
          className="border border-black rounded-sm p-2 w-full outline-none"></input>
        <button className='border border-black bg-gray-300 hover:bg-gray-400 p-2' onClick={handleSearchClick}>Rechercher</button>
      </div></div>

      <div className="mb-4">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
        Filtrer par statut :
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border border-black rounded-sm p-2 w-full outline-none"
        > 
          <option value="">Tous les états</option>
          <option value="Pending">En Attente</option>
          <option value="Confirmed">Confirmées</option>
          <option value="Shipped">Expédiées</option>
          <option value="Delivered">Livrées</option>
          <option value="Cancelled">Annulées</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center">Oups! Aucune commande trouvée.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`border border-black bg-white  ${''/*
                    order.status === 'Pending'
                      ? 'border-yellow-600'
                      : order.status === 'Confirmed'
                      ? 'border-blue-600'
                      : order.status === 'Shipped'
                      ? 'border-gray-600'
                      : order.status === 'Delivered'
                      ? 'border-green-600'
                      : 'border-red-600'
                  */} rounded-sm p-4 shadow-sm`}	
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold">ID: {order._id}</h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full border-black border ${
                    order.status === 'Pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : order.status === 'Confirmed'
                      ? 'bg-blue-200 text-blue-800'
                      : order.status === 'Shipped'
                      ? 'bg-gray-200 text-gray-800'
                      : order.status === 'Delivered'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p>
  <strong>Date du commande:</strong>{' '}
  {format(new Date(order.createdAt), 'PPpp')} {/* Format the date */}
  <span className="text-sm text-gray-600 ml-2">
    ({formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })})
  </span>
</p>
              <p>
                <strong>Client :</strong> {order.name}
              </p>
              <p>
                <strong>Numéro de téléphone:</strong> {order.phoneNumber}
              </p>
              <p>
                <strong>Addresse:</strong> {order.address}
              </p>
              <p>
                <strong>Montant total:</strong> {order.totalAmount.toFixed(0)} DT
              </p>
              {order.shippedAt && (
  <p>
    <strong>Expédié à:</strong>{' '}
    {format(new Date(order.shippedAt), 'PPpp')}{' '}
    <span className="text-sm text-gray-600 ml-2">
      ({formatDistanceToNow(new Date(order.shippedAt), { addSuffix: true })})
    </span>
  </p>
)}

{order.deliveredAt && (
  <p>
    <strong>Livré à :</strong>{' '}
    {format(new Date(order.deliveredAt), 'PPpp')}{' '}
    <span className="text-sm text-gray-600 ml-2">
      ({formatDistanceToNow(new Date(order.deliveredAt), { addSuffix: true })})
    </span>
  </p>
)}

              
              <div className="mt-2">
                <h3 className="text-md font-medium mb-2">Produits ({order.products.length}):</h3>
                <ul className="grid md:grid-cols-2 grid-cols-1">
                  {order.products.map((product, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-4 border-t pb-2"
                    >
                      <img
                        src={product.image}
                        alt={product.product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <Link
                          href={`/admin/product/${product.product._id}`}
                          className="font-medium underline"
                        >
                          {product.product.productName}
                        </Link>
                        <p className="text-sm text-gray-600">
                          <strong>Color:</strong> {product.color}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Reference:</strong> {product.reference}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <h3 className="text-md font-medium mt-1">Notes:</h3>
              <textarea key={order._id} disabled={order.status === 'Delivered' || order.status === 'Cancelled'} name="notes" id={order._id} value={order.notes} onChange={(e)=> updateNotes(order._id, e.target.value)} className='w-full border border-black outline-none px-1'></textarea>
              <div className='flex justify-center align-middle gap-4'>
              {order.status === 'Pending' && (
                <button
                  className="mt-4 w-full bg-[#dcc174] hover:bg-[#b89f53] text-black border border-black px-4 py-2 rounded-sm "
                  onClick={() => confirmOrder(order._id)}
                >
                  Confirm Order
                </button>
              )}
              
              {order.status=== "Confirmed" && (<button
                  className="mt-4 w-full bg-[#dcc174] hover:bg-[#b89f53] text-black border border-black px-4 py-2 rounded-sm"
                  onClick={() => shipOrder(order._id)}
                >
                  Mark as shipped
              </button>)}
              {order.status=== "Shipped" && (<button
                  className="mt-4 w-full bg-[#dcc174] hover:bg-[#b89f53] text-black  border border-black px-4 py-2 rounded-sm"
                  onClick={() => deliverOrder(order._id)}
                >
                  Mark as delivered
              </button>)}
              {order.status !== "Cancelled" && order.status !== "Delivered"  && <button
                  className="mt-4 w-full bg-red-600 text-black px-4 py-2 rounded-sm border border-black hover:bg-red-700"
                  onClick={() => cancellOrder(order._id)}
                >
                  Cancell Order
              </button>}
              {order.status == "Cancelled"  && <button
                  className="mt-4 w-full bg-red-600 text-black px-4 py-2 rounded-sm border border-black hover:bg-red-700"
                  onClick={() => deleteOrder(order._id)}
                >
                  Delete Order
              </button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
