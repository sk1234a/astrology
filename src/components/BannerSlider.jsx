import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import api from '../utils/api';

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    api.get('/banners')
      .then(r => setBanners(Array.isArray(r.data) ? r.data : []))
      .catch(() => setBanners([]));
  }, []);

  const fallbacks = [
    { id: 'fallback-1', title: 'Talk to astrologers online', subtitle: 'Chat and call consultations anytime' },
    { id: 'fallback-2', title: 'Find guidance for every question', subtitle: 'Love, career, marriage, kundli and more' },
    { id: 'fallback-3', title: 'Verified astrologers are waiting', subtitle: 'Start your first consultation today' },
  ];

  const slides = banners.length ? banners : fallbacks;

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 3500 }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full h-[420px] md:h-[520px]"
    >
      {slides.map(b => (
        <SwiperSlide key={b.id} className="h-full">
          {b.image_url ? (
            <img src={b.image_url} alt={b.title || 'Banner'} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_top_left,#facc15_0,#5b21b6_38%,#07001a_78%)] px-6 text-center">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-yellow-200">Astro In Chat</p>
                <h1 className="text-3xl font-black text-white md:text-6xl">{b.title}</h1>
                <p className="mt-4 text-white/75">{b.subtitle}</p>
              </div>
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
