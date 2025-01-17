"use client";

import React, { useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';


export default function AddProductPage() {
  // State hooks
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [reference, setReference] = useState("");
  const [width, setWidth] = useState<number | string>(0);
  const [height, setheight] = useState<number | string>(0);
  const [length, setLength] = useState<number | string>(0);
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [salePercentage, setSalePercentage] = useState<number | string>(0);
  const [recommended, setRecommended] = useState(false);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUpload, setImageUpload] = useState<File | null>(null);

  // Add a color to available colors
  const handleAddColor = (color: string) => {
    if (color && !availableColors.includes(color)) {
      setAvailableColors([...availableColors, color]);
    }
  };

  const handleDeleteColor = (color: string) => {
    setAvailableColors(availableColors.filter(c => c !== color));
  };

  const handleDeleteImage = async (imageName:string) => {
    try {
      const response = await fetch(`${API_URL}?fileName=${encodeURIComponent(imageName)}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Update the state on successful deletion
        setImages(images.filter((img) => img !== imageName));
      } else {
        console.error('Failed to delete image:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  const API_URL = process.env.API_URL || "/api/upload-image/";
  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageUpload) return;

    const uniqueFileName = `${Date.now()}_${imageUpload.name}`;
    const formData = new FormData();
    formData.append("file", new File([imageUpload], uniqueFileName));

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      setImages([...images, result.imageUrl]);
      //setImageUpload(null);
    } else {
      console.error("Image upload failed:", result.error);
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dimensions = {length, height, width}

    const newProduct = {
      productName,
      category,
      reference,
      subCategory,
      price: parseFloat(price as string),
      description,
      onSale,
      salePercentage: onSale ? parseFloat(salePercentage as string) : 0,
      recommended,
      dimensions,
      availableColors,
      images,
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      alert("Product added successfully!");
      // Reset form
      setProductName("");
      setCategory("");
      setSubCategory("");
      setPrice("");
      setDescription("");
      setOnSale(false);
      setSalePercentage(0);
      setRecommended(false);
      setAvailableColors([]);
      setImages([]);
    } else {
      console.error("Failed to add product");
    }
  };

  return (
    <div className="p-8 md:mx-52 mx-12">
      <h1 className="text-2xl font-bold mb-6 ">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block font-medium">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Reference</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            required
          />
        </div>

        {/* Subcategory */}
        <div>
          <label className="block font-medium">Subcategory</label>
          <input
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium">Price (DT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            rows={4}
          />
        </div>
        <div className="flex items-center gap-4">
          {/* Recommended Checkbox */}
        <div>
          <label className="block font-medium">Recommended</label>
          <input
            type="checkbox"
            checked={recommended}
            onChange={(e) => setRecommended(e.target.checked)}
            className="mt-1"
          />
        </div>
        {/* On Sale Checkbox */}
        <div>
          <label className="block font-medium">On Sale</label>
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
            className="mt-1"
          />
        </div>

        {/* Sale Percentage (only shown if On Sale) */}
        {onSale && (
          <div>
            <label className="block font-medium">Sale Percentage (%)</label>
            <input
              type="number"
              value={salePercentage}
              onChange={(e) => setSalePercentage(e.target.value)}
              className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            />
          </div>
        )}

        
        </div>
        {/* Dimensions Input */}
        <div>
          <label className="block font-medium">Dimensions L x W x H</label>
          <div className="flex gap-4">
            <input
              type="number"
              className="border p-2 rounded-sm border-black  w-full outline-none"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="Length"
            />
            <input
              type="number"
              className="border p-2 rounded-sm border-black  w-full outline-none"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            <input
              type="number"
              className="border p-2 rounded-sm border-black  w-full outline-none"
              value={height}
              onChange={(e) => setheight(e.target.value)}
            />
          </div>
        </div>

        {/* Available Colors */}
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
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none "
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <div key={color} className="flex items-center gap-2 relative">
              <span
                key={color}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm"
              >
                {color}
              </span>
              <button
              onClick={() => handleDeleteColor(color)}
              className="absolute -right-1 -top-1 bg-white/50 rounded-full border "
            >
              <XMarkIcon className="h-4 w-4 text-black transform transition duration-300 hover:scale-105"/>
            </button>
            </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Upload Images</label>
          <input
            type="file"
            onChange={(e) => setImageUpload(e.target.files?.[0] || null)}
            className="mt-1"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-sm"
          >
            Upload Image
          </button>
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative">
              <img
                key={index}
                src={img}
                alt={`Product Image ${index + 1}`}
                className="w-24 h-24 object-cover border"
              />
              <button
                onClick={() => handleDeleteImage(img)}
                className="absolute top-1 right-1 text-black bg-slate-200/50 p-1 rounded-full"
              >
                <XMarkIcon className="h-5 w-5 text-black transform transition duration-300 hover:scale-105"/>
              </button>
              </div>
            ))}
    
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-sm"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
