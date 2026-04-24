import React from 'react';

const cities = [
  { name: "Kota", img: "https://static.pw.live/5eb393ee95fab7468a79d189/cb04a396-0bde-4128-80c4-17f714db6ad9.webp" },
  { name: "Bareilly", img: "https://static.pw.live/5eb393ee95fab7468a79d189/cbcaaf66-7c46-49a8-8c54-ca0c1607bc6b.webp" },
  { name: "Patna", img: "https://static.pw.live/5eb393ee95fab7468a79d189/79b9aa89-9c66-42d3-81ec-abc5760c3519.webp" },
  { name: "Noida", img: "https://static.pw.live/5eb393ee95fab7468a79d189/9c628e00-9803-4d9a-86c7-cc6cf355bd2b.webp" },
  { name: "New Delhi", img: "https://static.pw.live/5eb393ee95fab7468a79d189/0e66b9ac-dfac-446a-8da6-6b80334dd583.webp" },
  { name: "Kolkata", img: "https://static.pw.live/5eb393ee95fab7468a79d189/be37d4ec-866f-4f2a-8910-cfa4bc31cdc0.webp" },
  { name: "Ahmedabad", img: "https://static.pw.live/5eb393ee95fab7468a79d189/fbd24b8b-51ea-41b8-b096-99f130b8a07a.webp" },
  { name: "Jaipur", img: "https://static.pw.live/5eb393ee95fab7468a79d189/a4f4811d-0722-4569-9878-2c5b34e3568f.webp" }
];

const OfflineCentres = () => {
  return (
    <section className="relative w-full h-[600px] overflow-hidden flex items-center">
      <video 
        src="https://static.pw.live/5b09189f7285894d9130ccd0/7c44087d-aff1-438d-aa67-2a493c48504f.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="text-white text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Explore Tech-Enabled Offline Vidyapeeth Centres</h2>
          <p className="text-lg md:text-xl opacity-90">Creating new benchmarks in learning experiences</p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-2xl max-w-2xl mx-auto lg:mx-0">
          <h3 className="text-2xl font-bold text-headings text-center mb-2">Find Vidyapeeth Centre in your city</h3>
          <p className="text-center text-body-2 mb-8 border-y border-stroke-light py-2">
            Available in <span className="text-primary font-bold">105</span> cities
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
            {cities.map((city) => (
              <div key={city.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative overflow-hidden rounded-full w-14 h-14 md:w-16 md:h-16 border border-stroke-light">
                  <img 
                    src={city.img} 
                    alt={city.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-125" 
                  />
                </div>
                <span className="text-xs md:text-sm font-bold text-headings">{city.name}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:opacity-90 transition-opacity">
              View More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfflineCentres;
