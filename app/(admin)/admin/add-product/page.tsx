"use client";

import React, { useEffect, useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { isAuthenticated } from "@/lib/auth";

const categories = { 
  deco: [
    'Accessoires Déco',  'Art de la Table', 'Vases', 'Luminaires', 'Miroirs',
      'Statues', "Bougies & Parfums d’Intérieur", 'Porte-Bougies', 'Linge de Maison', 'Cadres Photo',
      'Décorations Murales', 'Plantes'
  ],
  meuble: ['Salons', 'Chambres', 'Salles à Manger', 
      'Canapés & Fauteuils', 'Tables basses & Tables de coin', 'Meubles TV', 
      "Consoles & Meubles d’Entrée"],
};

const colors = { 
  rouge: "#f56565",
  bleu: "#4299e1",
  vert: "#48bb78",
  jaune: "#ecc94b",
  noir: "#000000",
  blanc: "#ffffff",
  gris: "#a0aec0",
  rose: "#fbb6ce",
  orange: "#ed8936",
  violet: "#9f7aea",
  noyer: "#8B5A2B",
  "chêne clair": "#D2B48C",
  "chêne foncé": "#8B4513",
  marron: "#6B4226",
  beige: "#f5f5dc",
  chocolat: "#3E2723",
  sable: "#F4A300",
  crème: "#FFF5E1",
  pierre: "#B4A48D",
  "gris souris": "#A8A8A8",
  "vert sauge": "#B2AC88",
  caramel: "#FFD700",
  bordeaux: "#800000",
  pistache: "#93C572",
  taupe: "#483C32",
  "taupe clair": "#B2A18D",
  "vert d'eau": "#A0D1B1",
  émeraude: "#50C878",
  "noir charbon": "#333333",
  "blanc cassé": "#F8F8F8",
  "gris clair": "#D3D3D3",
  moutarde: "#FFDB58",
  "bleu pétrole": "#006F73",
  ocre: "#C2A000",
  "gris perle": "#E8E8E8",
  "gris foncé": "#595959",
  lavande: "#E6E6FA",
  "pierre de lune": "#B4B0A4",
  menthe: "#98FF98",
  safran: "#F4C430",
  azur: "#007FFF",
  magenta: "#FF00FF",
  aubergine: "#580F41",
  "bleu marine": "#003366",
  "gris cendré": "#8A8D8F",
  "vert olive": "#556B2F",
  pêche: "#FFDAB9",
  corail: "#FF7F50",
  or: "#FFD700",
  argent: "#C0C0C0",
  "bleu ciel": "#87CEEB",
  noisette: "#6F4F1A",
  canard: "#006F73",
  "rose pâle": "#FADCD9",
  "aubergine clair": "#7A2A59",
};


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
  const colorKeys = Object.keys(colors);
  const [selectedColor, setSelectedColor] = useState<string>("");

    useEffect(() => {
      if (!isAuthenticated()) {
        window.location.href = '/admin/login'; // Redirect to login page
      }
    }, []);

  const subcategories = category === 'Déco' 
    ? categories.deco 
    : category === 'Meubles' 
      ? categories.meuble 
      : [];

  // Add a color to available colors
  const handleAddColor = (color: string) => {
    if (color && !availableColors.includes(color)) {
      setSelectedColor("");
      setAvailableColors([...availableColors, color]);
    }
  };

  const handleDeleteColor = (color: string) => {
    setAvailableColors(availableColors.filter(c => c !== color));
  };
  const API_URL = "/api/upload-image/";
  const handleDeleteImage = async (imageName:string) => {
    try {
      const token = localStorage.getItem('admin_password');

if (!token) {
  return;
}
      const response = await fetch(`${API_URL}?fileName=${encodeURIComponent(imageName)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Add token for authentication
        },
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
  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageUpload) return;

    const uniqueFileName = `${Date.now()}_${imageUpload.name}`;
    const formData = new FormData();
    formData.append("file", new File([imageUpload], uniqueFileName));

    const token = localStorage.getItem('admin_password');

if (!token) {
  return;
}

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

    const token = localStorage.getItem('admin_password');

    if (!token) {
      return;
    }
    
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token for authentication
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
    <div className=" px-4 sm:px-8 pb-8 pt-3 mt-1 md:mx-52 sm:mx-12 mx-4 bg-white">
      <h1 className="text-2xl font-semibold mb-4 ">Ajouter un nouveau produit</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {/* Product Name */}
        <div>
          <label className="block font-medium">Nom du produit</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Référence</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            required
          />
        </div>
                {/* Price */}
                <div>
          <label className="block font-medium">Prix (DT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            required
          />
        </div>
        </div>
                {/* Description */}
                <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            rows={2}
            required
          />
        </div>

        {/* Category */}
        <div>
  <label className="block font-medium">Catégorie</label>
  <div className="mt-2 flex flex-col items-start gap-1">
    <label className="mr-4">
      <input
        type="radio"
        name="category"
        value="Meubles"
        checked={category === "Meubles"}
        onChange={(e) => setCategory(e.target.value)}
        className="mr-2"
        required
      />
      Meubles
    </label>
    <label>
      <input
        type="radio"
        name="category"
        value="Déco"
        checked={category === "Déco"}
        onChange={(e) => setCategory(e.target.value)}
        className="mr-2"
      />
      Déco
    </label>
  </div>
</div>


        {/* Subcategory */}
        <div className="mt-4">
        <label className="block font-medium">Sous-catégorie</label>
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
          disabled={!category}
          required
        >
          <option value="" disabled>
            {category ? 'Sélectionnez une sous-catégorie' : 'Sélectionnez d’abord une catégorie'}
          </option>
          {subcategories.map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>
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
        <label className="block font-medium">Couleurs disponibles</label>
        <select
        value={selectedColor}
          onChange={(e) => {
            
            const selectedColor = e.target.value;
            setSelectedColor(selectedColor);
              handleAddColor(selectedColor);
              e.target.value = ""; // Reset the dropdown to the placeholder.
            
          }}
          className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
        >
          <option value="" disabled>
          Sélectionnez une couleur
          </option>
          {colorKeys.map((colorKey) => (
            <option key={colorKey} value={colorKey}>
              {colorKey}
            </option>
          ))}
        </select>
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





        <div className="flex flex-col items-start gap-2">
          {/* Recommended Checkbox */}
        <div className="flex gap-2">
          <label className="block font-medium">Recommandé ?</label>
          <input
            type="checkbox"
            checked={recommended}
            onChange={(e) => setRecommended(e.target.checked)}
            className="mt-1"
          />
        </div>
        {/* On Sale Checkbox */}
        <div className="flex gap-2">
          <label className="block font-medium">En Solde ?</label>
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
            <label className="block font-medium">Pourcentage (%)</label>
            <input
              type="number"
              value={salePercentage}
              onChange={(e) => setSalePercentage(e.target.value)}
              className="mt-1 p-2 border border-black rounded-sm w-full outline-none"
            />
          </div>
        )}

        
        </div>
        
        

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Charger des images</label>
          <div className="flex items-center md:justify-between lg:flex-row flex-col gap-2">
          <input
            type="file"
            onChange={(e) => setImageUpload(e.target.files?.[0] || null)}
            className=" p-1 border border-black rounded-sm w-full outline-none"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            className=" px-3 py-2 border border-black bg-blue-500 text-white rounded-sm w-full lg:w-fit text-nowrap"
          >
            Charger Cette Image
          </button>
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative">
              <img
                key={index}
                src={img}
                alt={`Product Image ${index + 1}`}
                className="w-24 h-24 object-cover border"
              />
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  handleDeleteImage(img);
                }}
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
          disabled={availableColors.length === 0 || images.length === 0}
          className={`w-full mt-4 px-4 py-2 text-blac border-black rounded-sm border ${
            availableColors.length === 0 || images.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#dcc174] hover:bg-[#b89f53]"
          }`}
        >
          Ajouter Produit
        </button>
      </form>
    </div>
  );
}
