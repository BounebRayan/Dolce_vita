'use client';

// Swiper components, modules and styles
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from 'next/image';


const MobileImageCarousel = ({ images }: { images: string[] }) => {
  console.log(images);
  return (
    <div className="max-w-md bg-slate-300">
      
      <Swiper
            pagination={{ type: "bullets", clickable: true }}
            loop={true}
            cssMode={true}
            modules={[ Pagination]}
          >

        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="   relative">

            <img
  src={img}
  alt={`Product Image ${index + 1}`}
  className="object-cover"
/>
            </div>
        </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MobileImageCarousel;
