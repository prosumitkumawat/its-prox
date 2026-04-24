import React from 'react';

const channels = [
  { name: "Physics Wallah", subs: "11.5M", variant: "platinum" },
  { name: "Competition Wallah", subs: "2.71M", variant: "gold" },
  { name: "JEE Wallah", subs: "1.69M", variant: "gold" },
  { name: "NCERT Wallah", subs: "1.35M", variant: "gold" },
  { name: "PW Foundation", subs: "3.48M", variant: "gold" }
];

const YouTubeSection = () => {
  return (
    <section className="py-16 bg-tertiary-6">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-headings mb-4">Join The PW Family, Today!</h2>
          <p className="text-body-1">Explore our 130+ YouTube Channels and subscribe to get access to quality education for free.</p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide">
          {channels.map((ch, i) => (
            <div 
              key={i} 
              className={`min-w-[240px] p-6 rounded-2xl flex flex-col items-center gap-4 transition-transform hover:-translate-y-2 cursor-pointer ${
                ch.variant === 'platinum' ? 'bg-[#f0f4ff] border-2 border-indigo-200' : 'bg-white border border-stroke-light'
              }`}
            >
              <img 
                src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/Group_20241225134834.svg" 
                alt="YouTube" 
                className="w-12 h-12"
              />
              <div className="text-center">
                <div className="font-bold text-headings text-lg">{ch.name}</div>
                <div className="text-sm font-semibold text-body-2 mt-1">
                  <span className="text-headings">{ch.subs}</span> Subscribers
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button className="bg-primary text-white px-12 py-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
