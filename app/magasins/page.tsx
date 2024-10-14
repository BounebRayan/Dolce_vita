'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';

const locations = [
  {
    id: 1,
    name: 'Dolce Vita Sousse',
    lat: 35.845622,
    lng: 10.592508,
    address: 'Route de ceinture Z.I Akouda Sousse, 4022',
    phone: '29 338 765',
    email: 'megastore@mytek.tn',
    horaires: {
      lundiSamedi: '08:00 - 19:00',
      dimanche: '09:00 - 15:00',
    },
  },
  {
    id: 2,
    name: 'Dolce Vita Sokra',
    lat: 36.8496,
    lng: 10.1942,
    address: 'Sokra, Ariana',
    phone: '29 338 765',
    email: 'store.sokra@mytek.tn',
    horaires: {
      lundiSamedi: '08:00 - 19:00',
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
    <div className='my-4'>
      <div className='flex items-center justify-center'>
        <GoogleMap
          center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          zoom={7}
          mapContainerStyle={{ width: '40%', height: '500px' }}
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

      <div className="location-info mt-4 text-center">
        <h3>{selectedLocation.name}</h3>
        <p>{selectedLocation.address}</p>
        <p>Téléphone: {selectedLocation.phone}</p>
        <p>Email: {selectedLocation.email}</p>
        <h4>Horaires</h4>
        <p>Lundi au Samedi: {selectedLocation.horaires.lundiSamedi}</p>
        <p>Dimanche: {selectedLocation.horaires.dimanche}</p>
      </div>
    </div>
  );
}
