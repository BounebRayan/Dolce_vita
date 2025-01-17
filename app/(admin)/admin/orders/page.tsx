'use client';

import { useEffect, useState } from 'react';
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

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
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
      fetchOrders(); // Refresh orders after confirmation
    } catch (err: any) {
      console.error(err);
      alert('Failed to confirm the order. Please try again.');
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-sm p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold">{order.name}</h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    order.status === 'Pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : order.status === 'Shipped'
                      ? 'bg-blue-200 text-blue-800'
                      : order.status === 'Delivered'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p>
                <strong>Phone:</strong> {order.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Total Amount:</strong> {order.totalAmount.toFixed(0)} DT
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {format(new Date(order.createdAt), 'PPpp')} {/* Format the date */}
              </p>
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Products:</h3>
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
              {order.status === 'Pending' && (
                <button
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700"
                  onClick={() => confirmOrder(order._id)}
                >
                  Confirm Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
