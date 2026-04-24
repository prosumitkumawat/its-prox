import React from 'react';

const results = [
  { title: "UPSC CSE 2023", rank: "AIR 7", author: "Anmol Rathore", img: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/f701dd38-826d-4328-836e-8e1061c5d281.jpg" },
  { title: "GATE 2024", rank: "AIR 1", author: "Raja Majhi", img: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/5613a51e-e9ac-4e90-a78e-81dba01b1940.png" },
  { title: "JEE Advanced 2024", rank: "AIR 52", author: "Sushant Padha", img: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/e588ef54-2d7f-457e-aa73-5e96a7468efb.png" },
  { title: "NEET 2024", rank: "AIR 1", author: "Tathagat Awatar", img: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/046b026b4582249e9bdd7213e2cedf8b.jpg" }
];

const ResultsSection = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-headings mb-4">Academic Excellence : Results</h2>
          <p className="text-body-1 font-bold">Giving wings to a millions dreams, a million more to go</p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x">
          {results.map((res, i) => (
            <div key={i} className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl border border-stroke-light overflow-hidden snap-center flex flex-col items-center p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-6 border-4 border-primary/10">
                <img src={res.img} alt={res.author} className="w-full h-full object-cover" />
              </div>
              <div className="font-bold text-primary text-xl mb-1">{res.rank}</div>
              <div className="text-headings font-bold text-lg mb-2">{res.author}</div>
              <div className="text-body-2 text-sm">{res.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
