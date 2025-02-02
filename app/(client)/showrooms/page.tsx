'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

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
    address: '151, Avenue L’UMA La Soukra, Tunis',
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

  if (!isLoaded) return <div className="text-center">Loading...</div>;

  return (
    <div className="my-4 mx-4 md:mx-44 ">
      {/* Invitation Heading */}
      <h1 className="text-2xl font-light mb-5">
        Vous pouvez nous rendre visite dans nos showrooms à :
      </h1>
    <div className='space-y-8'>

      {locations.map((location) => (
        <div key={location.id} className="grid grid-cols-1 md:grid-cols-2">
          {/* Google Map */}
          <div className="flex items-center justify-center h-[300px] md:h-[300px]">
            <GoogleMap
              center={{ lat: location.lat, lng: location.lng }}
              zoom={14}
              mapContainerStyle={{ width: '100%', height: '100%' }}
            >
              <Marker position={{ lat: location.lat, lng: location.lng }} />
            </GoogleMap>
          </div>

          {/* Store Info */}
          <div className="p-4 bg-gray-100">
            <h2 className="text-2xl font-semibold">{location.name}</h2>
            <p className="text-sm">{location.address}</p>
            <p className="text-sm">📞 {location.phone}</p>
            <p className="text-sm">📧 {location.email}</p>
            <h4 className="font-medium mt-2">Horaires</h4>
            <p className="text-sm">Lundi - Samedi: {location.horaires.lundiSamedi}</p>
            <p className="text-sm">Dimanche: {location.horaires.dimanche}</p>
          </div>
        </div>
      ))}
    </div></div>
  );
}
