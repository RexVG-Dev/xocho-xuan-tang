export default function ProductsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <p className="text-gray-600 mb-6">Listing de productos — placeholders por ahora.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">Producto A (placeholder)</div>
          <div className="p-4 border rounded">Producto B (placeholder)</div>
          <div className="p-4 border rounded">Producto C (placeholder)</div>
        </div>
      </div>
    </div>
  );
}
