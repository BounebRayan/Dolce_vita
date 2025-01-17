'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StatsCard } from '@/components/StatsCard';
import LastOrders from '@/components/LatestCommands';

interface Stats {
  totalRevenue?: number;
  totalOrders?: number;
  totalProductsSold?: number;
}

interface OrderStats {
  today: Stats;
  week: Stats;
  month: Stats;
  year: Stats;
}

interface StatsData {
  orderStats: OrderStats;
}

const StatsPage = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/stats');
        setData(response.data);
      } catch (err) {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="mx-3 sm:mx-12 py-4 pt-4 text-center">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!data) return <div>No data available</div>;

  const { orderStats } = data;

  return (
    <div className="min-h-screen bg-gray-100 mx-3 sm:mx-12 py-4 pt-4">
      <h1 className="text-2xl font-bold mb-4">Statistiques de vente</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Aujourd’hui" stats={orderStats.today} />
        <StatsCard title="Cette semaine" stats={orderStats.week} />
        <StatsCard title="Ce mois" stats={orderStats.month} />
        <StatsCard title="Cette année" stats={orderStats.year} />
      </div>
      <h1 className="text-2xl font-bold mb-4 mt-4">Dernières commandes</h1>
      <LastOrders />
    </div>
  );
};

export default StatsPage;
