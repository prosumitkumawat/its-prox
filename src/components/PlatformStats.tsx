import React from 'react';

const PlatformStats = () => {
  const cards = [
    { title: "15 Million+", sub: "Happy Students", color: "#FFF3E3", img: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/91174dc5-7a84-4341-a09a-9ed84c046909.webp" },
    { title: "24000+", sub: "Mock Tests", color: "#FFEEEE", img: "https://static.pw.live/images/hoverImage_20241225195310.svg" },
    { title: "14000+", sub: "Video Lectures", color: "#E4FAFF", img: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/684f72df-293c-4f3e-b2ec-4d9e9811a9f5.webp" },
    { title: "80000+", sub: "Practice Papers", color: "#ECE7FF", img: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/fd525b9b-7d35-4205-9185-daa16187d892.webp" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-headings mb-4">A Platform Trusted by Students Worldwide</h2>
          <p className="text-body-1">Don't Just Take Our Word for It. Delve into the Numbers and Witness the Excellence for Yourself!</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center justify-between p-6 rounded-2xl h-[240px] md:h-[280px] transition-transform hover:-translate-y-2 cursor-default group overflow-hidden"
              style={{ backgroundColor: card.color }}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-headings mb-1">{card.title}</div>
                <div className="text-sm md:text-base font-medium text-body-1">{card.sub}</div>
              </div>
              <img 
                src={card.img} 
                alt={card.sub} 
                className="w-24 h-24 md:w-32 md:h-32 object-contain group-hover:scale-110 transition-transform mt-4" 
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button className="bg-primary text-white px-12 py-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
