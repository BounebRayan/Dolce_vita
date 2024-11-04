import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  _id: string;
  productName: string;
  price: number;
  images: string[];
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
          params: { subcategory: subCategory, limit: 5 }
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

  if (loading) return <div className='text-center pt-5'>Loading...</div>;

  return (
    <div className="mt-3 mx-4 md:mx-24 border-t-[1.5px] border-gray-300 px-3 py-4">
      <h2 className="text-lg md:text-2xl font-medium mb-4">Les clients ont également consulté</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {similarProducts.length > 0 ? (
          similarProducts.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="cursor-pointer transform transition duration-300 hover:scale-105">
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] object-cover rounded-sm"
                  loading="lazy"
                />
                <h3 className="mt-2 text-sm sm:text-md font-bold">{product.productName}</h3>
                <p className="text-sm sm:text-md text-gray-600">{product.price.toFixed(2)} DT</p>
              </div>
            </Link>
          ))
        ) : (
          <p>Aucun produit similaire n'a été trouvé 😔</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
