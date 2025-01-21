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
    <div className="bg-white shadow-md rounded-md">
      <div className="bg-[#dcc174] w-full h-2 rounded-t-md"></div>
      <div className="px-6 pb-3 pt-3">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="space-y-2 ml-1">
          <div className="flex justify-between">
            <span>Chiffre d’affaires total :</span>
            <span className="font-semibold">{formatNumber(stats.totalRevenue)} DT</span>
          </div>
          <div className="flex justify-between">
            <span>Produits vendus :</span>
            <span className="font-semibold">{formatNumber(stats.totalProductsSold)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total des commandes :</span>
            <span className="font-semibold">{formatNumber(stats.totalOrders)}</span>
          </div>
          <div className="flex justify-between pl-6">
            <span>Commandes en attente :</span>
            <span className="font-semibold">{formatNumber(stats.totalPendingOrders)}</span>
          </div>
          <div className="flex justify-between pl-6">
            <span>Commandes confirmées :</span>
            <span className="font-semibold">{formatNumber(stats.totalConfirmedOrders)}</span>
          </div>
          <div className="flex justify-between pl-6">
            <span>Commandes annulées :</span>
            <span className="font-semibold">{formatNumber(stats.totalCancelledOrders)}</span>
          </div>
          <div className="flex justify-between pl-6">
            <span>Commandes expédiées :</span>
            <span className="font-semibold">{formatNumber(stats.totalShippedOrders)}</span>
          </div>
          <div className="flex justify-between pl-6">
            <span>Commandes livrées :</span>
            <span className="font-semibold">{formatNumber(stats.totalDeliveredOrders)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
