import Header from './components/layout/Header';

export default function Index() {
  return (
    <div className="min-h-screen mt-5 py-6 px-4">
      <Header />

      <main className="max-w-5xl mx-auto mt-8">
        <section className="text-center py-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Bienvenido a Xocho</h2>
          <p className="text-gray-600 text-lg">
            Tu tienda de cosméticos y productos para el hogar. Usa la navegación para explorar la tienda.
          </p>
        </section>

        <section className="mt-10 p-6 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-700">Aquí cargaremos los Carruseles de Banners y Productos en la Fase 2.</p>
        </section>
      </main>
    </div>
  );
}
