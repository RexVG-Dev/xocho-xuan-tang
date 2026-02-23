import Header from './components/layout/Header';
import Carousel from './components/ui/organisms/carousel/carousel';


/**
 * 
 * TODO: implement a rigth function to fetch data
 */
async function getBanners() {
  try {
    const res = await fetch('http://localhost:3000/long-shang/banners-active', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

export default async function Index() {
  const banners = await getBanners();

  return (
    <div className="min-h-screen mt-5 py-6 px-4">
      <Header />

      <main className="max-w-6xl mx-auto mt-8">
        <section className="mt-6">
          <div className="rounded-3xl">
            <Carousel variant="banner" showArrows={false} showDots={true} className="h-[420px]" autoplay={true} autoplayDelay={4000}>
              {banners && banners.length > 0 ? (
                banners.map((b: any) => (
                  <div
                    key={b.id}
                    className="relative h-[420px] flex items-end justify-between px-8 text-white overflow-hidden"
                    style={{
                      backgroundColor: b.image_url ? undefined : undefined,
                      backgroundImage: b.image_url ? `url('${b.image_url}')` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-r from-black/20 to-transparent">
                      <div>
                        {b.title ? <h3 className="text-5xl font-extrabold leading-tight mb-4">{b.title}</h3> : null}
                        {b.description ? <p className="text-lg mb-6">{b.description}</p> : null}
                      </div>
                      <div>
                        <a href="/listing" className="inline-block bg-white text-red-600 px-6 py-3 rounded-full font-semibold">{b.text_button || 'Ver más'}</a>
                      </div>
                    </div>
                    <div className="w-1/2 h-full flex items-end justify-end">
                      <div className="w-4/5 h-[320px] rounded-xl shadow-xl" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="h-[420px] flex items-center justify-between px-8 bg-gradient-to-r from-red-600 to-red-500 text-white">
                    <div className="max-w-xl py-12">
                      <h1 className="text-5xl font-extrabold leading-tight mb-4">El verano está aquí</h1>
                      <p className="text-lg mb-6">Encuentra lo mejor en cosméticos y productos para el hogar.</p>
                      <a href="/listing" className="inline-block bg-white text-red-600 px-6 py-3 rounded-full font-semibold">Ver todos los productos</a>
                    </div>
                    <div className="w-1/2 h-full flex items-end justify-end">
                      <div className="w-4/5 h-[320px] bg-[url('https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center rounded-xl shadow-xl" />
                    </div>
                  </div>

                  <div className="h-[420px] flex items-center justify-between px-8 bg-gradient-to-r from-pink-600 to-pink-500 text-white">
                    <div className="max-w-xl py-12">
                      <h1 className="text-5xl font-extrabold leading-tight mb-4">Ofertas de temporada</h1>
                      <p className="text-lg mb-6">Aprovecha descuentos exclusivos por tiempo limitado.</p>
                      <a href="/listing?filter=ofertas" className="inline-block bg-white text-pink-600 px-6 py-3 rounded-full font-semibold">Ver ofertas</a>
                    </div>
                    <div className="w-1/2 h-full flex items-end justify-end">
                      <div className="w-4/5 h-[320px] bg-[url('https://images.unsplash.com/photo-1526178617818-3d8d5b5d2b8b?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center rounded-xl shadow-xl" />
                    </div>
                  </div>

                  <div className="h-[420px] flex items-center justify-between px-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <div className="max-w-xl py-12">
                      <h1 className="text-5xl font-extrabold leading-tight mb-4">Nuevos lanzamientos</h1>
                      <p className="text-lg mb-6">Descubre las novedades que acaban de llegar.</p>
                      <a href="/listing?filter=novedades" className="inline-block bg-white text-orange-600 px-6 py-3 rounded-full font-semibold">Ver novedades</a>
                    </div>
                    <div className="w-1/2 h-full flex items-end justify-end">
                      <div className="w-4/5 h-[320px] bg-[url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center rounded-xl shadow-xl" />
                    </div>
                  </div>
                </>
              )}
            </Carousel>
          </div>
        </section>
      </main>
    </div>
  );
}
