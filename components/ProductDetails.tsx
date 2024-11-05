"use client";
import { useCart } from '../contexts/CartContext';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import RelatedProducts from './RelatedProducts';

type Props = {
  productId: string;
};



type Product = {
  productName: string;
  category: string;
  subCategory: string;
  images: string[];
  mainImageNumber: number;
  onSale: boolean;
  salePercentage: number;
  price: number;
  description: string;
  availableColors: string[];
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  reviewsCount: number;
  reviewsValue: number;
  isRecommended: boolean;
};

const colorMapping: { [key: string]: string } = {
  rouge: "red",
  bleu: "blue",
  vert: "green",
  jaune: "yellow",
  noir: "black",
  blanc: "white",
  gris: "gray",
  rose: "pink",
  orange: "orange",
  violet: "purple",
  noyer: "#8B5A2B",
  "chêne clair": "#D2B48C",
  "chêne foncé": "#8B4513",
};

const ProductDetails = ({ productId }: Props) => {

  const {items, addToCart } = useCart();


  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(''); 
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setSelectedImage(response.data.images[response.data.mainImageNumber] || response.data.images[0]);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {

    const item = {
      id: productId+selectedColor,
      name: product?.productName,
      price: product?.price,
      quantity: 1,
      color: selectedColor,
      image: product?.images[0]
    };

    if (!selectedColor) {
      alert("Please select a color before adding to cart.");
      return;
    }
    addToCart(item);
    console.log(item);
  };

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 p-3 md:mx-12 lg:mx-32 mt-2">
        {/* Images Section */}
        <div className="flex flex-col items-center md:flex-row gap-3 md:items-start w-full md:w-[650px]">
          <div className="mb-4 w-full md:w-[400px] lg:w-[650px] h-auto overflow-hidden px-4">
            <Image
              src={selectedImage}
              alt={product.productName}
              width={650}
              height={650}
              className="object-cover rounded-sm"
            />
          </div>
          <div className="flex flex-row md:flex-col gap-2 overflow-auto">
            {product.images.map((img, index) => (
              <Image
                loading='lazy'
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={120}
                height={120}
                className={`object-cover cursor-pointer rounded-sm border-2 ${img === selectedImage ? 'border-black' : ''}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex-1 w-full md:max-w-[400px]">
          <h1 className="text-2xl md:text-3xl font-medium flex items-center gap-2">
            {product.productName}
            {product.isRecommended && <FaStar className="text-[#dcc174]" />}
          </h1>
          <p className="text-gray-600">{product.category} - {product.subCategory}</p>

          {/* Pricing Display */}
          <div className="my-1 mb-2">
            {product.onSale ? (
              <p className="text-black font-medium text-lg">
                {(product.price * (1 - product.salePercentage / 100)).toFixed(2)} DT
                <span className="line-through text-gray-500 ml-2">{product.price.toFixed(2)} DT</span>
              </p>
            ) : (
              <p className="font-medium text-lg">{product.price.toFixed(2)} DT</p>
            )}
          </div>

          {/* Collapsible Description */}
          <div className="border-t border-gray-300 p-3">
            <div
              className="flex items-center cursor-pointer justify-between"
              onClick={() => setShowDescription(!showDescription)}
            >
              <span className="mr-2">Description</span>
              {showDescription ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
            {showDescription && (
              <p className="mt-2 text-gray-700 text-sm">{product.description}</p>
            )}
          </div>

          {/* Color Selection */}
          <div className="flex items-center justify-between gap-1 border-t border-gray-300 p-3">
            <span>Couleurs disponibles</span>
            <div className="flex gap-2">
              {product.availableColors.map((color, index) => {
                const mappedColor = colorMapping[color.toLowerCase()] || color;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-sm border cursor-pointer ${selectedColor === color ? 'border-black' : ''}`}
                    style={{ backgroundColor: mappedColor }}
                    title={color}
                  ></div>
                );
              })}
            </div>
          </div>

          {/* Dimensions */}
          <div className="border-t border-gray-300 p-3">
            <p>Dimensions (L x W x H): {`${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height}`} cm</p>
          </div>

          {/* Client Reviews */}
          <div className="border-t border-gray-300 p-3 flex items-center justify-between">
            <span>Avis clients</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar key={i} className={`h-4 w-4 ${i < Math.round(product.reviewsValue) ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm text-gray-600">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-[#dcc174] hover:bg-[#b89f53] text-black rounded-sm w-full mt-4 border border-black"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts subCategory={product.subCategory} />
    </>
  );
};

export default ProductDetails;
