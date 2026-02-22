import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps {
  children: React.ReactNode;
  variant?: 'banner' | 'productList';
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export function Carousel({
  children,
  variant = 'banner',
  showArrows = true,
  showDots = true,
  className,
}: CarouselProps) {
  const slidesPerView = variant === 'banner' ? 1 : 4;
  const modules: any[] = React.useMemo(() => {
    const m: any[] = [];
    if (showArrows) m.push(Navigation);
    if (showDots) m.push(Pagination);
    return m;
  }, [showArrows, showDots]);

  return (
    <div className={className}>
      <Swiper
        modules={modules}
        spaceBetween={variant === 'productList' ? 16 : 0}
        slidesPerView={slidesPerView}
        navigation={showArrows}
        pagination={showDots ? { clickable: true } : false}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;
