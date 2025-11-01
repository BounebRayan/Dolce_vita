import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { RiExternalLinkLine } from 'react-icons/ri';

interface ProductStats {
  period: string;
  products: {
    _id: any;
    productName: string;
    unitsSold: number;
    category: string;
    subCategory: string;
  }[];
}

interface SubcategoryStats {
  _id: string;
  totalUnitsSold: number;
}

const ProductsStatsCard: React.FC = () => {
  const [stats, setStats] = useState<ProductStats[]>([]);
  const [successfulSubcategories, setSuccessfulSubcategories] = useState<SubcategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {

      try {
        const token = localStorage.getItem('admin_password');

  if (!token) {
    return;
  }
        const response = await axios.get('/api/admin/productStats', {headers: {
          Authorization: `Bearer ${token}`,
        },});
        setStats(response.data.stats);
        console.log(response.data);
        setSuccessfulSubcategories(response.data.successfulSubcategories);
      } catch (error) {
        console.error('Error fetching product stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading statistics...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {stats.map(({ period, products }) => (
        <div key={period} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{`Meilleurs Produits (${period})`}</h2>
          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={product.productName} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/product/${product._id}`}
                      className="font-medium text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm leading-tight"
                    >
                      {product.productName} 
                      <RiExternalLinkLine className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    </Link>
                    <div className="text-xs text-gray-500 mt-1">
                      {product.category} • {product.subCategory}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-sm font-semibold text-gray-900">
                    {product.unitsSold}
                  </div>
                  <div className="text-xs text-gray-500">units sold</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Meilleures Sous-catégories</h2>
        <div className="space-y-3">
          {successfulSubcategories
            .filter(subcategory => subcategory.totalUnitsSold !== 0)
            .map((subcategory, index) => (
              <div key={subcategory._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xs">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 text-sm">
                    {subcategory._id || 'Uncategorized'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {subcategory.totalUnitsSold}
                  </div>
                  <div className="text-xs text-gray-500">units sold</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsStatsCard;
