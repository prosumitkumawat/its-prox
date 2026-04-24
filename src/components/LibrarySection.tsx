import React, { useEffect, useState } from 'react';
import { Library, BookOpen, Clock, ChevronRight, Search } from 'lucide-react';
import { getLibraryStatus } from '../services/api';

const LibrarySection = () => {
  const [loading, setLoading] = useState(true);
  const [libraryData, setLibraryData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLibrary = async () => {
      const token = localStorage.getItem('pw_token');
      if (token) {
        // Using the user's requested cohort and segment or defaults
        const data = await getLibraryStatus(token, '12 neet', 'Paid');
        setLibraryData(data);
      }
      setLoading(false);
    };
    fetchLibrary();
  }, []);

  const resources = [
    { title: 'Free Lectures', icon: BookOpen, count: '120+', color: 'bg-blue-50 text-blue-600' },
    { title: 'Previous Year Papers', icon: Clock, count: '50+', color: 'bg-purple-50 text-purple-600' },
    { title: 'Revision Notes', icon: Library, count: '200+', color: 'bg-green-50 text-green-600' },
    { title: 'Daily Practice Problems', icon: Search, count: '500+', color: 'bg-orange-50 text-orange-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-stroke-light shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-headings tracking-tight flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
                <Library className="text-primary w-8 h-8" />
            </div>
            Digital Library
          </h1>
          <p className="text-body-2 font-medium mt-2">Access thousands of free resources for your preparation</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search in library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-tertiary-6 border border-stroke-light rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-body-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-stroke-light hover:border-primary hover:shadow-xl transition-all cursor-pointer group">
            <div className={`p-4 rounded-2xl w-fit ${res.color} mb-6`}>
              <res.icon size={28} />
            </div>
            <h3 className="font-bold text-headings text-lg group-hover:text-primary transition-colors">{res.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold text-body-2">{res.count} Items</span>
              <div className="w-8 h-8 rounded-full bg-tertiary-6 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {libraryData && (
        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 flex items-start gap-4">
            <div className="p-2 bg-primary rounded-lg text-white">
                <BookOpen size={20} />
            </div>
            <div>
                <h4 className="font-bold text-primary">Library Spotlight</h4>
                <p className="text-sm text-headings/70 font-medium">Your current cohort is set to 12 NEET. Explore specialized content curated just for you.</p>
            </div>
        </div>
      )}

      {/* Featured Content Placeholder */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-headings tracking-tight">Most Popular Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-stroke-light overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-all group">
              <div className="sm:w-48 aspect-video sm:aspect-square bg-tertiary-6 relative overflow-hidden">
                <img 
                  src={`https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/${i === 0 ? '9769ee8a-449e-4e42-be5d-a026e6331a98' : 'f376f9f3-8f0b-4bda-a0a1-7c9800e84364'}.png`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-black rounded uppercase tracking-wider">Free</span>
                    <span className="text-[10px] text-body-2 font-bold">Updated Today</span>
                  </div>
                  <h3 className="font-bold text-headings group-hover:text-primary transition-colors">
                    {i === 0 ? 'Complete Formula Sheet for Physics' : 'Daily MCQ Challenge - Session 42'}
                  </h3>
                  <p className="text-xs text-body-2 mt-2 font-medium line-clamp-2">
                    {i === 0 ? 'Download the comprehensive formula sheet covering all chapters of 11th and 12th Physics.' : 'Boost your NEET score with these carefully selected conceptual questions.'}
                  </p>
                </div>
                <button className="mt-4 text-xs font-black text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  VIEW DETAILS
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibrarySection;
