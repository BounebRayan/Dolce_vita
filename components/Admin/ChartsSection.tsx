import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

interface StatsData {
  orderStats: {
    today: any;
    week: any;
    month: any;
    year: any;
  };
}

interface ChartsSectionProps {
  data: StatsData | null;
}

interface DailyData {
  date: string;
  orders: number;
  revenue: number;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const token = localStorage.getItem('admin_password');
        if (!token) return;

        // Generate last 30 days of data (mock data for now)
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          last30Days.push({
            date: date.toISOString().split('T')[0],
            orders: Math.floor(Math.random() * 20) + 5,
            revenue: Math.floor(Math.random() * 2000) + 500,
          });
        }
        setDailyData(last30Days);
      } catch (error) {
        console.error('Error fetching daily data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyData();
  }, []);

  if (!data || loading) return null;

  const orderStatusData = [
    { name: 'Livrées', value: data.orderStats.month.totalDeliveredOrders || 0, color: '#10b981' },
    { name: 'En attente', value: data.orderStats.month.totalPendingOrders || 0, color: '#f59e0b' },
    { name: 'Confirmées', value: data.orderStats.month.totalConfirmedOrders || 0, color: '#3b82f6' },
    { name: 'Expédiées', value: data.orderStats.month.totalShippedOrders || 0, color: '#8b5cf6' },
    { name: 'Annulées', value: data.orderStats.month.totalCancelledOrders || 0, color: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chiffre d'affaires quotidien (30 derniers jours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value} DT`}
            />
            <Tooltip 
              formatter={(value: any) => [`${value} DT`, 'Chiffre d\'affaires']}
              labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#374151" 
              strokeWidth={2}
              dot={{ fill: '#374151', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#374151', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Orders Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes quotidiennes (30 derniers jours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: any) => [value, 'Commandes']}
              labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="orders" 
              fill="#374151"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status Distribution 
      <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des commandes (Ce mois)</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [value, 'Commandes']}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {orderStatusData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
            </div>
          ))}
        </div> 
      </div>
      */}
    </div>
  );
};

export default ChartsSection;
