import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Crown, 
  Sparkles, 
  ChevronRight, 
  Tv, 
  Flame, 
  Clock, 
  LayoutGrid, 
  Clapperboard,
  ShieldCheck
} from 'lucide-react';
import { 
  getActiveSubscriptionPlans, 
  getCategoriesByCohort, 
  getPaywallQuota, 
  getOTTWidgets, 
  getOTTCategories,
  getRelatedCategories
} from '../services/api';

const PISection = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [cohortCategories, setCohortCategories] = useState<any[]>([]);
  const [quota, setQuota] = useState<any>(null);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [relatedContent, setRelatedContent] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('pw_token');
      if (token) {
        try {
          const [plansData, cohortData, quotaData, widgetsData, catsData, relatedData] = await Promise.all([
            getActiveSubscriptionPlans(token),
            getCategoriesByCohort(token),
            getPaywallQuota(token),
            getOTTWidgets(token),
            getOTTCategories(token),
            getRelatedCategories(token)
          ]);
          
          if (plansData) setPlans(plansData);
          if (cohortData) setCohortCategories(cohortData);
          if (quotaData) setQuota(quotaData);
          if (widgetsData) setWidgets(widgetsData);
          if (catsData) setAllCategories(catsData);
          if (relatedData) setRelatedContent(relatedData);
        } catch (error) {
          console.error("Failed to fetch PI data", error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-8 space-y-10">
      {/* Header / Hero Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary p-2 rounded-lg">
              <Tv size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter italic uppercase text-white">
              PI <span className="text-primary text-sm not-italic align-top ml-1">STUDIO</span>
            </h1>
          </div>
          <p className="text-gray-400 font-medium">Binge watch your favorite educational content.</p>
        </div>

        {quota && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Clock size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Free Watch Quota</p>
                <p className="text-lg font-bold">{quota.remainingTime || 0} mins left</p>
             </div>
          </div>
        )}
      </div>

      {/* Subscription Plans */}
      {plans.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <Crown className="text-yellow-500" size={20} />
                <h2 className="text-xl font-black tracking-tight">Active Plans</h2>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan: any) => (
              <div key={plan._id} className="relative group overflow-hidden bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border border-white/10 hover:border-primary/50 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <ShieldCheck size={80} />
                </div>
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                   <span className="text-2xl font-black">₹{plan.price}</span>
                   <span className="text-gray-500 text-xs mb-1">/{plan.validity} Days</span>
                </div>
                <button className="w-full mt-6 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all capitalize">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Widgets (Carousel items usually) */}
      {widgets.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 text-primary">
             <Flame size={20} />
             <h2 className="text-xl font-black tracking-tight text-white">Trending Now</h2>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar snap-x">
             {widgets.map((widget: any, idx: number) => (
               <div key={idx} className="min-w-[300px] sm:min-w-[400px] aspect-video bg-gray-900 rounded-3xl relative overflow-hidden group snap-start cursor-pointer">
                  <img 
                    src={widget.imageUrl || widget.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"} 
                    alt="" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-primary">{widget.tag || 'LATEST'}</p>
                     <h3 className="text-xl font-bold text-white drop-shadow-md">{widget.title || widget.name}</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <Play fill="white" size={24} />
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Cohort Categories */}
      {cohortCategories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Sparkles size={20} className="text-purple-500" />
                Featured Categories
             </h2>
             <button className="text-sm font-bold text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                View All <ChevronRight size={16} />
             </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {cohortCategories.map((cat: any) => (
               <div key={cat._id} className="aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 hover:border-primary/30 transition-all">
                  <img 
                    src={cat.image || "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60"} 
                    alt="" 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent">
                     <p className="text-xs font-bold text-white text-center leading-tight">{cat.name}</p>
                  </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* All OTT Categories */}
      {allCategories.length > 0 && (
        <section className="pb-10">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2 mb-6">
             <LayoutGrid size={20} className="text-blue-500" />
             Explore by Genre
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             {allCategories.map((cat: any) => (
               <div key={cat._id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all flex items-center gap-5 group cursor-pointer">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl flex-shrink-0 overflow-hidden">
                     <img src={cat.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-lg">{cat.name}</h3>
                     <p className="text-xs text-gray-500 uppercase font-black tracking-[0.1em]">{cat.totalVideos || 0} Videos</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center p-2 group-hover:bg-primary group-hover:border-primary transition-all">
                     <ChevronRight size={18} />
                  </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Related Content */}
      {relatedContent.length > 0 && (
        <section className="pb-20">
          <h2 className="text-xl font-black tracking-tight mb-6">You Might Also Like</h2>
          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
            {relatedContent.map((item: any, idx: number) => (
              <div key={idx} className="min-w-[150px] aspect-[2/3] bg-white/5 rounded-xl overflow-hidden relative group">
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop&q=60"} 
                  alt="" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                />
                <div className="absolute inset-0 flex items-end p-3">
                  <p className="text-[10px] font-bold text-white line-clamp-1">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

export default PISection;
