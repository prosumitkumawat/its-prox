import React, { useEffect, useState } from 'react';
import { 
  Book, 
  Search, 
  Filter, 
  ChevronRight, 
  BookOpen, 
  ArrowRight,
  Download,
  Info,
  Layers,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { getBooks, getCohortDetails } from '../services/api';

const BooksSection = () => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [cohort, setCohort] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<'NEET' | 'SCHOOL_PREPARATION' | 'BOTH'>('BOTH');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('pw_token');
      if (token) {
        try {
          setLoading(true);
          
          let exams: string[] = [];
          if (activeFilter === 'NEET') exams = ['NEET'];
          else if (activeFilter === 'SCHOOL_PREPARATION') exams = ['SCHOOL_PREPARATION'];
          else exams = ['SCHOOL_PREPARATION', 'NEET'];

          const [booksData, cohortData] = await Promise.all([
            getBooks(token, '12+', exams, false),
            getCohortDetails(token, '634fd2463ce3d7001c50798a')
          ]);

          if (booksData?.data) setBooks(booksData.data);
          if (cohortData) setCohort(cohortData);
        } catch (error) {
          console.error("Failed to fetch books", error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [activeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <BookOpen size={16} className="text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="bg-white border-b border-stroke-light px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl">
                  <Book size={24} className="text-primary" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-headings">Vidya<span className="text-primary italic">Books</span></h1>
              </div>
              <p className="text-sm font-medium text-body-2 max-w-md">Access NCERT solutions, reference books, and competitive exam material for {cohort?.name || 'JEE/NEET'}.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search your book..." 
                  className="pl-10 pr-4 py-2.5 bg-tertiary-6 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-primary/30 transition-all outline-none md:w-64"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-body-2 group-focus-within:text-primary transition-colors" size={16} />
              </div>
              <div className="flex bg-tertiary-6 p-1 rounded-2xl border border-stroke-light">
                 <button 
                   onClick={() => setActiveFilter('BOTH')}
                   className={`px-4 py-1.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-wider ${activeFilter === 'BOTH' ? 'bg-white shadow-sm text-primary' : 'text-body-2 hover:text-headings'}`}
                 >
                   All
                 </button>
                 <button 
                   onClick={() => setActiveFilter('NEET')}
                   className={`px-4 py-1.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-wider ${activeFilter === 'NEET' ? 'bg-white shadow-sm text-primary' : 'text-body-2 hover:text-headings'}`}
                 >
                   NEET
                 </button>
                 <button 
                   onClick={() => setActiveFilter('SCHOOL_PREPARATION')}
                   className={`px-4 py-1.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-wider ${activeFilter === 'SCHOOL_PREPARATION' ? 'bg-white shadow-sm text-primary' : 'text-body-2 hover:text-headings'}`}
                 >
                   School
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Books Grid */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-headings flex items-center gap-2">
                Recommended for you 
                <span className="text-[10px] bg-yellow-400 text-headings px-1.5 py-0.5 rounded-md font-black">AI PILOT</span>
              </h2>
              <button className="text-xs font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-wider">
                Explore All <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {books.length > 0 ? books.map((book, idx) => (
                <div key={idx} className="bg-white rounded-[32px] border border-stroke-light p-6 hover:shadow-xl hover:shadow-black/5 transition-all group flex flex-col items-center">
                   <div className="w-full aspect-[3/4] rounded-2xl bg-tertiary-6 overflow-hidden relative mb-6">
                      <img 
                        src={book.thumbnail || book.image || "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/4df5e27a-59d0-4963-8a9d-9d4f0d61e1bd.png"} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                         <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg text-primary hover:bg-primary hover:text-white transition-all">
                            <Download size={18} />
                         </button>
                      </div>
                      {!book.isPaid && (
                        <div className="absolute bottom-4 left-4">
                           <span className="px-2.5 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg shadow-lg uppercase tracking-tight">FREE</span>
                        </div>
                      )}
                   </div>

                   <div className="w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary/5 text-primary text-[8px] font-black rounded uppercase tracking-tighter">NCERT</span>
                        <span className="text-[10px] font-bold text-body-2 flex items-center gap-1 opacity-50">
                           <Layers size={10} />
                           {book.chapterCount || '15+'} Chapters
                        </span>
                      </div>
                      <h3 className="text-base font-black text-headings leading-tight line-clamp-2 h-10 group-hover:text-primary transition-colors">{book.title || book.name}</h3>
                      <p className="text-xs text-body-2 font-medium line-clamp-1 opacity-60">
                        {book.authorName || 'PhysicsWallah Editorial Team'}
                      </p>
                      
                      <button className="w-full mt-4 py-3 bg-tertiary-6 group-hover:bg-primary group-hover:text-white text-body-2 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2">
                        <BookOpen size={14} />
                        Read Now
                      </button>
                   </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center space-y-4">
                   <div className="w-16 h-16 bg-tertiary-6 rounded-3xl flex items-center justify-center mx-auto">
                      <Info className="text-body-2 opacity-30" size={32} />
                   </div>
                   <h3 className="text-lg font-bold text-headings">No books found</h3>
                   <p className="text-sm text-body-2 max-w-xs mx-auto">We couldn't find any books matching your criteria. Try switching filters.</p>
                   <button 
                     onClick={() => setActiveFilter('BOTH')}
                     className="text-sm font-black text-primary hover:underline"
                   >
                     Clear all filters
                   </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Filters */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-black/10">
               <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4">
                  <Sparkles size={120} />
               </div>
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap size={24} />
               </div>
               <h4 className="text-xl font-black mb-2 italic">Class 12+ Roadmap?</h4>
               <p className="text-xs text-white/60 mb-6 leading-relaxed font-bold">Start your journey with curated resources for Board & Entrance Excellence.</p>
               <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                     <span>NCERT Progress</span>
                     <span>65%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_#5A4BDA]" />
                  </div>
               </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-[32px] border border-stroke-light p-6">
               <h3 className="text-lg font-black text-headings mb-6">Popular Topics</h3>
               <div className="space-y-1">
                  {['Organic Chemistry', 'Classical Mechanics', 'Cell Structure', 'Quantum Physics', 'Genetic Engineering'].map((topic, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-tertiary-6 transition-all cursor-pointer group">
                       <span className="text-xs font-bold text-body-2 group-hover:text-headings">{topic}</span>
                       <ChevronRight size={14} className="text-body-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
               </div>
            </div>
            
            {/* Notification */}
            <div className="bg-primary/5 rounded-[32px] p-6 border border-primary/10">
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                     <Info size={20} />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-headings mb-1">New Arrival!</h4>
                     <p className="text-[10px] text-body-2 font-medium leading-relaxed">NCERT Fingerprints 2026 Edition is now available for download.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
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

export default BooksSection;
