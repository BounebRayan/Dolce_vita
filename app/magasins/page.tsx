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
    address: 'Sokra, Ariana',
    phone: '24 331 900',
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

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='my-4 grid grid-cols-2 mx-12 gap-4'>
      <div className='flex items-center justify-center h-[700px]'>
        <GoogleMap
          center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          zoom={7}
          mapContainerStyle={{ width: '100%', height: '100%' }}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setSelectedLocation(location)} // Update selectedLocation when pin is clicked
            />
          ))}
        </GoogleMap>
      </div>
      <div>
        <div className='text-2xl font-md mb-4 pl-2'>Vous pouvez nous trouver dans nos magasins</div>
        {locations.map((location) => (
          <div key={location.id} className="border-t border-gray-300 p-3">
            <div
              className="flex items-center cursor-pointer justify-between"
              onClick={() => setSelectedLocation(location)} // Update selectedLocation when title is clicked
            >
              <span className="mr-2">{location.name}</span>
              {selectedLocation.id === location.id ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
            {selectedLocation.id === location.id && ( // Show description only for the selected location
              <div>
                <p>{selectedLocation.address}</p>
                <p>Téléphone: {selectedLocation.phone}</p>
                <p>Email: {selectedLocation.email}</p>
                <h4>Horaires</h4>
                <p>Lundi au Samedi: {selectedLocation.horaires.lundiSamedi}</p>
                <p>Dimanche: {selectedLocation.horaires.dimanche}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
