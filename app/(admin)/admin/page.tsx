'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StatsCard } from '@/components/StatsCard';
import LastOrders from '@/components/LatestCommands';
import ProductsStatsCard from '@/components/ProductsStatsCard';

interface Stats {
  totalRevenue?: number;
  totalOrders?: number;
  totalProductsSold?: number;
  totalPendingOrders?: number;
  totalConfirmedOrders?: number;
  totalCancelledOrders?: number;
  totalShippedOrders?: number;
  totalDeliveredOrders?: number;
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
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setData(response.data);
      } catch (err) {
        setError('An error occurred');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className=" mt-1 bg-white mx-3 sm:mx-12 p-4 pt-3 rounded-sm">
      {/*<h1 className="text-2xl font-bold mb-4">Dernières commandes en attente</h1>
      <LastOrders />*/}
      <h1 className="text-2xl font-bold mb-4">Statistiques de vente</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loadingStats ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : data ? (
          <>
            <StatsCard title="Aujourd’hui" stats={data.orderStats.today} />
            <StatsCard title="Cette semaine" stats={data.orderStats.week} />
            <StatsCard title="Ce mois" stats={data.orderStats.month} />
            <StatsCard title="Cette année" stats={data.orderStats.year} />
          </>
        ) : (
          <div className="col-span-full text-center">No data available</div>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-4 mt-5">Statistiques sur les produits</h1>
      <ProductsStatsCard />
    </div>
  );
};

export default StatsPage;
