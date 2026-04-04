import { Inter } from 'next/font/google';

import Header from '../app/components/layout/Header';
import Footer from '../app/components/layout/Footer';

import { InitialDataProvider } from '../contexts/initialData.context';
import { StoreProvider } from '../contexts/store.context';
import { ApiStateProvider } from '../app/contexts/apiState.context';

import './global.css';
import { CategoryProvider } from './contexts/category.context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bienvenido a Xocho',
  description: 'La tienda donde encontrar los mejores productos de China.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <CategoryProvider>
          <ApiStateProvider>
            <InitialDataProvider>
              <StoreProvider>
                <Header />
                <main className="flex-grow w-full mx-auto">
                  {children}
                </main>
                <Footer />
              </StoreProvider>
            </InitialDataProvider>
          </ApiStateProvider>
        </CategoryProvider>
      </body>
    </html>
  );
}
