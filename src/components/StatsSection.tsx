import React from 'react';

const stats = [
  {
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/12385a23-613c-4405-afce-3785c822978e.webp",
    label: "Daily Live",
    sub: "Interactive classes"
  },
  {
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/49b8edb1-7390-4e9e-9cb9-ec3e424d5963.webp",
    label: "10 Million +",
    sub: "Tests, sample papers & notes"
  },
  {
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/057ddbc4-0864-4e57-b85b-b0571944b16d.webp",
    label: "24 x 7",
    sub: "Doubt solving sessions"
  },
  {
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/75072a4d-a233-4712-82e5-b4f0557130c0.webp",
    label: "100 +",
    sub: "Offline centres"
  }
];

const StatsSection = () => {
  return (
    <div className="container mx-auto px-4 -mt-10 md:-mt-12 relative z-30">
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white shadow-lg rounded-xl border border-stroke-light overflow-hidden">
        {stats.map((stat, i) => (
          <div key={i} className={`flex flex-col items-center text-center p-6 gap-3 ${i !== stats.length - 1 ? 'md:border-r border-stroke-light' : ''} ${i < 2 ? 'border-b md:border-b-0 border-stroke-light' : ''}`}>
            <img src={stat.icon} alt={stat.label} className="w-10 h-10 md:w-14 md:h-14" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-headings text-base md:text-lg">{stat.label}</span>
              <span className="text-body-2 text-xs md:text-sm">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
