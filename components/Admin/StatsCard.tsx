interface Stats {
  totalDeliveredOrders?: number;
  totalShippedOrders?: number;
  totalPendingOrders?: number;
  totalConfirmedOrders?: number;
  totalRevenue?: number;
  totalOrders?: number;
  totalProductsSold?: number;
  totalCancelledOrders?: number;
}

interface StatsCardProps {
  title: string;
  stats: Stats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, stats }) => {
  // Helper function to format numbers for French locale
  const formatNumber = (num: number | undefined): string => {
    return new Intl.NumberFormat("fr-FR").format(num || 0);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>
      
      <div className="space-y-4">
        {/* Main metrics */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Chiffre d'affaires</span>
          <span className="text-lg font-semibold text-gray-900">{formatNumber(stats.totalRevenue)} DT</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Produits vendus</span>
          <span className="text-lg font-semibold text-gray-900">{formatNumber(stats.totalProductsSold)}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Total commandes</span>
          <span className="text-lg font-semibold text-gray-900">{formatNumber(stats.totalOrders)}</span>
        </div>
        
        {/* Order status breakdown */}
        <div className="pt-2">
          <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Détail des commandes</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">En attente</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.totalPendingOrders)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confirmées</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.totalConfirmedOrders)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expédiées</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.totalShippedOrders)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Livrées</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.totalDeliveredOrders)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Annulées</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.totalCancelledOrders)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
