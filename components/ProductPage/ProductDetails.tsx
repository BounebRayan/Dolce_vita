"use client";
import { useCart } from '../../contexts/CartContext';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import RelatedProducts from './RelatedProducts';
import 'react-toastify/dist/ReactToastify.css';
import { BsFillStarFill } from 'react-icons/bs';
import { FaCircleInfo, FaCheck } from 'react-icons/fa6';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import MobileImageCarousel from './MobileImageCarousel';
import { getCategoryText, getSubsubcategoryByType } from '@/config/categories';


type Props = {
  productId: string;
};



type Variant = {
  label: string;
  price: number;
  isAvailable: boolean;
};

type Product = {
  productName: string;
  category: 'Meubles' | 'Déco';
  subCategory?: string;
  subSubCategory?: string;
  images: string[];
  onSale: boolean;
  salePercentage: number;
  price: number;
  variants?: Variant[];
  description: string;
  shortDescription?: string;
  brand?: string;
  isPurchasable?: boolean;
  availableColors: Array<{
    name: string;
    hex: string;
    image?: string;
  }>;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  isFeatured: boolean;
  unitsSold: number;
  reference: string;
};

const ProductDetails = ({ productId }: Props) => {

  const {items, addToCart } = useCart();


  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setSelectedColor(response.data.availableColors?.[0]?.name || '');
        setSelectedImageIndex(response.data.mainImageNumber || 0);
        const firstAvailable = response.data.variants?.findIndex((v: Variant) => v.isAvailable);
        if (firstAvailable !== undefined && firstAvailable >= 0) {
          setSelectedVariantIndex(firstAvailable);
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  const getActivePrice = () => {
    if (!product) return 0;
    const hasVariants = product.variants && product.variants.length > 0;
    const basePrice = hasVariants ? Number(product.variants![selectedVariantIndex]?.price ?? product.price) : product.price;
    if (product.onSale && product.salePercentage > 0) {
      return Math.round(basePrice * (1 - product.salePercentage / 100));
    }
    return Math.round(basePrice);
  };

  const handleAddToCart = () => {
    const isProductPurchasable = product?.category === 'Déco' || (product?.category === 'Meubles' && product?.isPurchasable);
    
    if (!isProductPurchasable) return;
    
    if (!selectedColor && product?.availableColors && product.availableColors.length > 0) {
      alert("Veuillez sélectionner une couleur avant de l'ajouter au panier.");
      return;
    }

    const hasVariants = product?.variants && product.variants.length > 0;
    if (hasVariants && !product!.variants![selectedVariantIndex]?.isAvailable) {
      alert("Cette variante n'est pas disponible.");
      return;
    }

    const uniqueId = `${productId}-${Date.now()}`;
    const selectedVariant = hasVariants ? product!.variants![selectedVariantIndex] : null;
  
    const item = {
      id: uniqueId,
      productId: productId,
      productName: product?.productName,
      price: getActivePrice(),
      quantity: 1,
      color: selectedColor || '',
      variant: selectedVariant?.label || '',
      image: product?.images[selectedImageIndex] || product?.images[0],
      reference: product?.reference,
    };
  
    addToCart(item);
  };

  const handlePreviousImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };
  
  // Build breadcrumb path
  const buildBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Accueil', href: '/' }
    ];

    if (product) {
      // Add category
      breadcrumbs.push({
        label: product.category === 'Déco' ? 'Décorations' : 'Meubles',
        href: product.category === 'Déco' ? '/decorations' : '/meubles'
      });

      // Add subcategory if exists
      if (product.subCategory) {
        const categoryText = getCategoryText(product.subCategory);
        breadcrumbs.push({
          label: categoryText,
          href: `/categories/${product.subCategory}`
        });
      }

      // Add subsubcategory if exists
      if (product.subSubCategory && product.subCategory) {
        const subsubCategory = getSubsubcategoryByType(product.subCategory, product.subSubCategory);
        if (subsubCategory) {
          breadcrumbs.push({
            label: subsubCategory.text,
            href: `/categories/${product.subCategory}/${product.subSubCategory}`
          });
        }
      }

      // Add product name (non-clickable)
      breadcrumbs.push({
        label: product.productName,
        href: ''
      });
    }

    return breadcrumbs;
  };

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  const breadcrumbs = buildBreadcrumbs();
  const isProductPurchasable = product.category === 'Déco' || (product.category === 'Meubles' && product.isPurchasable);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="px-3 md:px-12 lg:px-18 xl:px-24 2xl:px-36 mt-4 mb-4">
        <nav className="flex items-center text-sm text-gray-700">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-black transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-black">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-3 md:px-12 lg:px-18 xl:px-24 2xl:px-36">
        {/* Images Section - Left Side */}
        <div className="w-full md:w-1/2 lg:w-2/5">
          {/* Mobile Image Carousel */}
          <div className="block md:hidden mb-4">
            <MobileImageCarousel images={product.images} />
          </div>

          {/* Desktop Images */}
          <div className="hidden md:flex gap-4">
            {/* Thumbnail Images - Left Side */}
            {product.images.length > 1 && (
              <div className="flex flex-col gap-2">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 overflow-hidden rounded-sm cursor-pointer border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-black' 
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <Image
                      loading='lazy'
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Main Image with Navigation */}
            <div className="flex-1 relative group">
              <div className="w-full aspect-square overflow-hidden rounded-sm">
                <Image
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.productName}
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Navigation Buttons */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 backdrop-blur-sm bg-black/25 hover:bg-black/40 rounded-sm transition-opacity duration-300"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 backdrop-blur-sm bg-black/25 hover:bg-black/40 rounded-sm transition-opacity duration-300"
                  >
                    <ChevronRightIcon className="h-5 w-5 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Card - Right Side */}
        <div className="w-full md:w-1/2 lg:w-3/5 bg-white px-5 pt-5 rounded-sm">
          <h1 className="text-2xl md:text-4xl font-light"> 
            {product.productName}
          </h1>

          {/* Pricing Display */}
          {isProductPurchasable && (
            <div className="mb-4">
              {(() => {
                const hasVariants = product.variants && product.variants.length > 0;
                const currentPrice = hasVariants 
                  ? Number(product.variants![selectedVariantIndex]?.price ?? product.price) 
                  : product.price;
                
                if (product.onSale) {
                  return (
                    <p className="text-black font-medium text-xl">
                      {(currentPrice * (1 - product.salePercentage / 100)).toFixed(0)} TND
                      <span className="line-through text-gray-500 ml-2 text-base">{currentPrice.toFixed(0)} TND</span>
                    </p>
                  );
                }
                return <p className="text-black font-medium text-xl">{currentPrice.toFixed(0)} TND</p>;
              })()}
            </div>
          )}

          {/* Short Description */}
          {product.shortDescription ? (
            <p className="text-gray-700 mb-4">{product.shortDescription}</p>
          ) : (
            <p className="text-gray-700 mb-4">
              {product.description.includes('.') ? product.description.split('.')[0] + '.' : product.description.substring(0, 150) + '...'}
            </p>
          )}

          {/* Color Selection */}
          {product.availableColors && product.availableColors.length > 0 && isProductPurchasable && (
            <div className="mb-6">
              <span className="block text-gray-700 mb-2">Sélectionnez une couleur</span>
              <div className="flex gap-2 flex-wrap">
                {product.availableColors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    className={`w-8 h-8 rounded-sm cursor-pointer border-2 relative transition-transform hover:scale-110 ${
                      selectedColor === color.name ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === color.name && (
                      <div className={`absolute inset-0 flex items-center justify-center ${
                        color.hex === '#000000' || color.hex === '#333333' ? 'text-white' : 'text-black'
                      } text-xs`}>
                        ✔
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.availableColors && product.availableColors.length > 0 && product.category === "Meubles" && !product.isPurchasable && (
            <div className="mb-6">
              <span className="block text-gray-700 mb-2">Couleurs disponibles</span>
              <div className="flex gap-2 flex-wrap">
                {product.availableColors.map((color, index) => (
                  <div
                    key={index}
                    title={color.name}
                    className="w-8 h-8 rounded-sm border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Variant / Dimension Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6 relative">
              <button
                type="button"
                onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-sm px-4 py-3 text-left hover:border-gray-500 transition-colors"
              >
                <span>{product.variants[selectedVariantIndex]?.label}</span>
                <svg className={`w-4 h-4 transition-transform ${showVariantDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showVariantDropdown && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-sm shadow-lg mt-1">
                  <div className="flex justify-end px-2 pt-2 pb-1 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowVariantDropdown(false)}
                      className="text-gray-500 hover:text-black"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={!variant.isAvailable}
                      onClick={() => {
                        if (variant.isAvailable) {
                          setSelectedVariantIndex(index);
                          setShowVariantDropdown(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left border-b border-gray-100 last:border-b-0 transition-colors ${
                        selectedVariantIndex === index
                          ? 'bg-gray-50 font-medium'
                          : variant.isAvailable
                            ? 'hover:bg-gray-50'
                            : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div>
                        <span className={selectedVariantIndex === index ? 'text-[#b89f53]' : ''}>{variant.label}</span>
                        {!variant.isAvailable && (
                          <span className="block text-xs text-orange-500">non disponible</span>
                        )}
                      </div>
                      <span className="text-gray-700">
                        {product.onSale
                          ? `${(Number(variant.price) * (1 - product.salePercentage / 100)).toFixed(0)} TND`
                          : `${Number(variant.price).toFixed(0)} TND`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector and Add to Cart Button */}
          {isProductPurchasable && (
            <div className="flex items-center gap-3 mb-4">
              
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-[#F6DB8D] hover:bg-[#b89f53] text-black uppercase font-medium rounded-sm transition-colors"
              >
                Ajouter au panier
              </button>
            </div>
          )}

          {/* Shipping Policy */}
          {isProductPurchasable && (
            <div className="border-t border-gray-300 py-3 flex justify-center items-center gap-2">
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <FaCircleInfo className="h-5 w-5 text-gray-800" />
                Livraison Gratuite à partir de 300DT d'Achat!
              </p>
            </div>
          )}

          {/* Dimensions */}
          {product.dimensions && product.dimensions.length != null && product.dimensions.width != null && product.dimensions.height != null && product.dimensions.length !== 0 && product.dimensions.width !== 0 && product.dimensions.height !== 0 && (
            <div className="border-t border-gray-300 py-3 mt-4">
              <p className="text-gray-700">
                Dimensions (L x W x H): {`${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height}`} {product.dimensions.unit}
              </p>
            </div>
          )}

          {/* Popularity 
          {product.category === "Déco" && (
            <div className="border-t border-gray-300 py-3 flex items-center justify-between">
              <span className="text-gray-700">Popularité</span>
              <div className="flex items-center gap-1">
                {[1, 3, 5, 10, 20].map((threshold, i) => (
                  <BsFillStarFill
                    key={i}
                    className={`h-4 w-4 ${product.unitsSold > threshold ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          )}*/}
        </div>
      </div>

      {/* Description Section - Below Images and Card */}
      <div className="px-3 md:px-12 lg:px-18 xl:px-24 2xl:px-36 mt-8 mb-8">
        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300"></div>
          <div className="relative inline-block bg-white pr-2">
            <h2 className="text-xl font-medium text-gray-800 uppercase">Description</h2>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts subCategory={product.subCategory} id={productId} />
    </>
  );
};

export default ProductDetails;
