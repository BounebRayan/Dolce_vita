"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { XMarkIcon } from '@heroicons/react/24/outline';

type Props = {
  productId: string;
};

type Product = {
  productName: string;
  category: string;
  subCategory: string;
  images: string[];
  onSale: boolean;
  salePercentage: number;
  price: number;
  description: string;
  availableColors: string[];
  dimensions: {
    length: number | null;
    width: number | null  ;
    height: number | null;
  };
  isRecommended: boolean;
  unitsSold: number;
};

const AdminProductDetails = ({ productId }: Props) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [localImage, setLocalImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setSelectedImageIndex(response.data.images[0] ? 0 : -1); // Select the first image by default
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  const handleAddColor = (color: string) => {
    if (product && color && !product.availableColors.includes(color)) {
      setProduct({
        ...product,
        availableColors: [...product.availableColors, color],
      });
    }
  };

  const handleDeleteColor = (color: string) => {
    if (product) {
      const updatedProduct = {
        ...product,
        availableColors: product.availableColors.filter(c => c !== color)
      };
      setProduct(updatedProduct);
    }
  };

  const handleSaveMainImage = async () => {
    if (!product || selectedImageIndex === -1) return;

    const updatedImages = [...product.images];
    // Move the selected image to the first position in the array
    const [selectedImage] = updatedImages.splice(selectedImageIndex, 1);
    updatedImages.unshift(selectedImage);

    try {
      const updatedProduct = { ...product, images: updatedImages };

      await axios.put(`/api/products/${productId}`, updatedProduct);
      setProduct(updatedProduct);
      setSelectedImageIndex(0); // Set the first image as selected
      alert("Main image updated successfully!");
    } catch (error) {
      console.error("Failed to update main image:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (product) {
      try {
        await axios.put(`/api/products/${productId}`, product);
        alert("Product updated successfully!");
      } catch (error) {
        console.error("Failed to update product:", error);
        alert("Error updating product!");
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (product) {
      try {
        await axios.delete(`/api/products/${productId}`);
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Failed to update product:", error);
        alert("Error updating product!");
      }
    }
  };

  const API_URL = process.env.API_URL || "/api/upload-image/";

const handleLocalImageUpload = async () => {
  if (!localImage || !product) return;

  const uniqueFileName = `${Date.now()}_${localImage.name}`;
  const formData = new FormData();
  formData.append("file", new File([localImage], uniqueFileName));

  try {
    const response = await axios.post(API_URL, formData);

    const imageUrl = response.data.imageUrl;
    const updatedProduct = {
      ...product,
      images: [...product.images, imageUrl],
    };

    await axios.put(`/api/products/${productId}`, updatedProduct);
    setProduct(updatedProduct);
    setLocalImage(null);
    alert("Image uploaded successfully!");
  } catch (error) {
    console.error("Failed to upload image:", error);
  }
};

const handleDeleteImage = async (index: number) => {
  if (!product) return;

  // Get the image URL to delete
  const imageUrl = product.images[index];

  // Extract the image name from the URL
  const imageName = imageUrl.split('/').pop(); // Assumes URL ends with the image name
  if (!imageName) {
    alert("Failed to determine the image name.");
    return;
  }

  // Update the product images array
  const updatedImages = product.images.filter((_, idx) => idx !== index);
  const updatedProduct = { ...product, images: updatedImages };

  try {
    // Update product in the database
    await axios.put(`/api/products/${productId}`, updatedProduct);
    setProduct(updatedProduct);

    // Delete the image from the server
    await fetch(`${API_URL}?fileName=${encodeURIComponent(imageName)}`, {
      method: "DELETE",
    });

    alert("Image deleted successfully!");
  } catch (error) {
    console.error("Failed to delete image:", error);
    alert("Error deleting image!");
  }
};

  
  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-2 p-6 md:mx-16 sm:mx-6 mx-2">
      {/* Images Section */}
      <div className="w-full md:w-1/2 flex gap-2">
        <div className="mb-4">
          <Image
            src={product.images[selectedImageIndex]}
            alt={product.productName}
            width={750}
            height={750}
            className="object-cover rounded-sm border"
          />
        </div>
        <div className="flex flex-col flex-wrap gap-2">
          {product.images.map((img, index) => (
            <div key={index} className="relative">
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className={`cursor-pointer rounded-sm border-2 transition ${
                  index === selectedImageIndex
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => setSelectedImageIndex(index)} // Set selected image index
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-1 right-1 text-black bg-slate-200/50 p-1 rounded-full"
              >
                <XMarkIcon className="h-5 w-5 text-black transform transition duration-300 hover:scale-105"/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 space-y-4">
        <input
          className="text-xl font-bold border p-2 w-full rounded-sm"
          value={product.productName}
          onChange={(e) =>
            setProduct({ ...product, productName: e.target.value })
          }
        />

        <textarea
          className="border p-2 w-full rounded-sm"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          placeholder="Product Description"
        ></textarea>

        <div className="flex gap-3 items-center">
          <input
            type="number"
            className="border p-2 rounded-sm"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: parseFloat(e.target.value) })
            }
            placeholder="Price"
          />
          <input
            type="number"
            className="border p-2 rounded-sm"
            value={product.salePercentage}
            onChange={(e) =>
              setProduct({
                ...product,
                salePercentage: parseInt(e.target.value),
              })
            }
            placeholder="Sale Percentage"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={product.onSale}
              onChange={(e) =>
                setProduct({ ...product, onSale: e.target.checked })
              }
            />
            On Sale
          </label>
        </div>

        <div>
          <label className="block font-medium">Available Colors</label>
          <input
            type="text"
            placeholder="Add a color (e.g., Red)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddColor(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
            className="mt-1 p-2 border rounded w-full"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {product.availableColors.map((color) => (
              <div key={color} className="flex items-center gap-2">
                <div className="relative">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{color}</span>
                <button
                  onClick={() => handleDeleteColor(color)}
                  className="absolute -right-1 -top-1 bg-white/50 rounded-full border "
                >
                  <XMarkIcon className="h-4 w-4 text-black transform transition duration-300 hover:scale-105"/>
                </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dimensions Section */}
        <div>
  <label className="block font-medium">Dimensions L x W x H</label>
  <div className="flex gap-4">
    <input
      type="number"
      className="border p-2 rounded-sm"
      value={product.dimensions?.length ?? ''}
      onChange={(e) =>
        setProduct({
          ...product,
          dimensions: { 
            ...product.dimensions, 
            length: e.target.value ? parseFloat(e.target.value) : null 
          },
        })
      }
      placeholder="Length"
    />
    <input
      type="number"
      className="border p-2 rounded-sm"
      value={product.dimensions?.width ?? ''}
      onChange={(e) =>
        setProduct({
          ...product,
          dimensions: { 
            ...product.dimensions, 
            width: e.target.value ? parseFloat(e.target.value) : null 
          },
        })
      }
      placeholder="Width"
    />
    <input
      type="number"
      className="border p-2 rounded-sm"
      value={product.dimensions?.height ?? ''}
      onChange={(e) =>
        setProduct({
          ...product,
          dimensions: { 
            ...product.dimensions, 
            height: e.target.value ? parseFloat(e.target.value) : null 
          },
        })
      }
      placeholder="Height"
    />
  </div>
</div>


        <input
          type="file"
          className="border rounded-sm p-2 w-full"
          onChange={(e) => setLocalImage(e.target.files ? e.target.files[0] : null)}
        />
        {localImage && (
          <button
            onClick={handleLocalImageUpload}
            className="px-4 py-2 mt-2 bg-gray-500 text-white rounded-sm w-full"
          >
            Upload Local Image
          </button>
        )}

        <div className="flex gap-4 items-center">
        <button
            onClick={handleDeleteProduct}
            className="px-4 py-2 bg-red-500 text-white rounded-sm"
          >
            Delete Product
          </button>
          <button
            onClick={handleSaveMainImage}
            className="px-4 py-2 bg-blue-500 text-white rounded-sm"
          >
            Save Main Image
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-green-500 flex-grow text-white rounded-sm"
          >
            Save Changes
          </button>
        </div>

       
      </div>
    </div>
  );
};

export default AdminProductDetails;
