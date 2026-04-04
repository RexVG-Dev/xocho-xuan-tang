import Header from './components/layout/Header';
import Carousel from './components/ui/organisms/carousel/carousel';
import { ProductCarousel } from './components/sections/productCarousel';
import CategoryCarousel from './components/sections/categoryCarousel';
import { apiRequest } from './contexts/apiClient';
import { ProductInterface } from '@/shared/interfaces';

/**
 * 
 * TODO: implement a rigth function to fetch data
 */
async function getBanners() {
  try {
    const data = await apiRequest('/banners-active');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}


interface ListProductsInterface {
  products: ProductInterface[];
  total: number;
  next: number;
  hasMore: boolean;
}

async function getProducts(): Promise<ListProductsInterface> {
  try {
    const res = await apiRequest('/products', { params: { skip: 0, take: 10 } });
    if (res && Array.isArray(res.products)) {
      return {
        products: res.products,
        total: res.total ?? res.products.length,
        next: res.next ?? 0,
        hasMore: res.hasMore ?? false,
      };
    }
    return { products: [], total: 0, next: 0, hasMore: false };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, next: 0, hasMore: false };
  }
}


async function getDiscountProducts(): Promise<ListProductsInterface> {
  try {
    const res = await apiRequest('/products', { params: { hasDiscount: 'true', skip: 0, take: 10 } });
    if (res && Array.isArray(res.products)) {
      return {
        products: res.products,
        total: res.total ?? res.products.length,
        next: res.next ?? 0,
        hasMore: res.hasMore ?? false,
      };
    }
    return { products: [], total: 0, next: 0, hasMore: false };
  } catch (error) {
    console.error('Error fetching discount products:', error);
    return { products: [], total: 0, next: 0, hasMore: false };
  }
}


async function getBestSellers(): Promise<ListProductsInterface> {
  try {
    const res = await apiRequest('/products/best-sellers', { params: { skip: 0, take: 10 } });
    if (res && Array.isArray(res.products)) {
      return {
        products: res.products,
        total: res.total ?? res.products.length,
        next: res.next ?? 0,
        hasMore: res.hasMore ?? false,
      };
    }
    return { products: [], total: 0, next: 0, hasMore: false };
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return { products: [], total: 0, next: 0, hasMore: false };
  }
}


export default async function Index() {
  const banners = await getBanners();

  let newProducts: ListProductsInterface = { products: [], total: 0, next: 0, hasMore: false };
  let offers: ListProductsInterface = { products: [], total: 0, next: 0, hasMore: false };
  let bestSellers: ListProductsInterface = { products: [], total: 0, next: 0, hasMore: false };

  try {
    newProducts = await getProducts();
  } catch (e) {
    console.error('Error fetching newProducts:', e);
  }

  try {
    offers = await getDiscountProducts();
  } catch (e) {
    console.error('Error fetching offers:', e);
  }

  try {
    bestSellers = await getBestSellers();
  } catch (e) {
    console.error('Error fetching bestSellers:', e);
  }

  return (
    <div className="min-h-screen mt-8 pt-8">
      <Header />
      <main className="mx-auto mt-8">
        <section className="max-w-5xl mx-auto mt-6">
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
                        <a href="/listing" className="inline-block bg-white text-red-600 px-6 py-3 mb-10 rounded-full font-semibold">{b.text_button || 'Ver más'}</a>
                      </div>
                    </div>
                    <div className="w-1/2 h-full flex items-end justify-end">
                      <div className="w-4/5 h-[320px] rounded-xl shadow-xl" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[420px] flex items-center justify-center text-white text-2xl font-bold bg-gray-300">No banners available</div>
              )}
            </Carousel>
          </div>
        </section>

        <ProductCarousel title='Novedades' background='grey' products={newProducts} />
        <CategoryCarousel />
        <ProductCarousel title='Ofertas' background='grey' products={offers}/>
        <ProductCarousel title='Más Vendidos' products={bestSellers}/>
      </main>
    </div>
  );
}
