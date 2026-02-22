interface ListingProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ListingPage({ searchParams }: ListingProps) {
  const filter = Array.isArray(searchParams?.filter) ? searchParams?.filter[0] : searchParams?.filter;
  const query = Array.isArray(searchParams?.query) ? searchParams?.query[0] : searchParams?.query;
  const category = Array.isArray(searchParams?.category) ? searchParams?.category[0] : searchParams?.category;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Listing de productos</h1>
        <p className="text-gray-600 mb-6">
          Filtro: <strong>{filter ?? '—'}</strong> • Categoría: <strong>{category ?? '—'}</strong> • Búsqueda: <strong>{query ?? '—'}</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">Producto 1 (placeholder)</div>
          <div className="p-4 border rounded">Producto 2 (placeholder)</div>
          <div className="p-4 border rounded">Producto 3 (placeholder)</div>
        </div>
      </div>
    </div>
  );
}
