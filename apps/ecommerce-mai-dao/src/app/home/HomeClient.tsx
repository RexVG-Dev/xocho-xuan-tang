'use client';

import { useEffect, useState } from 'react';

import { ProductInterface } from '@/shared/interfaces';

import { ProductCarousel } from '../components/sections/productCarousel';
import CategoryCarousel from '../components/sections/categoryCarousel';
import { Banners, Banner } from '../components/sections/banners';

interface ListProductsInterface {
  products: ProductInterface[];
  total: number;
  next: number;
  hasMore: boolean;
}

interface HomeDataResponse {
  banners: Banner[];
  newProducts: ListProductsInterface;
  offers: ListProductsInterface;
  bestSellers: ListProductsInterface;
}

const EMPTY_PRODUCTS: ListProductsInterface = {
  products: [],
  total: 0,
  next: 0,
  hasMore: false,
};

const INITIAL_DATA: HomeDataResponse = {
  banners: [],
  newProducts: EMPTY_PRODUCTS,
  offers: EMPTY_PRODUCTS,
  bestSellers: EMPTY_PRODUCTS,
};

export default function HomeClient() {
  const [data, setData] = useState<HomeDataResponse>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        const response = await fetch('/internal/home', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Unable to load home data: ${response.status}`);
        }

        const payload = (await response.json()) as HomeDataResponse;
        if (mounted) {
          setData(payload);
        }
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen mt-8 pt-8" />;
  }

  return (
    <div className="min-h-screen mt-8 pt-8">
      <main className="mx-auto mt-8">
        <Banners banners={data.banners} />

        <ProductCarousel title="Novedades" background="grey" products={data.newProducts} seeMoreHref="/listing?skip=0&take=20" />
        <CategoryCarousel />
        <ProductCarousel title="Ofertas" background="grey" products={data.offers} seeMoreHref="/listing?has_discount=true&skip=0&take=20" />
        <ProductCarousel title="Mas Vendidos" products={data.bestSellers} seeMoreHref="/listing?best-sellers=true&skip=0&take=20" />
      </main>
    </div>
  );
}
