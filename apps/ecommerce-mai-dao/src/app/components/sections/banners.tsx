import React from 'react';

import Carousel from '../ui/organisms/carousel/carousel';

export interface Banner {
  id: string;
  title?: string;
  description?: string;
  image_url?: string;
  text_button?: string;
    category_id?: string;
    target_filters_json?: Record<string, any>;
}

interface BannersProps {
  banners: Banner[];
}

function getBannerListingUrl(banner: Banner): string {
  const params: Record<string, string> = { skip: '0', take: '20' };
  if (banner.category_id) {
    params.categoryId = banner.category_id;
  }
  if (banner.target_filters_json && typeof banner.target_filters_json === 'object') {
    Object.entries(banner.target_filters_json).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params[key] = value.join(',');
      } else if (typeof value === 'boolean') {
        // Convert boolean to string 'true'/'false' for URL
        params[key] = value ? 'true' : 'false';
      } else if (typeof value === 'number' || typeof value === 'string') {
        params[key] = String(value);
      }
    });
  }
  // Always build the URL with whatever filters are present
  const query = new URLSearchParams(params).toString();
  return `/listing${query ? `?${query}` : ''}`;
}

export function Banners({ banners }: BannersProps) {
  return (
    <section className="max-w-5xl mx-auto mt-6">
      <div className="rounded-3xl">
        <Carousel variant="banner" showArrows={false} showDots={true} className="h-[420px]" autoplay={true} autoplayDelay={4000}>
          {banners && banners.length > 0 ? (
            banners.map((b) => (
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
                    <a
                      href={getBannerListingUrl(b)}
                      className="inline-block bg-white text-red-600 px-6 py-3 mb-10 rounded-full font-semibold"
                    >
                      {b.text_button || 'Ver más'}
                    </a>
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
  );
}
