'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StatsCard } from '@/components/Admin/StatsCard';
import LastOrders from '@/components/Admin/LatestCommands';
import ProductsStatsCard from '@/components/Admin/ProductsStatsCard';
import ChartsSection from '@/components/Admin/ChartsSection';
import ImageCropModal from '@/components/Admin/ImageCropModal';
import { useImageCrop, CROP_CONFIGS } from '@/hooks/useImageCrop';
import { isAuthenticated } from '@/lib/auth';
import Image from 'next/image';
import { getHomepageCategories, homepageCategories } from '@/config/categories';

// Function to get the correct category key for mapping
const getCategoryKey = (link: string): string => {
  // Map specific complex paths to their correct keys
  const keyMap: {[key: string]: string} = {
    '/new': 'new',
    '/collections': 'collections',
    '/promos': 'promos',
    '/meubles': 'meubles',
    '/meubles/salons/canapes-fauteuils': 'canapes-fauteuils',
    '/meubles/salons/meubles-tv': 'meubles-tv',
    '/meubles/salles-a-manger': 'salles-a-manger',
    '/meubles/canapes-fauteuils': 'canapes-fauteuils',
    '/meubles/consoles-meubles-entree/consoles': 'consoles',
    '/meubles/consoles-meubles-entree/meubles-entree': 'meubles-entree',
    '/decorations': 'decorations',
    '/decorations/deco-accessoires': 'accessoires-deco',
    '/decorations/deco-accessoires/pieces artistiques': 'pieces-artistiques',
    '/decorations/deco-accessoires/vases': 'vases',
    '/decorations/deco-accessoires/statues': 'statues',
    '/decorations/deco-accessoires/cadres-photo': 'cadres-photo',
    '/decorations/bougies-parfums-interieur': 'bougies-parfums-interieur',
    '/decorations/miroirs': 'miroirs',
    '/decorations/decorations-murales': 'decorations-murales',
    '/decorations/luminaires': 'luminaires',
    '/decorations/plantes': 'plantes',
    '/decorations/art-de-la-table': 'art-de-la-table',
    '/decorations/linge-de-maison': 'linge-de-maison',
  };
  
  return keyMap[link] || link.split('/').pop() || link;
};

interface Stats {
  totalRevenue?: number;
  totalOrders?: number;
  totalProductsSold?: number;
  totalPendingOrders?: number;
  totalConfirmedOrders?: number;
  totalCancelledOrders?: number;
  totalShippedOrders?: number;
  totalDeliveredOrders?: number;
}

interface OrderStats {
  today: Stats;
  week: Stats;
  month: Stats;
  year: Stats;
}

interface StatsData {
  orderStats: OrderStats;
}

interface HomepageImages {
  banner: string;
  aboutUs: string;
  bannerOpacity?: number;
  categories?: {
    [key: string]: string;
  };
  categoryVisibility?: {
    [key: string]: boolean;
  };
}

const StatsPage = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homepageImages, setHomepageImages] = useState<HomepageImages | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [bannerOpacity, setBannerOpacity] = useState(30);
  const [tempBannerOpacity, setTempBannerOpacity] = useState(30);
  const [categoryVisibility, setCategoryVisibility] = useState<{[key: string]: boolean}>({});
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Image cropping functionality
  const {
    isCropModalOpen,
    currentImageFile,
    currentCropConfig,
    openCropModal,
    closeCropModal,
    handleCrop,
  } = useImageCrop();

  // Image resizing utility function
  const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and resize
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            resolve(file);
          }
        }, file.type, 0.9);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        window.location.href = '/admin/login'; // Redirect to login page
      } else {
        setIsAuthLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_password');

  if (!token) {
    return;
  }
        const response = await axios.get('/api/admin/stats',{headers: {
          Authorization: `Bearer ${token}`,
        },});
        setData(response.data);
      } catch (err) {
        setError('An error occurred');
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchHomepageImages = async () => {
      try {
        const response = await axios.get('/api/homepage-images');
        setHomepageImages(response.data.images);
        setTempBannerOpacity(response.data.images.bannerOpacity || 30);
        setCategoryVisibility(response.data.images.categoryVisibility || {});
        setCategoryOrder(response.data.images.categoryOrder || []);
      } catch (err) {
        console.error('Error fetching homepage images:', err);
      }
    };

    fetchStats();
    fetchHomepageImages();
  }, []);

  const handleImageUpload = async (file: File, imageType: 'banner' | 'aboutUs') => {
    const cropConfig = imageType === 'banner' ? CROP_CONFIGS.banner : CROP_CONFIGS.aboutUs;
    
    openCropModal(file, cropConfig, async (croppedBlob: Blob) => {
      setUploading(imageType);
      try {
        const token = localStorage.getItem('admin_password');
        if (!token) return;

        // Convert blob to file
        const croppedFile = new File([croppedBlob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        
        const formData = new FormData();
        formData.append('file', croppedFile);

        const uploadResponse = await axios.post('/api/upload-cloudinary', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const imageUrl = uploadResponse.data.imageUrl;

        // Update homepage images
        const updateResponse = await axios.put('/api/homepage-images', 
          { [imageType]: imageUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHomepageImages(updateResponse.data.images);
      } catch (err) {
        console.error('Error uploading image:', err);
        alert('Erreur lors de l\'upload de l\'image');
      } finally {
        setUploading(null);
      }
    });
  };

  const handleCategoryImageUpload = async (file: File, categoryKey: string) => {
    openCropModal(file, CROP_CONFIGS.category, async (croppedBlob: Blob) => {
      setUploading(`category-${categoryKey}`);
      try {
        const token = localStorage.getItem('admin_password');
        if (!token) return;

        // Convert blob to file
        const croppedFile = new File([croppedBlob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        
        const formData = new FormData();
        formData.append('file', croppedFile);

        const uploadResponse = await axios.post('/api/upload-cloudinary', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const imageUrl = uploadResponse.data.imageUrl;

        // Update homepage images
        const updateResponse = await axios.put('/api/homepage-images', 
          { categoryKey, categoryImage: imageUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHomepageImages(updateResponse.data.images);
      } catch (err) {
        console.error('Error uploading category image:', err);
        alert('Erreur lors de l\'upload de l\'image de catégorie');
      } finally {
        setUploading(null);
      }
    });
  };

  const handleOpacityChange = (opacity: number) => {
    setTempBannerOpacity(opacity);
  };

  const handleOpacitySave = async () => {
    try {
      const token = localStorage.getItem('admin_password');
      if (!token) return;

      const updateResponse = await axios.put('/api/homepage-images', 
        { bannerOpacity: tempBannerOpacity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHomepageImages(updateResponse.data.images);
      setBannerOpacity(tempBannerOpacity);
    } catch (err) {
      console.error('Error updating opacity:', err);
      alert('Error updating opacity');
    }
  };

  const toggleCategoryVisibility = async (categoryKey: string) => {
    try {
      const token = localStorage.getItem('admin_password');
      if (!token) return;

      const currentVisibility = categoryVisibility[categoryKey] !== false; // Default to visible
      const newVisibility = !currentVisibility;

      const updateResponse = await axios.put('/api/homepage-images', 
        { 
          categoryVisibilityKey: categoryKey, 
          categoryVisibilityValue: newVisibility 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHomepageImages(updateResponse.data.images);
      setCategoryVisibility(prev => ({
        ...prev,
        [categoryKey]: newVisibility
      }));
    } catch (err) {
      console.error('Error updating category visibility:', err);
      alert('Error updating category visibility');
    }
  };

  const enableAllCategories = async () => {
    try {
      const token = localStorage.getItem('admin_password');
      if (!token) return;

      const categories = homepageCategories;
      const updates = categories.map(category => {
        const categoryKey = getCategoryKey(category.link);
        return axios.put('/api/homepage-images', 
          { 
            categoryVisibilityKey: categoryKey, 
            categoryVisibilityValue: true 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      await Promise.all(updates);
      
      // Update local state
      const newVisibility: {[key: string]: boolean} = {};
      categories.forEach(category => {
        const categoryKey = getCategoryKey(category.link);
        newVisibility[categoryKey] = true;
      });
      setCategoryVisibility(newVisibility);
      
      // Refresh homepage images
      const response = await axios.get('/api/homepage-images');
      setHomepageImages(response.data.images);
    } catch (err) {
      console.error('Error enabling all categories:', err);
      alert('Error enabling all categories');
    }
  };

  const disableAllCategories = async () => {
    try {
      const token = localStorage.getItem('admin_password');
      if (!token) return;

      const categories = homepageCategories;
      const updates = categories.map(category => {
        const categoryKey = getCategoryKey(category.link);
        return axios.put('/api/homepage-images', 
          { 
            categoryVisibilityKey: categoryKey, 
            categoryVisibilityValue: false 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      await Promise.all(updates);
      
      // Update local state
      const newVisibility: {[key: string]: boolean} = {};
      categories.forEach(category => {
        const categoryKey = getCategoryKey(category.link);
        newVisibility[categoryKey] = false;
      });
      setCategoryVisibility(newVisibility);
      
      // Refresh homepage images
      const response = await axios.get('/api/homepage-images');
      setHomepageImages(response.data.images);
    } catch (err) {
      console.error('Error disabling all categories:', err);
      alert('Error disabling all categories');
    }
  };

  const moveCategoryUp = async (categoryKey: string) => {
    try {
      const token = localStorage.getItem('admin_password');
      if (!token) return;

      const currentOrder = [...categoryOrder];
      const currentIndex = currentOrder.indexOf(categoryKey);
      
      if (currentIndex > 0) {
        // Swap with previous item
        [currentOrder[currentIndex - 1], currentOrder[currentIndex]] = [currentOrder[currentIndex], currentOrder[currentIndex - 1]];
        
        const updateResponse = await axios.put('/api/homepage-images', 
          { categoryOrder: currentOrder },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategoryOrder(currentOrder);
        setHomepageImages(updateResponse.data.images);
      }
    } catch (err) {
      console.error('Error moving category up:', err);
      alert('Error moving category up');
    }
  };

  const moveCategoryDown = async (categoryKey: string) => {
    try {
      const token = localStorage.getItem('admin_password');
      if (!token) return;

      const currentOrder = [...categoryOrder];
      const currentIndex = currentOrder.indexOf(categoryKey);
      
      if (currentIndex < currentOrder.length - 1) {
        // Swap with next item
        [currentOrder[currentIndex], currentOrder[currentIndex + 1]] = [currentOrder[currentIndex + 1], currentOrder[currentIndex]];
        
        const updateResponse = await axios.put('/api/homepage-images', 
          { categoryOrder: currentOrder },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategoryOrder(currentOrder);
        setHomepageImages(updateResponse.data.images);
      }
    } catch (err) {
      console.error('Error moving category down:', err);
      alert('Error moving category down');
    }
  };

  // Show loading screen while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen">
      <div className=" xl:mx-24 sm:mx-6 mx-4 px-2 sm:px-4 lg:px-6 py-3">
        {/*<h1 className="text-2xl font-bold mb-4">Dernières commandes en attente</h1>
        <LastOrders />*/}

        {/* Charts Section */}
        {data && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4 ml-1">Analyses visuelles</h1>
            <ChartsSection data={data} />
          </div>
        )}
        
        {/* Stats Cards Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 ml-1">Statistiques de vente</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingStats ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Chargement des données...</p>
              </div>
            ) : data ? (
              <>
                <StatsCard title="Aujourd'hui" stats={data.orderStats.today} />
                <StatsCard title="Cette semaine" stats={data.orderStats.week} />
                <StatsCard title="Ce mois" stats={data.orderStats.month} />
                <StatsCard title="Cette année" stats={data.orderStats.year} />
              </>
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">Aucune donnée disponible</div>
            )}
          </div>
        </div>

        

        {/* Products Stats Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 ml-1">Statistiques sur les produits</h1>
          <ProductsStatsCard />
        </div>
      
        {/* Homepage Images Management */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 ml-1">Gestion des images de la page d'accueil</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banner Image */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image de bannière</h3>
              
              {homepageImages?.banner && (
                <div className="mb-6">
                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={homepageImages.banner}
                      alt="Banner Preview"
                      width={400}
                      height={250}
                      className="object-cover w-full h-48"
                    />
                    <div 
                      className="absolute inset-0 bg-[#C8C8C8] transition-opacity duration-300"
                      style={{ opacity: (100 - tempBannerOpacity) / 100 }}
                    />
                  </div>
                </div>
              )}
              
              
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'banner');
                  }}
                  disabled={uploading === 'banner'}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50"
                />
                {uploading === 'banner' && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Opacity Control */}
              <div className="mt-3 px-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Opacité de l'overlay: {tempBannerOpacity}%
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tempBannerOpacity}
                      onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg  cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleOpacitySave}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setTempBannerOpacity(homepageImages?.bannerOpacity || 30)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About Us Image */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image À propos</h3>
              
              {homepageImages?.aboutUs && (
                <div className="mb-6">
                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={homepageImages.aboutUs}
                      alt="About Us Preview"
                      width={400}
                      height={250}
                      className="object-cover w-full h-48"
                    />
                  </div>
                </div>
              )}
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'aboutUs');
                  }}
                  disabled={uploading === 'aboutUs'}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50"
                />
                {uploading === 'aboutUs' && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Images Management */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4 ml-1">Gestion des images de catégories</h1>
            <div className="flex gap-2">
              <button
                onClick={enableAllCategories}
                className="px-4 py-1.5 bg-green-100 text-green-800 border border-green-800 text-sm font-medium rounded-md hover:bg-green-200 transition-colors"
              >
                Activer tout
              </button>
              <button
                onClick={disableAllCategories}
                className="px-4 py-1.5 bg-red-100 text-red-800 border border-red-800 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
              >
                Désactiver tout
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {homepageCategories
              .sort((a, b) => {
                const aKey = a.link.split('/').pop() || a.link;
                const bKey = b.link.split('/').pop() || b.link;
                const aIndex = categoryOrder.indexOf(aKey);
                const bIndex = categoryOrder.indexOf(bKey);
                return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
              })
              .map((category) => {
              const categoryKey = getCategoryKey(category.link);
              const currentImage = homepageImages?.categories?.[categoryKey] || category.image;
              const isVisible = categoryVisibility[categoryKey] !== false; // Default to visible
              const currentIndex = categoryOrder.indexOf(categoryKey);
              
              return (
                <div key={category.id} className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${!isVisible ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        #{currentIndex + 1}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleCategoryVisibility(categoryKey)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        isVisible 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {isVisible ? 'Visible' : 'Masqué'}
                    </button>
                  </div>
                  
                  {/* Ordering Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Ordre d'affichage</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveCategoryUp(categoryKey)}
                        disabled={currentIndex === 0}
                        className={`p-1 rounded text-xs ${
                          currentIndex === 0 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Déplacer vers le haut"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveCategoryDown(categoryKey)}
                        disabled={currentIndex === categoryOrder.length - 1}
                        className={`p-1 rounded text-xs ${
                          currentIndex === categoryOrder.length - 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Déplacer vers le bas"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  
                  {/* Preview with same dimensions as client page */}
                  <div className="mb-4">
                    <div className="w-[180px] sm:w-[210px] mx-auto">
                      <div className="relative overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={currentImage}
                          alt={`${category.name} Preview`}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <h4 className="text-[13px] uppercase mt-2 text-center text-gray-600 font-medium">{category.name}</h4>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCategoryImageUpload(file, categoryKey);
                      }}
                      disabled={uploading === `category-${categoryKey}`}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50"
                    />
                    {uploading === `category-${categoryKey}` && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">Uploading...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={closeCropModal}
        onCrop={handleCrop}
        imageFile={currentImageFile}
        aspectRatio={currentCropConfig?.aspectRatio || 1}
        cropName={currentCropConfig?.cropName || 'Image'}
        minWidth={currentCropConfig?.minWidth || 200}
        minHeight={currentCropConfig?.minHeight || 200}
        cropConfig={currentCropConfig ? {
          minWidth: currentCropConfig.minWidth,
          minHeight: currentCropConfig.minHeight
        } : undefined}
      />
    </div>
  );
};

export default StatsPage;
