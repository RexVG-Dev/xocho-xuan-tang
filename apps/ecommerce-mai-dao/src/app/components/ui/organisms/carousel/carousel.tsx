"use client";
import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Autoplay } from 'swiper/modules';
import styles from './carousel.module.scss';

interface CarouselProps {
  children: React.ReactNode;
  variant?: 'banner' | 'productList';
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
}

export function Carousel({
  children,
  variant = 'banner',
  showArrows = true,
  showDots = true,
  className,
  autoplay = false,
  autoplayDelay = 4000,
}: CarouselProps) {
  const slidesPerView = variant === 'banner' ? 1 : 4;
  const modules: any[] = React.useMemo(() => {
    const m: any[] = [];
    if (showArrows) m.push(Navigation);
    if (showDots) m.push(Pagination);
    if (autoplay) m.push(Autoplay);
    return m;
  }, [showArrows, showDots, autoplay]);

  const swiperClass = `xocho-swiper ${className ?? ''} rounded-3xl overflow-hidden`.trim();

  const containerClass = `${styles.wrapper} ${className ?? ''}`.trim();

  return (
    <div className={containerClass}>
      <Swiper
        className={swiperClass}
        modules={modules}
        spaceBetween={variant === 'productList' ? 16 : 0}
        slidesPerView={slidesPerView}
        navigation={showArrows}
        pagination={showDots ? { el: '.xocho-pagination', clickable: true } : false}
        autoplay={autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
      {showDots && <div className="xocho-pagination " />}
    </div>
  );
}

export default Carousel;
