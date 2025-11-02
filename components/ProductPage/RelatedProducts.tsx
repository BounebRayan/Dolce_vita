import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  category: 'Meubles' | 'Déco';
  subCategory?: string;
  salePercentage: number;
  onSale: boolean;
  _id: string;
  productName: string;
  price: number;
  images: string[];
  brand?: string;
  isPurchasable?: boolean;
}

interface Props {
  subCategory: string | undefined;
  id: string;
}

const RelatedProducts: React.FC<Props> = ({ subCategory, id }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await axios.get(`/api/products/subcategory`, {
          params: { subcategory: subCategory },
        });
        setSimilarProducts(response.data.slice(0, 5)); // Limit to 5 products
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [subCategory]);

  if (loading) return <div className="text-center pt-5">Loading...</div>;

  // Filter out the current product from the list
  const filteredProducts = similarProducts.filter((product) => product._id !== id);
  let gridCols = '';
  if(similarProducts.length > 0) {
    gridCols = similarProducts[0].category === 'Meubles' ? 'xl:grid-cols-3 grid-cols-1' : 'xl:grid-cols-5 grid-cols-1 sm:grid-cols-2';
  }

  return (
    <div className="mt-3 mx-4 md:mx-12 lg:mx-18 xl:mx-24 2xl:mx-36 border-t-[1.5px] border-gray-300 px-3 py-4">
      <h2 className="text-lg md:text-2xl font-light mb-4">Les clients ont également consulté</h2>
      <div className={`grid ${gridCols} sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4`}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="cursor-pointer transform transition hover:scale-[1.02] duration-300 pb-1">
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] object-cover"
                  loading="lazy"
                />
                <h3 className="mt-1 text-sm sm:text-md font-medium">{product.productName}</h3>
                {product.category === "Meubles" && product.brand && (
                  <p className="text-xs sm:text-sm text-gray-500">{product.brand}</p>
                )}
                {(product.category === "Déco" || (product.category === "Meubles" && product.isPurchasable)) && (
                  <p className="text-sm sm:text-md text-gray-600">
                    {product?.onSale ? (
                      <div>{(product.price * (1 - product.salePercentage / 100)).toFixed(0) } DT<span className="line-through text-gray-500 ml-2">{product.price.toFixed(0)} DT</span></div>
                    ) : (
                      <div>{product?.price.toFixed(0)} DT</div>
                    )}
                  </p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p>Aucun produit similaire n'a été trouvé</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
