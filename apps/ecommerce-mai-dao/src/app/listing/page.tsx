"use client";

import { Suspense } from 'react';

import ListingPageContent from './ListingPageContent';

export default function ListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-8 px-4 mt-12 bg-gray-50 text-center text-gray-400">Cargando...</div>}>
      <ListingPageContent />
    </Suspense>
  );
}
