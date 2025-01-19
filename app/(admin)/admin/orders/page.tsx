'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { format } from 'date-fns'; // Import date-fns

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
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('Pending');

  const fetchOrders = async (status:string) => {
    try {
      const response = await axios.get('/api/orders?status=' + status);
      const sortedOrders = response.data.sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId: string) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: 'Confirmed', // Send the status in the request body
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
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: 'Cancelled',
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
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: 'Shipped',
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
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: 'Delivered',
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

  return (
    <div className="p-3 px-12">
      <div className="mb-4">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
        Filtrer par statut :
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border border-gray-300 rounded-sm p-2 w-full"
        >
          <option value="Pending">En Attente</option>
          <option value="Confirmed">Confirmée</option>
          <option value="Shipped">Expédiées</option>
          <option value="Delivered">Livrée</option>
          <option value="Cancelled">Annulée</option>
        </select>
      </div>
      <h1 className="text-2xl font-semibold mb-6">Commandes</h1>
      {orders.length === 0 ? (
        <div className="text-center">Oups! Aucune commande trouvée.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-sm p-4 shadow-sm"
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
              
              <div className="mt-2">
                <h3 className="text-md font-medium mb-2">Produits ({order.products.length}):</h3>
                <ul className="space-y-2">
                  {order.products.map((product, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-4 border-b pb-2 last:border-b-0"
                    >
                      <img
                        src={product.image}
                        alt={product.product.name}
                        className="w-12 h-12 object-cover rounded-sm"
                      />
                      <div>
                        <Link
                          href={`/admin/product/${product.product._id}`}
                          className="font-medium text-blue-600 hover:underline"
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
              <textarea disabled={order.status === 'Delivered' || order.status === 'Cancelled'} name="notes" id="notes" className='w-full border border-black outline-none px-1'></textarea>
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
                  className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-sm border border-black hover:bg-red-700"
                  onClick={() => cancellOrder(order._id)}
                >
                  Cancell Order
              </button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
