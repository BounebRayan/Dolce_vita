'use client';

import ProductDetails from '@/components/ProductDetails';

type Param = {
  id: string; // Use lowercase 'string' instead of 'String'
};

type Props = {
  params: Param;
};

const ProductPage = ({ params }: Props) => {
  const { id } = params; // Extract the product id from the URL

  return <ProductDetails productId={id} />; // Pass the product ID as a prop
};

export default ProductPage;
