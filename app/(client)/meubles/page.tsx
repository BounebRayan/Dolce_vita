'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import { categories } from '@/config/categories';

interface Product {
  _id: string;
  productName: string;
  category: 'Meubles' | 'Déco';
  subCategory?: string;
  images: string[];
  onSale: boolean;
  price: number;
  unitsSold: number;
  salePercentage: number;
}

interface CategoryProducts {
  [key: string]: Product[];
}

const MeublesPage = () => {
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      const productsByCategory: CategoryProducts = {};
      
      for (const category of categories.meuble) {
        try {
          const response = await axios.get('/api/products/subcategory', {
            params: {
              subcategory: category.type
            }
          });
          const products = response.data.slice(0, 10);
          if (products.length > 0) {
            productsByCategory[category.type] = products;
          }
        } catch (error) {
          console.error(`Error fetching products for ${category.type}:`, error);
        }
      }
      
      setCategoryProducts(productsByCategory);
      setLoading(false);
    };

    fetchCategoryProducts();
  }, []);

  if (loading) {
    return (
      <div className="mx-4 sm:mx-8 lg:mx-16 mt-3 mb-8">
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold mb-4">Meubles</h1>
          <p className="text-gray-600 mb-3">
            Découvrez notre collection de meubles pour aménager votre intérieur
          </p>
        </div>
        <p className="text-center text-lg">Un instant, nous récupérons les produits...</p>
      </div>
    );
  }

  const hasAnyProducts = Object.keys(categoryProducts).length > 0;

  return (
    <div className="mx-4 sm:mx-8 lg:mx-[80px] mt-3 mb-8">
      <div className="mb-3">
        <h1 className="text-[28px] font-semibold">Meubles</h1>
        <p className="text-gray-600 mb-3">
          Découvrez notre collection de meubles pour aménager votre intérieur
        </p>
      </div>
      <div className='border-t pt-2'></div>

      {hasAnyProducts ? (
        <div className="space-y-10">
          {Object.entries(categoryProducts).map(([categoryType, products]) => {
            const category = categories.meuble.find(cat => cat.type === categoryType);
            return (
              <div key={categoryType}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold capitalize">{category?.text}</h2>
                  <Link href={`/categories/${categoryType}`} className="text-sm underline">
                    Voir tous
                  </Link>
                </div>
                <div className="overflow-hidden">
                  <Marquee speed={50} gradient={false} autoFill={true}>
                    {products.map((product) => (
                      <Link key={product._id} href={`/product/${product._id}`}>
                        <div className="relative flex-none w-[500px] mr-4 cursor-pointer rounded-sm pb-1">
                          <img
                            src={product.images[0]}
                            alt={product.productName}
                            className="w-full object-cover rounded-sm aspect-[6/4]"
                            loading="lazy"
                          />
                          <h3 className="mt-1 text-sm lg:text-[14px] font-medium">{product.productName}</h3>
                        </div>
                      </Link>
                    ))}
                  </Marquee>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-lg">Rien ici pour le moment... mais de belles pièces arrivent bientôt.</p>
      )}
    </div>
  );
};

export default MeublesPage;
