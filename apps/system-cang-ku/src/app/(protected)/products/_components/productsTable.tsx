import Image from 'next/image';
import { IconButton, Icon } from '@/app/components/ui';
import { formatCurrency } from '@/utils/numbers';
import { ProductInterface } from '../constants';

interface ProductsTableProps {
  products: ProductInterface[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">SKU</th>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Stock</th>
            <th scope="col" className="px-4 py-3">Precio Unitario</th>
            <th scope="col" className="px-4 py-3">Categoría</th>
            <th scope="col" className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-200">
              <td className="px-4 py-3 font-medium text-gray-800">{product.sku}</td>
              <td className="px-4 py-3 flex items-center gap-3">
                <Image
                  src={product.main_image_url || 'https://res.cloudinary.com/dphrt50s2/image/upload/v1751495237/product_images/MDNF-002/MDNF-002_00.jpg'}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover bg-gray-100"
                />
                {product.name}
              </td>
              <td className="px-4 py-3">{product.stock}</td>
              <td className="px-4 py-3">{formatCurrency(parseFloat(product.price))}</td>
              <td className="px-4 py-3">{product.categories.map(c => c.name).join(', ')}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2 items-center">
                  <IconButton color="dark" rounded="md" size="xs" icon={<Icon name="edit_white" size={20} />}/>
                  <IconButton color="danger" rounded="md" size="xs" icon={<Icon name="delete_white" size={20} />}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
