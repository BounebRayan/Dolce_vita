
interface Stats {
  totalRevenue?: number;
  totalOrders?: number;
  totalProductsSold?: number;
}

interface StatsCardProps {
  title: string;
  stats: Stats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, stats }) => {
  return (
    <div className="bg-white shadow-md rounded-lg ">
        <div className="bg-[#dcc174] w-full h-2 rounded-t-lg"></div>
        <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 ">{title}</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Chiffre d’affaires total :</span>
          <span>{stats.totalRevenue?.toFixed(2) || 0} DT</span>
        </div>
        <div className="flex justify-between">
          <span>Nombre des commandes :</span>
          <span>{stats.totalOrders || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Nombre des produits vendus :</span>
          <span>{stats.totalProductsSold || 0}</span>
        </div>
      </div>
      </div>
    </div>
  );
};