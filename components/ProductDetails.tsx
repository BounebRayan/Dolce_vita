"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'; // Icons for description toggle
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
  "rouge": "red",
  "bleu": "blue",
  "vert": "green",
  "jaune": "yellow",
  "noir": "black",
  "blanc": "white",
  "gris": "gray",
  "rose": "pink",
  "orange": "orange",
  "violet": "purple",
  "noyer": "#8B5A2B",          // Walnut brown
  "chêne clair": "#D2B48C",    // Light oak
  "chêne foncé": "#8B4513",
  // Add more mappings as needed
};

const ProductDetails = ({ productId }: Props) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(''); 
  const [showDescription, setShowDescription] = useState(false); // State to toggle description

  // Fetch product details from the backend when the component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        console.log(response);
        setProduct(response.data);
        setSelectedImage(response.data.images[response.data.mainImageNumber] || response.data.images[0]);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert("Please select a color before adding to cart.");
      return;
    }
    // Here, add logic to send the order with selectedColor
    console.log(`Product added to cart with color: ${selectedColor}`);
  };

  if (!product) return <div className='text-center mt-10'>Loading...</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 p-3 mx-32 mt-2">
        {/* Images Section */}
        <div className="flex flex-row items-start gap-3">
          <div className="mb-4 w-[650px] h-[650px] overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.productName}
              width={650}
              height={650}
              className="object-cover rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={160}
                height={160}
                className={`object-cover cursor-pointer max-h-[160px] max-w-[160px] rounded-sm border-2 ${img === selectedImage ? 'border-black' : ''}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-medium flex items-center gap-2">
            {product.productName}
            {product.isRecommended && <FaStar className="text-[#dcc174]" />}
          </h1>
          <p className="text-gray-600">{product.category} - {product.subCategory}</p>

          {/* Pricing Display */}
          <div className="my-1 mb-2">
            {product.onSale ? (
              <p className="text-black font-medium">
                {(product.price * (1 - product.salePercentage / 100)).toFixed(2)}DT
                <span className="line-through text-gray-500 ml-2">{product.price.toFixed(2)}DT</span>
              </p>
            ) : (
              <p className="font-medium">{product.price.toFixed(2)}DT</p>
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
              <p className="mt-2 text-gray-700">{product.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-1 border-t border-gray-300 p-3">
            <span>Couleurs disponibles</span>
            <div className="flex gap-2">
              {product.availableColors.map((color, index) => {
                const mappedColor = colorMapping[color.toLowerCase()] || color;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-sm border cursor-pointer relative after:absolute after:w-full after:h-[0.5px] after:bg-black after:left-0 after:-bottom-[4px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0 ${selectedColor === color ? 'after:scale-x-100' : ''}`}
                    style={{ backgroundColor: mappedColor }}
                    title={color}
                  ></div>
                );
              })}
            </div>
          </div>

          {/* Dimensions */}
          <div className="border-t border-gray-300 p-3">
            <p>Dimensions (L x W x H): {`${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height}`}cm</p>
          </div>

          {/* Client Reviews */}
          <div className="border-t border-gray-300 p-3 flex items-center justify-between">
            <span> Avis clients</span>
            <div className='flex item-center'>
            <div className="flex items-center mr-2">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar key={i} className={`h-4 w-4 ${i < Math.round(product.reviewsValue) ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviewsCount})</span>
            </div>
          </div>

          <button onClick={handleAddToCart} className="px-4 py-2 bg-[#dcc174] hover:bg-[#b89f53] text-black rounded-sm select-none border-black border w-full">
            Ajouter au panier
          </button>
        </div>
      </div>
      <RelatedProducts subCategory={product.subCategory} />
    </>
  );
};

export default ProductDetails;
