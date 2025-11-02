'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const locations = [
  {
    id: 1,
    name: 'Dolce Vita Sousse',
    lat: 35.845622,
    lng: 10.592508,
    address: '4022, Avenue Yasser Arafat Sahloul, Sousse',
    phone: '24 331 900',
    email: 'dolce.vita.home.collection@gmail.com',
    horaires: {
      lundiSamedi: '09:00 - 20:00',
      dimanche: '09:00 - 15:00',
    },
  },
  {
    id: 2,
    name: 'Dolce Vita Sokra',
    lat: 36.8496,
    lng: 10.1942,
    address: "151, Avenue L'UMA La Soukra, Tunis",
    phone: '24 331 905',
    email: 'dolce.vita.home.collection@gmail.com',
    horaires: {
      lundiSamedi: '09:00 - 20:00',
      dimanche: '09:00 - 15:00',
    },
  }
];

export default function MagasinsPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Calculate bounds to fit both locations
  useEffect(() => {
    if (map && isLoaded) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }
  }, [map, isLoaded]);

  if (!isLoaded) return <div className="text-center">Loading...</div>;

  return (
    <div className="my-4 mx-4 md:mx-[80px]">
      {/* Invitation Heading */}
      <h1 className="text-[28px] font-semibold">
        Nos Showrooms
      </h1>
      <p className="text-gray-600 mb-3">
        Vous pouvez nous rendre visite dans nos boutiques à :
      </p>
      <div className='border-t pt-5'></div>
      
      {/* Map Section */}
      <div className="h-[500px] mx-auto rounded-sm mb-8">
        <GoogleMap
          onLoad={setMap}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {locations.map((location) => (
            <Marker 
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }} 
              title={location.name}
            />
          ))}
        </GoogleMap>
      </div>

      {/* Showrooms Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="p-6 bg-white border border-gray-300 rounded-sm">
            <h2 className="text-2xl font-semibold mb-2">{location.name}</h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Adresse</p>
                <p className="text-sm text-gray-900">{location.address}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Téléphone</p>
                <p className="text-sm text-gray-900">{location.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</p>
                <p className="text-sm text-gray-900">{location.email}</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Horaires</p>
                <p className="text-sm text-gray-900">Lundi - Samedi: {location.horaires.lundiSamedi}</p>
                <p className="text-sm text-gray-900">Dimanche: {location.horaires.dimanche}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
