import React from 'react';

const AppBanner = () => {
  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="bg-[#5a4bda] rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between relative min-h-[300px]">
          <div className="flex flex-col gap-6 lg:w-1/2 z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Join 15 Million students on the app today!
            </h2>
            <ul className="space-y-4">
              {[
                "Live & recorded classes available at ease",
                "Dashboard for progress tracking",
                "Lakhs of practice questions"
              ].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <img 
                    src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/0905d029-a475-4f3f-b22b-4916a845a4b3.21fd7914" 
                    alt="Check" 
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-base md:text-lg font-medium">{point}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#">
                <img 
                  src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/ee36726f-003b-4f1e-bff5-5d50f1b49bcc.171251c3" 
                  alt="App Store" 
                  className="h-10 md:h-12 w-auto"
                />
              </a>
              <a href="#">
                <img 
                  src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/86c4510f-8a0a-4ccd-9e45-03fd7923ec32.acb101ce" 
                  alt="Play Store" 
                  className="h-10 md:h-12 w-auto"
                />
              </a>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0">
            <img 
              src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/ce321341-5646-4a21-a59f-cf4087dd2f97.aaca3c09" 
              alt="App UI" 
              className="w-full max-w-[400px] md:max-w-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppBanner;
