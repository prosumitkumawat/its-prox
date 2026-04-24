import React, { useEffect, useState } from 'react';
import { Monitor, Search, ChevronRight, Lock, BookOpen } from 'lucide-react';
import { getAllBatches, getBatchDetails } from '../services/api';
import BatchExplorer from './BatchExplorer';

const BatchesSection = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [enrolledBatches, setEnrolledBatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchBatches = async () => {
      const token = localStorage.getItem('pw_token');
      if (token) {
        const data = await getAllBatches(token);
        setBatches(data || []);
      }
      
      // Load enrolled batches from storage
      const stored = localStorage.getItem('enrolled_batches');
      if (stored) {
        try {
          setEnrolledBatches(JSON.parse(stored));
        } catch (e) {
          setEnrolledBatches([]);
        }
      }
      
      setLoading(false);
    };
    fetchBatches();
  }, []);

  const handleBatchClick = async (batch: any) => {
    const token = localStorage.getItem('pw_token');
    if (token) {
      setLoading(true);
      const details = await getBatchDetails(token, batch._id || batch.id || batch.slug);
      setSelectedBatch(details || batch);
      setLoading(false);
    }
  };

  const handleEnroll = (e: React.MouseEvent, batch: any) => {
    e.stopPropagation();
    
    const isAlreadyEnrolled = enrolledBatches.some((b: any) => (b._id || b.id) === (batch._id || batch.id));

    if (!isAlreadyEnrolled) {
      const updated = [...enrolledBatches, batch];
      setEnrolledBatches(updated);
      localStorage.setItem('enrolled_batches', JSON.stringify(updated));
      alert(`Successfully enrolled in ${batch.name}!`);
    } else {
      // If already enrolled, clicking the button takes them to study section
      window.location.href = '/study';
    }
  };

  if (selectedBatch) {
    return (
      <div className="p-4 sm:p-8">
        <BatchExplorer batch={selectedBatch} onBack={() => setSelectedBatch(null)} />
      </div>
    );
  }

  const filteredBatches = batches.filter(b => 
    (b.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-headings tracking-tight flex items-center gap-2">
            <Monitor className="text-primary" />
            Explore Batches
          </h1>
          <p className="text-sm text-body-2 font-medium">Find the perfect batch for your preparation</p>
        </div>

        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stroke-light rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-body-2" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const isEnrolled = enrolledBatches.some((eb: any) => (eb._id || eb.id) === (batch._id || batch.id));
            
            return (
              <div 
                key={batch._id || batch.id}
                onClick={() => handleBatchClick(batch)}
                className="bg-white rounded-2xl border border-stroke-light hover:border-primary hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="aspect-video w-full relative overflow-hidden rounded-t-2xl bg-tertiary-6">
                  {(batch.previewImage || batch.imageUrl) ? (
                    <img 
                      src={batch.previewImage || batch.imageUrl} 
                      alt={batch.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary opacity-20" />
                    </div>
                  )}
                  {batch._id === '6779345c20fa0756e4a7fd08' && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-headings text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                      {batch.name}
                    </h3>
                    <p className="text-xs text-body-2 font-medium mb-4">
                      {batch.byName || 'VidyaHub'} • {batch.language || 'Hinglish'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-stroke-light">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-body-2 font-bold uppercase tracking-wider">Fee</span>
                        <span className="text-lg font-black text-headings">
                          {batch.feeTotal === 0 ? 'FREE' : `₹${batch.feeTotal || '0'}`}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={(e) => handleEnroll(e, batch)}
                        disabled={isEnrolled}
                        className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all active:scale-95 shadow-lg uppercase tracking-wider ${
                          isEnrolled 
                            ? 'bg-success text-white shadow-success/30 opacity-90' 
                            : 'bg-[#5A4BDA] text-white shadow-[#5A4BDA]/30 hover:bg-[#4437B8]'
                        }`}
                      >
                        {isEnrolled ? 'Enrolled ✔' : 'Enroll Now'}
                      </button>
                      <button 
                        className="px-4 py-2.5 bg-tertiary-6 text-headings text-xs font-black rounded-xl hover:bg-gray-100 transition-all active:scale-95 border border-stroke-light uppercase tracking-wider flex items-center justify-center gap-1"
                      >
                        Details
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stroke-light p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-tertiary-6 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-body-2/30" />
          </div>
          <h3 className="text-xl font-bold text-headings mb-2">No batches found</h3>
          <p className="text-sm text-body-2 font-medium">Try searching for a different batch or clear filters.</p>
        </div>
      )}
    </div>
  );
};

export default BatchesSection;
