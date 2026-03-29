interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen py-8 px-4 my-12">
      <div className="max-w-4xl py-4 mx-auto">
        <h1 className="text-3xl font-bold mb-4">Detalle de producto</h1>
        <p className="text-gray-600 mb-6">Producto id: <strong>{id}</strong> (placeholder)</p>

        <div className="p-6 border rounded">
          <p>Imágenes, descripción, precio y botones de compra irán aquí.</p>
        </div>
      </div>
    </div>
  );
}
