import Header from './components/layout/Header';
import { ProductCarousel } from './components/sections/productCarousel';
import CategoryCarousel from './components/sections/categoryCarousel';
import { Banners, Banner } from './components/sections/banners';
import { apiRequest } from './contexts/apiClient';
import { ProductInterface } from '@/shared/interfaces';

/**
 * 
 * TODO: implement a rigth function to fetch data
 */
async function getBanners(): Promise<Banner[]> {
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
  const banners: Banner[] = await getBanners();

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
        <Banners banners={banners} />

        <ProductCarousel title='Novedades' background='grey' products={newProducts} seeMoreHref="/listing?skip=0&take=20" />
        <CategoryCarousel />
        <ProductCarousel title='Ofertas' background='grey' products={offers} seeMoreHref="/listing?has_discount=true&skip=0&take=20" />
        <ProductCarousel title='Más Vendidos' products={bestSellers} seeMoreHref="/listing?best-sellers=true&skip=0&take=20" />
      </main>
    </div>
  );
}
