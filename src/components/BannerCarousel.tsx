import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const banners = [
  {
    id: 1,
    desktop: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/fa9b47ff-e6cb-4fb0-8f28-79cf53fd087a.webp",
    mobile: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/2a0984b4-9e7a-49a0-a4be-31e531b02ff3.webp",
    alt: "PWSAT Scholarship"
  },
  {
    id: 2,
    desktop: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/52f49c7a-d299-47e0-b1a7-c3ae890b4f56.webp",
    mobile: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/0747604d-116b-4fc5-8993-18b7faf4ab24.webp",
    alt: "NEET Online Course"
  },
  {
    id: 3,
    desktop: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/6ab09c2e-3fb0-491e-ac0d-aae480add134.webp",
    mobile: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/7df99de6-9cde-4cfe-8b4a-951879b28604.webp",
    alt: "JEE Online Course"
  }
];

const BannerCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative group w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full h-auto"
        >
          <picture className="w-full">
            <source media="(max-width: 768px)" srcSet={banners[index].mobile} />
            <img 
              src={banners[index].desktop} 
              alt={banners[index].alt} 
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover"
            />
          </picture>
        </motion.div>
      </AnimatePresence>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-4 bg-headings" : "w-2 bg-headings/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
