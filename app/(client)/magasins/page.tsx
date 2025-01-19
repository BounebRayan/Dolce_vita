'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

const locations = [
  {
    id: 1,
    name: 'Dolce Vita Sousse',
    lat: 35.845622,
    lng: 10.592508,
    address: 'Avenue Yasser Arafat Sahloul Sousse, 4022',
    phone: '24 331 900',
    email: 'megastore@dolcevita.tn',
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
    address: 'Avenue L’UMA La Soukra, Tunis',
    phone: '24 331 905',
    email: 'store.sokra@dolcevita.tn',
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

  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  if (!isLoaded) return <div className='text-center'>Loading...</div>;

  return (
    <div className='my-4 grid grid-cols-1 md:grid-cols-2 mx-4 md:mx-12 gap-4'>
      <div className='flex items-center justify-center h-[500px] md:h-[700px]'>
        <GoogleMap
          center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          zoom={7}
          mapContainerStyle={{ width: '100%', height: '100%' }}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setSelectedLocation(location)}
            />
          ))}
        </GoogleMap>
      </div>
      <div className='p-1'>
        <div className='text-2xl font-light mb-4 pl-2'>Vous pouvez nous trouver dans nos magasins à</div>
        {locations.map((location) => (
          <div key={location.id} className="border-t border-gray-300">
            <div
              className={`flex items-center cursor-pointer justify-between py-5 px-4 ${selectedLocation.id === location.id ? 'bg-[#dcc174]' : ''} rounded-sm`}
              onClick={() => setSelectedLocation(location)}
            >
              <span className="mr-2">{location.name}</span>
              {selectedLocation.id === location.id ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
            {selectedLocation.id === location.id && (
              <div className="mt-1 ml-2">
                <p className="text-sm">{location.address}</p>
                <p className="text-sm">Téléphone: {location.phone}</p>
                <p className="text-sm">Email: {location.email}</p>
                <h4 className="font-md">Horaires</h4>
                <p className="text-sm">Lundi au Samedi: {location.horaires.lundiSamedi}</p>
                <p className="text-sm">Dimanche: {location.horaires.dimanche}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
