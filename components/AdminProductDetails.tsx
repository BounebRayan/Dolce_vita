"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { XMarkIcon } from '@heroicons/react/24/outline';

type Props = {
  productId: string;
};

const categories = { 
  deco: [
    'Accessoires déco', 'Vases', 'Cadres photo', 'Luminaires', 'Miroirs',
    'Déco murale', "Bougies & parfums d'intérieur", "linges de maison"
  ],
  meuble: ['Salons', 'Chambres', 'Salles À Manger'],
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

type Product = {
  reference: string | number | readonly string[] | undefined;
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
    const colorKeys = Object.keys(colors);
    const [selectedColor, setSelectedColor] = useState<string>("");
  
    const subcategories = product?.category === 'Déco' 
      ? categories.deco 
      : product?.category === 'Meubles' 
        ? categories.meuble 
        : [];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('admin_password');

        if (!token) {
          return;
        }
        
        const response = await axios.get(`/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token for authentication
            },
          });
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
      setSelectedColor('');
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
      const token = localStorage.getItem('admin_password');

if (!token) {
  return;
}

      const updatedProduct = { ...product, images: updatedImages };

      await axios.put(`/api/products/${productId}`, updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token for authentication
          },
        });
      setProduct(updatedProduct);
      setSelectedImageIndex(0); // Set the first image as selected
      alert("Main image updated successfully!");
    } catch (error) {
      console.error("Failed to update main image:", error);
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('admin_password');

if (!token) {
  return;
}

    if (product) {
      try {
        await axios.put(`/api/products/${productId}`, product,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token for authentication
            },
          });
        alert("Product updated successfully!");
      } catch (error) {
        console.error("Failed to update product:", error);
        alert("Error updating product!");
      }
    }
  };

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem('admin_password');

if (!token) {
  return;
}

    if (product) {
      try {
        await axios.delete(`/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token for authentication
            },
          });
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Failed to update product:", error);
        alert("Error updating product!");
      }
    }
  };

  const API_URL = process.env.API_URL || "/api/upload-image/";

const handleLocalImageUpload = async () => {
  const token = localStorage.getItem('admin_password');

if (!token) {
  return;
}

  if (!localImage || !product) return;

  const uniqueFileName = `${Date.now()}_${localImage.name}`;
  const formData = new FormData();
  formData.append("file", new File([localImage], uniqueFileName));

  try {
    const response = await axios.post(API_URL, formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token for authentication
        },
      });

    const imageUrl = response.data.imageUrl;
    const updatedProduct = {
      ...product,
      images: [...product.images, imageUrl],
    };

    await axios.put(`/api/products/${productId}`, updatedProduct,{
      headers: {
        Authorization: `Bearer ${token}`, // Add token for authentication
      },
    });
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
    const token = localStorage.getItem('admin_password');

if (!token) {
  return;
}

    // Update product in the database
    await axios.put(`/api/products/${productId}`, updatedProduct,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token for authentication
        },
      });
    setProduct(updatedProduct);

    // Delete the image from the server
    await fetch(`${API_URL}?fileName=${encodeURIComponent(imageName)}`, {
      method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // Add token for authentication
    },
    });

    alert("Image deleted successfully!");
  } catch (error) {
    console.error("Failed to delete image:", error);
    alert("Error deleting image!");
  }
};

  
  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row md:gap-2 gap-4  p-5 md:mx-16 sm:mx-6 mx-2 bg-white mt-1">
      {/* Images Section */}
      <div className="w-full md:w-1/2 flex gap-2 relative">
      <div className="absolute top-4 left-4 bg-white/80 px-2 border border-black rounded-full text-[14px] font-bold">{product.unitsSold} unités vendues</div>
        <div className="">
          <Image
            src={product.images[selectedImageIndex]}
            alt={product.productName}
            width={700}
            height={700}
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
                className="absolute sm:top-1 sm:right-1 right-0.5 top-0.5 text-black bg-white sm:p-1 p-0.5 rounded-full"
              >
                <XMarkIcon className="sm:h-5 sm:w-5 h-4 w-4 text-black transform transition duration-300 hover:scale-105"/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 space-y-2">
                {/* Category */}




        <div>
      <label className="block font-medium mb-1">Nom du produit</label>
        <input
          className="text-lg font-semibold border p-2 w-full rounded-sm outline-none"
          value={product.productName}
          onChange={(e) =>
            setProduct({ ...product, productName: e.target.value })
          }
          required
        />
        </div>
        <div>
      <label className="block font-medium mb-1">Référence</label>
        <input
          className="text-md font-bold border p-2 w-full rounded-sm outline-none"
          value={product.reference}
          onChange={(e) =>
            setProduct({ ...product, reference: e.target.value })
          }
          required
        />
         </div>
         <div>
         <label className="block font-medium mb-1">Description</label>
        <textarea
          className="border p-2 w-full rounded-sm outline-none"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          placeholder="Description du produit"
        ></textarea>
         </div>
         <div>
  <label className="block font-medium">Catégorie</label>
  <div className="mt-2 flex flex-row items-start gap-1">
    <label className="mr-4">
      <input
        type="radio"
        name="category"
        value="Meubles"
        checked={product.category === "Meubles"}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
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
        checked={product.category === "Déco"}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
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
          value={product.subCategory}
          onChange={(e) => setProduct({ ...product, subCategory: e.target.value })}
          className="mt-1 p-2 border rounded-sm w-full outline-none"
          disabled={!product.category}
          required
        >
          <option value="" disabled>
            {product.category ? 'Sélectionnez une sous-catégorie' : 'Sélectionnez d’abord une catégorie'}
          </option>
          {subcategories.map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>


                {/* Dimensions Section */}
                <div>
  <label className="block font-medium">Dimensions L x W x H</label>
  <div className="grid grid-cols-3 gap-4">
    <input
      type="number"
      className="border p-2 rounded-sm outline-none"
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
      className="border p-2 rounded-sm outline-none"
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
      className="border p-2 rounded-sm outline-none"
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
          className="mt-1 p-2 border rounded-sm w-full outline-none"
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
          <div className="my-2 flex flex-wrap gap-2">
            {product.availableColors.map((color) => (
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



            <div className="grid grid-cols-2 gap-2">
        <div className="flex gap-2">
          <label className="block font-medium">Recommandé ?</label>
          <input
            type="checkbox"
            checked={product.isRecommended}
            onChange={(e) => setProduct({ ...product, isRecommended: e.target.checked })}
            className="mt-1"
          />
        </div>
        <div className="flex gap-2">
         <label className="block font-medium">En Solde ?</label>
            <input
              type="checkbox"
              checked={product.onSale}
              onChange={(e) =>
                setProduct({ ...product, onSale: e.target.checked })
              }
            />
          </div> </div>
          

        <div className="grid grid-cols-2 gap-2">
        <div className="w-full">
        <label className="block font-medium mb-1">Prix (DT)</label>
          <input
            type="number"
            className="border p-2 rounded-sm w-full"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: parseFloat(e.target.value) })
            }
            placeholder="Price"
          />
           </div>
           <div className="w-full">
      <label className="block font-medium mb-1">Pourcentage Solde (%)</label>
          <input
            type="number"
            disabled={!product.onSale}
            className="border p-2 rounded-sm w-full"
            value={product.salePercentage}
            onChange={(e) =>
              setProduct({
                ...product,
                salePercentage: parseInt(e.target.value),
              })
            }
            placeholder="Pourcentage Solde(%)"
          />
</div></div>







        <input
          type="file"
          className="border rounded-sm p-2 w-full"
          onChange={(e) => setLocalImage(e.target.files ? e.target.files[0] : null)}
        />
        {localImage && (
          <button
            onClick={handleLocalImageUpload}
            className="px-4 py-2 mt-2 bg-gray-500 text-black rounded-sm w-full border-black border"
          >
            Charger cette image
          </button>
        )}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 items-center">
        <button
            onClick={handleDeleteProduct}
            className="px-4 py-2 bg-red-500 text-black rounded-sm border-black border w-full"
          >
           Supprimer le produit
          </button>
          <button
            onClick={handleSaveMainImage}
            className="px-4 py-2 bg-blue-500 text-black rounded-sm border-black border w-full"
          >
            Enregistrer miniature
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-green-500 flex-grow text-black rounded-sm w-full border-black border"
          >
            Enregistrer changements
          </button>
        </div>

       
      </div>
    </div>
  );
};

export default AdminProductDetails;
