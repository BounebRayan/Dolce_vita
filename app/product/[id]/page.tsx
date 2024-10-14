// app/product/[id]/page.js
'use client';

import ProductDetails from '@/components/ProductDetails';

const ProductPage = ({ params }) => {
  const { id } = params; // Extract the product id from the URL

  return <ProductDetails productId={id} />; // Pass the product ID as a prop
};

export default ProductPage;