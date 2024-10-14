import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  _id: string;
  productName: string;
  price: number;
  images: string[];
  // Add more fields as needed
}

interface Props {
  subCategory: string;
}

const RelatedProducts: React.FC<Props> = ({ subCategory }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await axios.get(`/api/products/subcategory`, {
          params: { subcategory: subCategory, limit: 4 }
        });
        setSimilarProducts(response.data);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [subCategory]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-8 mx-12">
      <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarProducts.length > 0 ? (
          similarProducts.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="text-center cursor-pointer transform transition duration-300 hover:scale-105">
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-[320px] object-cover rounded-sm"
                />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{product.productName}</h3>
                <p className="mt-1 text-gray-600">{product.price.toFixed(2)} DT</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No similar products found</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;