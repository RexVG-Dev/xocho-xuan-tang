'use client';
import { useParams } from 'next/navigation';

import { ProductForm } from "../../_components/productForm"

function Edit() {
  const params = useParams();
  const { id } = params;
  const productId = typeof id === 'string' ? id : '';

  return (
    <div>
      <ProductForm mode="edit" productId={productId} />
    </div>
  )
}
export default Edit