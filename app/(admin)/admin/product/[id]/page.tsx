'use client';

import AdminProductDetails from '@/components/Admin/AdminProductDetails';
import { isAuthenticated } from '@/lib/auth';
import { useEffect } from 'react';

type Param = {
  id: string; // Use lowercase 'string' instead of 'String'
};

type Props = {
  params: Param;
};

const ProductPage = ({ params }: Props) => {
  const { id } = params;
    useEffect(() => {
      if (!isAuthenticated()) {
        window.location.href = '/admin/login'; // Redirect to login page
      }
    }, []); // Extract the product id from the URL

  return <AdminProductDetails productId={id} />; // Pass the product ID as a prop
};

export default ProductPage;
