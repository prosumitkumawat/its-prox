import React from 'react';
import { ChevronRight } from 'lucide-react';

const categories = [
  {
    name: "NEET",
    classes: ["Class 11", "Class 12", "Dropper"],
    bgColor: "#FFF2F2",
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/7a4f8bf4-47fb-465d-b611-83b5f001ecdf.webp"
  },
  {
    name: "IIT JEE",
    classes: ["Class 11", "Class 12", "Dropper"],
    bgColor: "#FFF3E0",
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/9a458093-3b8b-4a41-857c-454a7054c20e.webp"
  },
  {
    name: "Pre Foundation",
    classes: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
    bgColor: "#FFFBE4",
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/fb0e4f93-129b-4610-aaab-7a83f7ddcd6b.webp"
  },
  {
    name: "School Boards",
    classes: ["CBSE", "ICSE", "UP Board", "Bihar Board"],
    bgColor: "#F8F8FF",
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/99ddccb2-da01-488c-9826-9c9a49857c60.webp"
  },
  {
    name: "UPSC",
    classes: ["IAS", "PCS"],
    bgColor: "#F4FCFF",
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/826cef39-2986-4525-a330-85b27c3a6891.webp"
  },
  {
    name: "Govt Job Exams",
    classes: ["SSC", "Banking", "Teaching", "Defence"],
    bgColor: "#F4F4F4",
    icon: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/2240dd9e-56f1-431b-a3a9-eb1e2f55930e.webp"
  }
];

const ExamCategories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-[40px] font-bold text-headings mb-4">Exam Categories</h2>
          <p className="text-body-2 text-base md:text-lg">
            PW is preparing students for 35+ exam categories. Scroll down to find the one you are preparing for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="relative group p-6 rounded-xl border border-stroke-light bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-2xl font-bold text-headings mb-4">{cat.name}</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {cat.classes.map((cls) => (
                    <span 
                      key={cls} 
                      className="px-4 py-1.5 bg-tertiary-6 rounded-full text-sm font-medium text-body-1 hover:bg-stroke-light cursor-pointer"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-2 font-bold text-headings cursor-pointer group-hover:gap-3 transition-all">
                  Explore Category <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              <div 
                className="absolute right-0 bottom-0 w-32 h-32 md:w-40 md:h-40 rounded-tl-full -mr-8 -mb-8 transition-transform group-hover:scale-110"
                style={{ backgroundColor: cat.bgColor }}
              >
                <img 
                  src={cat.icon} 
                  alt={cat.name} 
                  className="absolute left-8 top-8 w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="text-primary font-bold border-b-2 border-primary border-dashed pb-1">
            View All Categories (20)
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExamCategories;
