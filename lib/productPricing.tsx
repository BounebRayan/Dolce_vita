type Variant = {
  label: string;
  price: number;
  isAvailable: boolean;
};

type Product = {
  price: number;
  variants?: Variant[];
  onSale: boolean;
  salePercentage: number;
};

export function getVariantDisplayPrice(product: Product) {
  const hasVariants = product.variants && product.variants.length > 0;
  const displayPrice = hasVariants
    ? Math.min(...product.variants!.map(v => v.price))
    : product.price;
  const prefix = hasVariants ? 'À partir de ' : '';
  
  if (product.onSale) {
    return (
      <span>
        {prefix}{(displayPrice * (1 - product.salePercentage / 100)).toFixed(0)} DT
        <span className="line-through text-gray-500 ml-2">{displayPrice.toFixed(0)} DT</span>
      </span>
    );
  }
  return <span>{prefix}{displayPrice.toFixed(0)} DT</span>;
}
