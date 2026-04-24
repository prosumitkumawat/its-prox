import React, { useEffect, useState } from 'react';
import { Zap, Play, Info, Sparkles, ChevronRight, Share2, BookOpen } from 'lucide-react';
import { getVideoAds } from '../services/api';

const PowerBatch = () => {
  const [loading, setLoading] = useState(true);
  const [adData, setAdData] = useState<any>(null);

  useEffect(() => {
    const fetchPowerBatch = async () => {
      const token = localStorage.getItem('pw_token');
      if (token) {
        const data = await getVideoAds(token);
        setAdData(data);
      }
      setLoading(false);
    };
    fetchPowerBatch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-[40px] overflow-hidden bg-[#0A0A0A] h-[500px] group">
        <div className="absolute inset-0">
          <img 
            src={adData?.imageUrl || "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/9ac3070c-2651-4043-98fa-d6e068c8112d.png"} 
            alt="Power Batch" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-10 sm:p-16">
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-primary px-3 py-1 rounded-full flex items-center gap-2">
                <Zap size={14} className="text-white fill-current" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Now</span>
             </div>
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Exclusive content</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter leading-none">
            {adData?.title || 'Unlock Your Full Potential with Power Batch'}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-8 font-medium">
            {adData?.description || 'Get access to premium lectures, test series, and personalized mentoring to crack your target exam with flying colors.'}
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-base flex items-center gap-3 hover:bg-white/90 transition-all active:scale-95">
              <Play className="fill-current" />
              WATCH TRAILER
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-black text-base flex items-center gap-3 hover:bg-white/20 transition-all active:scale-95">
              <Info />
              LEARN MORE
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Interactive Classes', desc: 'Real-time doubt clearing and live polling.', icon: Video },
          { title: 'Curated Notes', desc: 'Handwritten notes by top experts.', icon: FileText },
          { title: 'Adaptive Tests', desc: 'Tests that grow with your learning.', icon: GraduationCap }
        ].map((feat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-stroke-light hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-tertiary-6 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
               {i === 0 ? <Play /> : (i === 1 ? <BookOpen /> : <Sparkles />)}
            </div>
            <h3 className="text-xl font-bold text-headings mb-2">{feat.title}</h3>
            <p className="text-body-2 text-sm leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Video Content Preview if data exists */}
      {adData?.videoUrl && (
        <div className="bg-white rounded-[40px] border border-stroke-light p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-headings tracking-tight">Introduction to Mastery</h2>
                    <p className="text-body-2 font-medium">Watch what makes Power Batch special</p>
                </div>
                <button className="p-3 bg-tertiary-6 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
                    <Share2 size={20} />
                </button>
            </div>

            <div className="aspect-video rounded-3xl overflow-hidden bg-black relative group">
                <iframe 
                    src={adData.videoUrl} 
                    className="w-full h-full" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen" 
                    allowFullScreen
                ></iframe>
            </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-[#5A4BDA] rounded-[40px] p-12 sm:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Zap size={200} className="text-white fill-current" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Don't Miss Out on the Biggest Opportunity of the Year!
            </h2>
            <p className="text-white/80 text-lg mb-10 font-medium leading-relaxed">
                Join thousands of students who have already started their journey to success with VidyaHub's most powerful learning resource.
            </p>
            <button className="bg-white text-primary px-12 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3 mx-auto">
                ENROLL IN POWER BATCH NOW
                <ChevronRight />
            </button>
        </div>
      </div>
    </div>
  );
};

const Video = Play;
const FileText = BookOpen;
const GraduationCap = Sparkles;

export default PowerBatch;
