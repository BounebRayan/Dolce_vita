'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
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

const DecorationsPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/api/products/subcategory', {
          params: {
            category: 'Déco',
            sortAttribute: 'unitsSold',
            sortOrder: 'desc'
          }
        });
        setFeaturedProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="mx-4 sm:mx-8 lg:mx-12 mt-1 md:mt-2">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-4">Décorations</h1>
        <p className="text-gray-600 mb-6">
          Découvrez notre collection de décorations pour embellir votre intérieur
        </p>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-light mb-6">Nos Catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.deco.map((category) => (
            <Link 
              key={category.type} 
              href={`/decorations/${category.type}`}
              className="group"
            >
              <div className="bg-gray-100 p-6 rounded-sm hover:bg-gray-200 transition-colors">
                <h3 className="font-medium text-center group-hover:text-gray-700">
                  {category.text}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-light mb-6">Produits Populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`}>
                <div className="cursor-pointer transform transition duration-300 hover:scale-[1.02] rounded-sm pb-1">
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className="w-full object-cover rounded-sm aspect-[4/5]"
                    loading="lazy"
                  />
                  <h3 className="mt-1 text-sm lg:text-[14px] font-medium">{product.productName}</h3>
                  <p className="text-sm text-gray-600">
                    {product.onSale ? (
                      <div>
                        {(product.price * (1 - product.salePercentage / 100)).toFixed(0)} DT
                        <span className="line-through text-gray-500 ml-2">{product.price.toFixed(0)} DT</span>
                      </div>
                    ) : (
                      <div>{product.price.toFixed(0)} DT</div>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DecorationsPage;
