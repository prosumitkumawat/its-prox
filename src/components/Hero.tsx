import React from 'react';
import { motion } from 'motion/react';

const Hero = () => {
  return (
    <section className="w-full bg-linear-to-r from-[#EEF9FF] from-0% via-[#F9EEFF] via-37% via-[#F8F8FF] via-70% to-[#F1F5FF] to-100% py-6 md:py-12">
      <div className="container mx-auto px-4 flex flex-col xl:flex-row items-center gap-10">
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left flex-1 max-w-2xl">
          <h1 className="text-[32px] sm:text-[40px] md:text-[56px] leading-tight font-bold text-headings mb-6">
            Bharat's <span className="text-primary">Trusted & Affordable</span> Educational Platform
          </h1>
          <p className="text-lg md:text-xl text-body-1 mb-10 max-w-[500px]">
            Unlock your potential by signing up with Physics Wallah-The most affordable learning solution
          </p>
          <button className="bg-primary text-white px-12 py-4 rounded-md font-bold text-xl hover:opacity-90 transition-opacity w-full sm:w-auto">
            Get Started
          </button>
        </div>
        
        <div className="flex-1 w-full max-w-2xl">
          <motion.img 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src="https://static.pw.live/5eb393ee95fab7468a79d189/f39fbcd9-1769-40f9-b2d6-1965c294ca68.png" 
            alt="Hero Illustration" 
            className="w-full h-auto object-contain drop-shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
