'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { format } from 'date-fns';

interface Order {
  _id: string;
  name: string;
  totalAmount: number;
  products: {
    image: string;
  }[];
  createdAt: string;
}

const LastOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        const sortedOrders = response.data.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders.slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      {orders.length === 0 ? (
        <div className="text-center">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <img
                src={order.products[0]?.image || '/placeholder.png'}
                alt={order.name}
                className="w-12 h-12 object-cover rounded-full mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-medium">{order.name}</h2>
                <p className="text-gray-600">Total: {order.totalAmount.toFixed(2)} DT</p>
              </div>
              <p className="text-sm text-gray-500">
                {format(new Date(order.createdAt), 'PPpp')}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <Link
          href="/admin/orders"
          className="text-blue-600 hover:underline text-lg"
        >
          See All Orders
        </Link>
      </div>
    </div>
  );
};

export default LastOrders;
