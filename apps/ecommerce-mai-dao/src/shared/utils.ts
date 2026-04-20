import { ProductInterface } from "./interfaces";

export const calculateDiscountedPrice = (product: ProductInterface) => {
  if (!product) return null;

  const price = Number(product.price);
  const discountValue = Number(product.discount_value);

  if (product.discount_type === 'percentage') {
    return (price * (1 - discountValue)).toFixed(2);
  }

  if (product.discount_type === 'amount') {
    return (price - discountValue).toFixed(2);
  }

  return price.toFixed(2);
};
