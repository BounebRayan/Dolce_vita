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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      
      {stats.map(({ period, products }) => (
        <div key={period} className="bg-white shadow rounded-md">
          <div className="bg-[#dcc174] w-full h-2 rounded-t-md"></div>
          <h2 className="text-xl font-semibold capitalize px-4 pt-3">{`Meilleurs Produits (${period})`}</h2>
          <ol className="mt-2 space-y-2 px-4 mb-3">
            {products.map((product) => (
              <li key={product.productName} className="flex justify-between pl-1 items-center">
                <Link
                  href={`/admin/product/${product._id}`}
                  className="font-medium cursor-pointer hover:underline flex items-center gap-2"
                >
                  {product.productName} <RiExternalLinkLine className="h-4 w-4 text-black" />
                </Link>
                <span className="font-semibold">{product.unitsSold} units sold</span>
              </li>
            ))}
          </ol>
        </div>
      ))}

      <div className="bg-white shadow rounded-md">
      <div className="bg-[#dcc174] w-full h-2 rounded-t-md"></div>
        <h2 className="text-xl font-semibold px-4 pt-3">Meilleurs Sous-catégories</h2>
        <ul className="mt-2 space-y-2  px-4 mb-3">
          {successfulSubcategories.map((subcategory) => (
            subcategory.totalUnitsSold !== 0 ? 
            <li key={subcategory._id} className="flex justify-between items-center">
              <span className="ml-1">{subcategory._id || 'Uncategorized'}</span>
              <span className="font-semibold">{subcategory.totalUnitsSold} units sold</span>
            </li> : ""
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductsStatsCard;
