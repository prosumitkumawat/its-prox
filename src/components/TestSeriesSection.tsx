import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Filter, 
  ChevronRight, 
  Search, 
  Clock, 
  BookOpen, 
  Zap,
  Target,
  ShoppingCart,
  Star,
  CheckCircle2
} from 'lucide-react';
import { 
  getTestPassFilters, 
  getCohortTestModes, 
  getTestCategories, 
  getOrderManagementPasses,
  getTestSeriesFeatureFlags
} from '../services/api';

const TestSeriesSection = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>(null);
  const [testModes, setTestModes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [passes, setPasses] = useState<any[]>([]);
  const [activeCohort, setActiveCohort] = useState('634fd2463ce3d7001c50798a');
  const [activeMode, setActiveMode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('pw_token');
      const user = JSON.parse(localStorage.getItem('pw_user') || '{}');
      
      if (token) {
        try {
          setLoading(true);
          const [filtersData, modesData, categoriesData, passesData] = await Promise.all([
            getTestPassFilters(token),
            getCohortTestModes(token, activeCohort),
            getTestCategories(token, activeCohort),
            getOrderManagementPasses(token, activeCohort)
          ]);

          // Fetch feature flags in background
          getTestSeriesFeatureFlags(user._id || user.id).catch(console.error);

          if (filtersData) setFilters(filtersData);
          if (modesData) {
            setTestModes(modesData);
            if (modesData.length > 0 && !activeMode) setActiveMode(modesData[0].name);
          }
          if (categoriesData?.data) setCategories(categoriesData.data);
          if (passesData) setPasses(passesData);
        } catch (error) {
          console.error("Failed to fetch test series data", error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [activeCohort]);

  const toggleCohort = () => {
    setActiveCohort(prev => 
      prev === '634fd2463ce3d7001c50798a' ? '634fd383b08be600181ddd62' : '634fd2463ce3d7001c50798a'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-white">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={16} className="text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Top Navigation / Hero */}
      <div className="bg-white border-b border-stroke-light sticky top-0 z-10 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-xl">
                <Trophy size={20} className="text-primary" />
             </div>
             <div>
                <h1 className="text-lg font-black text-headings leading-tight">Mock Test Series</h1>
                <p className="text-[10px] font-bold text-body-2 uppercase tracking-widest text-primary">Physics Wallah</p>
             </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search your exam..." 
                  className="pl-9 pr-4 py-2 bg-tertiary-6 border border-transparent rounded-full text-sm focus:bg-white focus:border-primary/30 transition-all outline-none w-full md:w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-body-2 group-focus-within:text-primary transition-colors" size={14} />
             </div>
             <button 
               onClick={toggleCohort}
               className="p-2 bg-tertiary-6 hover:bg-primary/10 hover:text-primary rounded-full transition-all text-body-2"
               title="Filter by Cohort"
             >
                <Filter size={18} />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 lg:mt-10">
        {/* Horizontal Category / Mode Filter */}
        <div className="mb-10 overflow-x-auto pb-4 no-scrollbar">
           <div className="flex items-center gap-3">
              {testModes.map((mode, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMode(mode.name)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black transition-all border shadow-sm ${
                    activeMode === mode.name 
                    ? 'bg-primary border-primary text-white shadow-primary/20 scale-105' 
                    : 'bg-white border-stroke-light text-body-2 hover:border-primary hover:text-primary'
                  }`}
                >
                  {mode.name}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content: Test Passes */}
          <div className="lg:col-span-3 space-y-8">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-headings flex items-center gap-2">
                   Featured Passes
                   <span className="text-[10px] bg-yellow-400 text-headings px-1.5 py-0.5 rounded-md">HOT</span>
                </h2>
                <div className="flex items-center gap-1 text-primary text-xs font-black cursor-pointer hover:underline">
                   View All <ChevronRight size={14} />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {passes.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-[32px] border border-stroke-light overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all group flex flex-col h-full">
                     {/* Thumbnail Logic PW Style */}
                     <div className="aspect-[16/9] relative bg-tertiary-6 overflow-hidden">
                        <img 
                          src="https://static.pw.live/react-batches/assets/images/test_pass_active.svg" 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4">
                           <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-black text-headings shadow-sm">
                              <Star size={10} className="fill-yellow-400 text-yellow-400" />
                              4.8 Rating
                           </div>
                        </div>
                     </div>

                     <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[8px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">Full Test Series</span>
                        </div>
                        <h3 className="text-lg font-black text-headings leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                        
                        <div className="space-y-2 mb-6">
                           <div className="flex items-center gap-2 text-[11px] text-body-2 font-medium">
                              <CheckCircle2 size={12} className="text-green-500" /> 
                              {item.testCount || '50+'} Full length mock tests
                           </div>
                           <div className="flex items-center gap-2 text-[11px] text-body-2 font-medium text-headings/60">
                              <CheckCircle2 size={12} className="text-green-500 opacity-50" /> 
                              Based on latest exam pattern
                           </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-stroke-light flex items-center justify-between gap-4">
                           <div className="flex flex-col">
                              <p className="text-[10px] font-bold text-body-2 uppercase tracking-widest line-through">₹{item.mrp || item.price + 200}</p>
                              <p className="text-xl font-black text-primary leading-none">₹{item.price}</p>
                           </div>
                           <button className="flex-1 max-w-[140px] flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 px-4 rounded-2xl font-black text-xs hover:bg-headings transition-all shadow-lg active:scale-95 group/btn">
                              <ShoppingCart size={14} className="group-hover/btn:animate-bounce" />
                              Buy Now
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Right Sidebar: Categories & Featured */}
          <div className="space-y-8">
             <div className="bg-white rounded-[32px] border border-stroke-light p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-lg font-black text-headings">Categories</h2>
                   <BookOpen size={16} className="text-primary" />
                </div>
                <div className="space-y-4">
                   {categories.slice(0, 8).map((cat, idx) => (
                     <div key={idx} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                           <span className="text-xs font-bold text-body-2 group-hover:text-headings transition-colors">{cat.name || cat.title}</span>
                        </div>
                        <ChevronRight size={14} className="text-body-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-3 bg-tertiary-6 rounded-2xl text-[10px] font-black text-body-2 uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                   View More
                </button>
             </div>

             {/* PW Branding Card */}
             <div className="bg-primary rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                <div className="absolute -right-4 -bottom-4 transform rotate-12 opacity-10">
                   <Zap size={140} fill="white" />
                </div>
                <div className="bg-white/20 w-fit p-2 rounded-xl mb-6">
                   <Target size={24} />
                </div>
                <h3 className="text-2xl font-black mb-3 leading-tight italic">Score 700+ in NEET 2026?</h3>
                <p className="text-xs text-white/70 mb-6 font-medium leading-relaxed">Join India's most trusted faculty for daily mock practice and analytics.</p>
                <button className="w-full py-4 bg-white text-primary rounded-2xl font-black text-xs hover:bg-tertiary-6 transition-all shadow-xl uppercase tracking-widest">
                   Join Saarthi
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Floating Filters for Mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-20">
         <button className="bg-headings text-white px-6 py-3 rounded-full font-black text-xs shadow-2xl flex items-center gap-2">
            <Filter size={14} />
            Categories
         </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TestSeriesSection;
