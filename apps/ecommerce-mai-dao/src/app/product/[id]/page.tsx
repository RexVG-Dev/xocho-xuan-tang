interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Detalle de producto</h1>
        <p className="text-gray-600 mb-6">Producto id: <strong>{id}</strong> (placeholder)</p>

        <div className="p-6 border rounded">
          <p>Imágenes, descripción, precio y botones de compra irán aquí.</p>
        </div>
      </div>
    </div>
  );
}
