'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { FaStar } from 'react-icons/fa'; // Import a star icon for recommended products
import RelatedProducts from './RelatedProducts';

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  // Fetch product details from the backend when the component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`products/${productId}`);
        console.log(response);
        setProduct(response.data);
        setSelectedImage(response.data.images[response.data.mainImageNumber] || response.data.images[0]); // Set main or first image
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <>
    <div className="flex flex-col md:flex-row gap-4 p-4 mx-20 ">
      {/* Images Section */}
      <div className="flex flex-row items-start gap-3">
        <div className="border mb-4">
          <Image
            src={selectedImage}
            alt={product.productName}
            width={450}
            height={450}
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          {product.images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              width={100}
              height={100}
              className={`cursor-pointer rounded-md border-2 ${img === selectedImage ? 'border-[#556b79]' : ''}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {product.productName}
          {product.isRecommended && <FaStar className="text-yellow-500" />} {/* Display star icon if recommended */}
        </h1>
        <p className="text-gray-600">{product.category} - {product.subCategory}</p>

        <div className="my-4">
          {product.onSale ? (
            <p className="text-red-500 text-xl font-semibold">
              Sale Price: {(product.price * (1 - product.salePercentage / 100)).toFixed(2)}DT
              <span className="line-through text-gray-500 ml-2">${product.price.toFixed(2)}</span>
            </p>
          ) : (
            <p className="text-xl font-semibold">{product.price.toFixed(2)}DT</p>
          )}
        </div>

        <p className="mb-4">{product.description}</p>

        {/* Available Colors Display */}
        <div className="flex flex-col items-start gap-2 my-4">
          <span className="font-medium">Couleurs disponibles:</span>
          <div className="flex gap-2 px-1">
            {product.availableColors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-sm border border-slate-800"
                style={{ backgroundColor: color }} // Set the background color dynamically
                title={color} // Optional: show color name on hover
              ></div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <div>Poids: {product.weight} kg</div>
        </div>

        <div className="mt-4">
          <p>Dimensions (L x W x H): {`${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height}`} cm</p>
        </div>

        <div className="mt-4">
          <p>Avis: {product.reviewsCount} ({product.reviewsValue}/5)</p>
        </div>

        <button className="mt-6 px-4 py-2 bg-[#556b79] text-black rounded-md select-none">
          Add to Cart
        </button>
      </div>
    </div>
    <RelatedProducts subCategory={product.subCategory} />
    </>
  );
};

export default ProductDetails;