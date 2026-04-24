import React, { useEffect, useState } from 'react';
import { 
  Flame, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  History, 
  HelpCircle, 
  FileText, 
  LayoutDashboard, 
  Bookmark,
  Calendar,
  Zap,
  Target,
  Library,
  Play,
  ShieldCheck,
  Info,
  Users,
  Trophy,
  Bell,
  MapPin,
  Swords
} from 'lucide-react';
import { 
  getUserStreaks, 
  getPaidBatches,
  getFreeBatches,
  getBatchNudge,
  searchBatches, 
  getBatchDetails, 
  getTodaysSchedule,
  getStreakMessage,
  getRecentWatchHistory,
  getLibraryStatus,
  getUserInfo,
  getUserProfileInfo,
  getAllBatches,
  getAllTeacherDetails,
  getStudyPageWidgets,
  getScheduleDetails,
  getScheduleThreeDModel,
  getHomepageWidgets,
  getUserDetailsList,
  getMoEngageCampaigns,
  getNebulaCohort,
  getAIPersonalisationStats,
  getAnnouncements,
  recordAnnouncementAnalytics,
  showStreak,
  getStreakMilestones,
  getStreakInfo
} from '../services/api';
import BatchExplorer from './BatchExplorer';

const UserDashboard = () => {
  const [streakData, setStreakData] = useState<any>(null);
  const [streakMsg, setStreakMsg] = useState<string>('');
  const [paidBatches, setPaidBatches] = useState<any[]>([]);
  const [freeBatches, setFreeBatches] = useState<any[]>([]);
  const [allBatches, setAllBatches] = useState<any[]>([]);
  const [enrolledBatches, setEnrolledBatches] = useState<any[]>([]);
  const [batchTab, setBatchTab] = useState<'paid' | 'free' | 'enrolled'>('paid');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [batchSearch, setBatchSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [todaysSchedule, setTodaysSchedule] = useState<any[]>([]);
  const [teacherDetails, setTeacherDetails] = useState<Record<string, any>>({});
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'explore' | 'history' | 'profile'>('dashboard');
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [nudge, setNudge] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profileInfo, setProfileInfo] = useState<any>(null);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [moEngageAlert, setMoEngageAlert] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showLivePopup, setShowLivePopup] = useState(false);
  const [initialBatchTab, setInitialBatchTab] = useState<'subjects' | 'weekly' | 'khazana' | 'announcements'>('subjects');
  const [xp, setXp] = useState<number>(() => {
    const savedXp = localStorage.getItem('pw_user_xp');
    return savedXp ? parseInt(savedXp, 10) : 0;
  });
  const [localStreak, setLocalStreak] = useState<number>(() => {
    const savedStreak = localStorage.getItem('pw_user_local_streak');
    return savedStreak ? parseInt(savedStreak, 10) : 0;
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = localStorage.getItem('pw_last_login_date');
    const savedStreak = localStorage.getItem('pw_user_local_streak');
    let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0;

    if (!lastLogin) {
      currentStreak = 1;
      localStorage.setItem('pw_last_login_date', today);
      localStorage.setItem('pw_user_local_streak', '1');
      setLocalStreak(1);
    } else if (lastLogin !== today) {
      const lastDate = new Date(lastLogin);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      localStorage.setItem('pw_last_login_date', today);
      localStorage.setItem('pw_user_local_streak', currentStreak.toString());
      setLocalStreak(currentStreak);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setXp(prevXp => {
        const nextXp = prevXp + 1;
        const finalXp = nextXp >= 1000 ? 0 : nextXp;
        localStorage.setItem('pw_user_xp', finalXp.toString());
        return finalXp;
      });
    }, 120000); // Every 2 minutes
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('pw_token');
      const storedUser = localStorage.getItem('pw_user');
      
      if (storedUser) setUser(JSON.parse(storedUser));
      
      if (token) {
        // Use a timeout to ensure the UI renders even if some APIs are slow
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 8000));
        
        try {
          const fetchPromise = Promise.allSettled([
            getUserStreaks(token),
            getPaidBatches(token),
            getFreeBatches(token),
            getAllBatches(token),
            getStreakMessage(token),
            getBatchNudge(token),
            !storedUser ? getUserInfo(token) : Promise.resolve(null),
            getUserProfileInfo(token),
            getAllTeacherDetails(token),
            getMoEngageCampaigns(token, '2e9e7fba-fb4e-42a2-ba00-5ee5815571ff'),
            showStreak(token),
            getStreakMilestones(token),
            getStreakInfo(token)
          ]);
          
          const result = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (result === 'timeout') {
            console.warn("Dashboard data fetch timed out, rendering with partial results");
            setLoading(false);
            return;
          }

          const results = result as PromiseSettledResult<any>[];
          const [streak, paid, free, all, sMsg, fetchedNudge, uInfo, pInfo, teachers, campaignData] = results.map(r => r.status === 'fulfilled' ? r.value : null);
          
          if (campaignData && campaignData.campaigns && campaignData.campaigns.length > 0) {
             setMoEngageAlert(campaignData.campaigns[0]);
             setShowLivePopup(true);
          }
          
          if (teachers) {
            const teacherMap: Record<string, any> = {};
            const teacherList = Array.isArray(teachers) ? teachers : (teachers.data || []);
            teacherList.forEach((t: any) => {
              const id = t._id || t.id || t.userId;
              if (id) teacherMap[id] = t;
            });
            setTeacherDetails(teacherMap);
          }
          
          const enrolledBatchesStr = localStorage.getItem('enrolled_batches') || '[]';
          let localEnrolled: any[] = [];
          try {
            localEnrolled = JSON.parse(enrolledBatchesStr);
          } catch (e) {
            console.error("Failed to parse enrolled batches", e);
          }

          setStreakData(streak);
          setPaidBatches(paid?.data || paid || []);
          setFreeBatches(free?.data || free || []);
          setAllBatches(all || []);
          setEnrolledBatches(localEnrolled);

          if (sMsg?.message) setStreakMsg(sMsg.message);
          setNudge(fetchedNudge);
          if (uInfo) {
            setUser(uInfo);
            localStorage.setItem('pw_user', JSON.stringify(uInfo));
          }
          setProfileInfo(pInfo);
          
          let initialBatch = null;
          let initialTab: 'enrolled' | 'paid' | 'free' = 'paid';

          if (localEnrolled.length > 0) {
            initialBatch = localEnrolled[0];
            initialTab = 'enrolled';
          } else {
            const paidBatchesList = paid?.data || paid || [];
            const freeBatchesList = free?.data || free || [];
            
            if (paidBatchesList.length > 0) {
              initialBatch = paidBatchesList[0];
              initialTab = 'paid';
            } else if (freeBatchesList.length > 0) {
              initialBatch = freeBatchesList[0];
              initialTab = 'free';
            }
          }

          if (initialBatch) {
            setBatchTab(initialTab);
            const fullDetails = await getBatchDetails(token, initialBatch.slug || initialBatch._id || initialBatch.id);
            setSelectedBatch(fullDetails || initialBatch);
          }
        } catch (err) {
          console.error("Error loading dashboard data", err);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    const token = localStorage.getItem('pw_token');
    if (token) {
      const data = await getRecentWatchHistory(token);
      setHistory(data || []);
    }
    setHistoryLoading(false);
  };

  useEffect(() => {
    const fetchScheduleAndWidgets = async () => {
      if (!selectedBatch) return;
      
      setScheduleLoading(true);
      const token = localStorage.getItem('pw_token');
      if (token) {
        try {
          const batchId = selectedBatch._id || selectedBatch.id;
          const cohortId = selectedBatch.cohortId || '690e0745904eeba494a0ec81';
          
          const [schedule, widgetsData, announcementData] = await Promise.all([
            getTodaysSchedule(token, batchId),
            getStudyPageWidgets(token, cohortId, batchId),
            getAnnouncements(token, batchId)
          ]);
          
          setTodaysSchedule(schedule || []);
          setWidgets(widgetsData || []);
          setAnnouncements(announcementData || []);

          // Extract unique teacher IDs directly from schedule response for precise profile fetching
          if (schedule && schedule.length > 0) {
            const uniqueTeacherIds = new Set<string>();
            schedule.forEach((item: any) => {
              if (item.facultyId) uniqueTeacherIds.add(item.facultyId);
              if (item.teacherId) uniqueTeacherIds.add(item.teacherId);
              if (item.userId) uniqueTeacherIds.add(item.userId);
              item.faculties?.forEach((f: any) => f.id && uniqueTeacherIds.add(f.id));
              item.faculties?.forEach((f: any) => f._id && uniqueTeacherIds.add(f._id));
              item.teachers?.forEach((t: any) => t.id && uniqueTeacherIds.add(t.id));
              item.teachers?.forEach((t: any) => t._id && uniqueTeacherIds.add(t._id));
            });

            const idsArray = Array.from(uniqueTeacherIds);
            if (idsArray.length > 0) {
              const specificTeachers = await getUserDetailsList(token, idsArray);
              if (specificTeachers && Array.isArray(specificTeachers)) {
                 setTeacherDetails(prev => {
                    const newMap = { ...prev };
                    specificTeachers.forEach((t: any) => {
                       newMap[t._id || t.id] = t;
                    });
                    return newMap;
                 });
              }
            }
          }
        } catch (err) {
          console.error("Error loading dashboard content", err);
        }
      }
      setScheduleLoading(false);
    };
    fetchScheduleAndWidgets();
  }, [selectedBatch]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (batchSearch.trim()) {
        setIsSearching(true);
        const token = localStorage.getItem('pw_token');
        if (token) {
          const results = await searchBatches(token, batchSearch);
          setSearchResults(results);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [batchSearch]);

  const handleSelectBatch = async (batch: any) => {
    const token = localStorage.getItem('pw_token');
    if (token) {
      const details = await getBatchDetails(token, batch.slug || batch._id || batch.id);
      setSelectedBatch(details || batch);
    } else {
      setSelectedBatch(batch);
    }
    setIsDrawerOpen(false);
  };

  if (loading) return (
    <div className="p-8 flex justify-center">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-tertiary-6 min-h-screen">
      {/* Top Header - Adjusted for Navbar offset and duplicate removal */}
      <div className="h-[57px] bg-white border-b border-stroke-light px-4 sm:px-8 flex items-center justify-between sticky top-[60px] md:top-[64px] z-[40] shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-extrabold text-headings tracking-tight">Study</h1>
          {profileInfo && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-tertiary-6 border border-stroke-light rounded-full group cursor-help transition-all hover:bg-white hover:shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-headings opacity-70 uppercase tracking-wider">
                Targeting: {profileInfo.class || '12th'} | {profileInfo.exams?.join(', ') || 'NEET'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <button className="relative group p-1.5 hover:bg-tertiary-6 rounded-lg transition-colors">
              <img src="https://static.pw.live/study-mf/assets/images/refer-earn-gift-1755084706.svg" className="w-5 h-5 object-contain" alt="Rewards" />
            </button>
            <div className="flex items-center gap-1.5 cursor-pointer group px-2 py-1 hover:bg-tertiary-6 rounded-lg transition-colors border border-transparent hover:border-yellow-200">
              <span className="text-sm">🔥</span>
              <span className="font-extrabold text-headings text-xs leading-none">{localStreak > 0 ? localStreak : (streakData?.currentStreak || 0)}</span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer group px-2 py-1 hover:bg-tertiary-6 rounded-lg transition-colors border border-transparent hover:border-blue-200">
              <img src="https://pw-learn-to-earn-mfe.pw.live/static/image/xp-icon.41eb1ef0.png" className="w-4 h-4 object-contain" alt="XP" />
              <span className="font-extrabold text-headings text-xs leading-none">{xp}</span>
            </div>
            <button 
              onClick={() => {
                const token = localStorage.getItem('pw_token');
                if (token) recordAnnouncementAnalytics(token);
                // Switch to explore view if in dashboard and there are announcements
                if (currentView === 'dashboard' && announcements.length > 0) {
                  setInitialBatchTab('announcements');
                  setCurrentView('explore');
                }
              }}
              className="relative group p-1.5 hover:bg-tertiary-6 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4 text-headings/70 group-hover:text-primary transition-colors" />
              {announcements.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>
          </div>
          {/* Top Profile (Uper vali) removed as per user request to move bottom one to top and avoid duplicates */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {streakMsg && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 animate-fade-in shadow-sm">
             <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Zap size={16} fill="currentColor" />
             </div>
             <p className="text-sm font-bold text-amber-900 leading-tight">{streakMsg}</p>
             <button 
              onClick={() => setStreakMsg('')}
              className="ml-auto text-amber-400 hover:text-amber-600 p-1"
             >
                <ChevronRight size={16} className="rotate-90" />
             </button>
          </div>
        )}

        {currentView === 'explore' && selectedBatch ? (
          <BatchExplorer 
            batch={selectedBatch} 
            onBack={() => {
              setCurrentView('dashboard');
              setInitialBatchTab('subjects'); // Reset for next time
            }} 
            initialViewTab={initialBatchTab}
          />
        ) : currentView === 'history' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-white rounded-full transition-colors group">
                <ChevronRight className="w-6 h-6 text-headings rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-headings">Watch History</h2>
                <p className="text-xs text-body-2">Videos you have watched recently</p>
              </div>
            </div>
            {historyLoading ? (
              <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
            ) : history.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-stroke-light hover:border-primary transition-all flex items-center gap-4 group cursor-pointer shadow-sm">
                    <div className="w-24 aspect-video rounded-lg overflow-hidden bg-tertiary-6 shrink-0 relative">
                       {(item.imageUrl || item.image || item.imageId) ? (
                         <img 
                           src={typeof (item.imageUrl || item.image || item.imageId) === 'string' ? (item.imageUrl || item.image || item.imageId) : ((item.imageUrl || item.image || item.imageId)?.baseUrl ? `${(item.imageUrl || item.image || item.imageId).baseUrl}${(item.imageUrl || item.image || item.imageId).key}` : "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/4724c4ea-6e8b-400a-803d-a6089e7ea9e9.png")} 
                           className="w-full h-full object-cover" 
                           referrerPolicy="no-referrer" 
                           alt="" 
                         />
                       ) : (
                         <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-primary opacity-20" />
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Play className="w-6 h-6 text-white fill-current" /></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-headings text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.topic || 'Class Lesson'}</h4>
                      <p className="text-[10px] text-body-2 mt-1">{item.batchName || 'General Content'}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-body-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stroke-light py-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-tertiary-6 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40"><History className="w-10 h-10 text-body-2" /></div>
                <h3 className="text-xl font-bold text-headings mb-2">No history yet</h3>
                <p className="text-body-2">Start watching classes to see them here!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Your Batch Banner Section - Major Update */}
            <section 
               id="dashboard-batch-banner"
               onClick={() => setIsDrawerOpen(true)}
               className="bg-[#1A1A1A] rounded-2xl py-3 px-5 lg:py-4 lg:px-8 relative overflow-hidden group cursor-pointer border border-white/5"
            >
               <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent skew-x-12 transform translate-x-24 transition-transform group-hover:translate-x-20 duration-1000" />
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col gap-1 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-2">
                        <div className="px-2 py-0.5 bg-white/10 rounded-full border border-white/10">
                           <span className="text-[8px] font-bold text-white/50 tracking-[0.1em] uppercase">MY ACTIVE BATCH</span>
                        </div>
                     </div>
                     <h2 className="text-lg lg:text-xl font-black text-white leading-tight tracking-tight uppercase break-words">{selectedBatch?.name || "Hunkar RBSE (Board Booster)"}</h2>
                     <div className="flex items-center justify-center md:justify-start gap-4">
                        <p className="text-white/40 text-[9px] font-medium max-w-md">Master your concepts with India's top educators.</p>
                     </div>
                  </div>
                  <div className="shrink-0">
                     <button 
                        className="px-4 py-2 bg-primary text-white rounded-xl font-black text-[9px] uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group/btn"
                     >
                        Change Batch
                        <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-y-0.5" />
                     </button>
                  </div>
               </div>
            </section>

            {/* Batch Offerings & Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Side: Offerings */}
                <section className="lg:col-span-12">
                  <h3 className="text-lg font-extrabold text-headings mb-4">Batch Offerings</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                       { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/d9884a89-e9f5-4d01-ad95-ff4435c66284.svg", label: "All Classes", path: "explore" },
                       { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/a7950bce-5d91-4940-a8ca-897e695c5f18.svg", label: "All Tests", path: "tests" },
                       { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/fb3401b6-8906-45f6-9fb7-b641fb79e998.svg", label: "My Doubts", path: "doubts" },
                       { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/07bb7f6c-9710-4ec0-a2cb-a2c488a7888d.svg", label: "Community", path: "community" }
                     ].map((item, idx) => (
                       <div 
                         key={idx} 
                         onClick={() => {
                           if (item.path === 'explore') setCurrentView('explore');
                         }}
                         className="bg-white p-4 rounded-xl border border-stroke-light hover:border-primary hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                       >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-tertiary-6 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                               <img src={item.icon} className="w-6 h-6 object-contain" alt="" />
                            </div>
                            <span className="font-bold text-headings text-sm">{item.label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-body-2 group-hover:translate-x-1 transition-transform" />
                       </div>
                     ))}
                  </div>
               </section>
            </div>



            {/* Upcoming Events / Today's Schedule */}
            <section>
               <h3 className="text-lg font-extrabold text-headings mb-4">Today's Classes ({todaysSchedule.length})</h3>
               
               {scheduleLoading ? (
                 <div className="bg-white rounded-3xl border border-stroke-light p-12 text-center shadow-sm min-h-[200px] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                 </div>
               ) : todaysSchedule.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {todaysSchedule.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-xl border border-stroke-light p-3.5 hover:border-primary transition-all group shadow-sm flex items-start gap-3.5">
                        <div className="w-20 aspect-video rounded-lg bg-tertiary-6 overflow-hidden shrink-0 border border-stroke-light relative">
                           {(() => {
                             // Robust Image Extractor for PW Data
                             const getImg = (imgSource: any) => {
                               if (!imgSource) return '';
                               if (typeof imgSource === 'string') return imgSource;
                               if (imgSource.baseUrl && imgSource.key) return `${imgSource.baseUrl}${imgSource.key}`;
                               if (imgSource.url) return imgSource.url;
                               return '';
                             };

                             // PW Strategy: Extract IDs and fetch from our teacher map
                             const fId = item.facultyId || item.teacherId || item.userId || 
                                         (item.faculties && item.faculties[0]?.id) || 
                                         (item.faculties && item.faculties[0]?._id) || 
                                         (item.faculties && item.faculties[0]?.userId) || 
                                         (item.faculties && item.faculties[0]?.facultyId) ||
                                         (item.teachers && (item.teachers[0]?._id || item.teachers[0]?.id || item.teachers[0]?.userId));
                                         
                             const teacher = fId ? teacherDetails[fId] : null;
                             const teacherData = teacher?.data?.[0] || teacher;
                             
                             // Try to find ANY teacher image from any possible nested field
                             const teacherImgRaw = 
                                teacherData?.image || 
                                teacherData?.profileImage ||
                                item?.teachers?.[0]?.image || 
                                item?.faculty?.image || 
                                (item.faculties && item.faculties[0]?.image) ||
                                item.profileImage;

                             // Explicitly added item.imageId since PW uses that a lot for topic images
                             const classImgRaw = item.image || item.imageId || item.imageUrl || item.thumbnail || item.videoDetails?.image || item.videoDetails?.thumbnail;
                             
                             const teacherThumb = getImg(teacherImgRaw);
                             const classThumb = getImg(classImgRaw);
                             
                             // PW typically shows the class/topic banner. If unavailable, fallback to teacher face
                             let thumb = classThumb || teacherThumb;
                             
                             // CRITICAL: Force PDF thumbnail if it's a note/pdf, as requested by user
                             // We check for contentTypeId == 2 (PDF), notesUrl, or string indicators in contentType/topic
                             const isPdf = item.notesUrl || 
                                          item.contentTypeId === 2 || 
                                          item.contentTypeId === 3 || // Sometimes DPPs
                                          (typeof item.contentType === 'string' && (item.contentType.toLowerCase().includes('note') || item.contentType.toLowerCase().includes('pdf') || item.contentType.toLowerCase().includes('dpp'))) ||
                                          (item.topic && (item.topic.toLowerCase().includes('pdf') || item.topic.toLowerCase().includes('notes'))) ||
                                          (item.notesUrl && item.notesUrl.toLowerCase().includes('.pdf'));
                             
                             if (isPdf) {
                               thumb = "https://www.image2url.com/r2/default/images/1776957997005-fdbd026d-c585-491c-bf1f-68e5be13b6ec.png";
                             }

                             return thumb ? (
                               <img 
                                 src={thumb} 
                                 className={`w-full h-full ${thumb.includes('.svg') ? 'object-contain p-2' : 'object-cover'}`}
                                 referrerPolicy="no-referrer"
                                 alt="" 
                                 onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   if (teacherThumb && target.src !== teacherThumb && !thumb.includes('.svg')) {
                                      target.src = teacherThumb;
                                   } else if (target.src !== 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/4724c4ea-6e8b-400a-803d-a6089e7ea9e9.png' && !thumb.includes('.svg')) {
                                      target.src = 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/4724c4ea-6e8b-400a-803d-a6089e7ea9e9.png'; // safe generic fallback
                                   }
                                 }}
                               />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                                 <Play className="w-8 h-8 fill-current" />
                               </div>
                             );
                           })()}
                           {item.status === 'LIVE' && (
                             <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black rounded uppercase">Live</div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded capitalize tracking-wide">{item.subjectName || 'Class'}</span>
                              <span className="text-[9px] font-bold text-body-2 flex items-center gap-1">
                                 <Clock className="w-2.5 h-2.5" />
                                 {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                           <h4 className="font-bold text-headings text-xs line-clamp-1 group-hover:text-primary transition-colors">{item.topic}</h4>
                           
                           <div className="flex items-center gap-2 mt-2">
                              {(() => {
                                 // Safely extract teacher matching ID from various hidden PW fields
                                 const fId = item.facultyId || item.teacherId || item.userId || 
                                             (item.faculties && item.faculties[0]?.id) || 
                                             (item.faculties && item.faculties[0]?._id) || 
                                             (item.faculties && item.faculties[0]?.userId) || 
                                             (item.teachers && (item.teachers[0]?._id || item.teachers[0]?.id || item.teachers[0]?.userId));
                                             
                                 const teacher = fId ? teacherDetails[fId] : null;
                                 
                                 // PW Real Data Strategy
                                 const teacherData = teacher?.data?.[0] || teacher; // Try to extract if it's nested
                                 const teacherFullName = teacherData ? `${teacherData.firstName || ''} ${teacherData.lastName || ''}`.trim() : null;
                                 
                                 // Clean up extracting name
                                 let tName = item.facultyName || teacherFullName || item.teacher?.name || item.faculty?.name || item?.teachers?.[0]?.name || item?.faculties?.[0]?.name || 'Educator';
                                 if (!tName.trim()) tName = "Educator";
                                 
                                 // ✅ PW Exact Logic
                                 let photo = 
                                    item?.teachers?.[0]?.image ||
                                    item?.teacher?.image ||
                                    item?.faculty?.image ||
                                    teacherData?.image ||
                                    (item.faculties && item.faculties[0]?.image);

                                 if (!photo) {
                                   photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(tName)}&background=random&color=fff`;
                                 }
                                 
                                 return (
                                   <>
                                     <div className="w-5 h-5 rounded-full overflow-hidden bg-tertiary-6 border border-stroke-light shrink-0">
                                        <img 
                                          src={photo} 
                                          alt={tName} 
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (!target.src.includes('ui-avatars')) {
                                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tName)}&background=random&color=fff`;
                                            }
                                          }}
                                        />
                                     </div>
                                     <p className="text-[9px] text-body-2 font-medium truncate">{tName}</p>
                                   </>
                                 );
                              })()}
                           </div>
                             
                             <div className="mt-3 flex items-center justify-between">
                               <button className="text-[9px] font-black text-primary hover:underline flex items-center gap-1">
                                  View Details <ChevronRight className="w-2.5 h-2.5" />
                               </button>
                               {item.status === 'LIVE' ? (
                                 <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
                                    <span className="text-[8px] font-black text-red-500 uppercase tracking-wider">Live Now</span>
                                 </div>
                               ) : (
                                  <span className="text-[8px] font-bold text-body-2 uppercase tracking-wider">Scheduled</span>
                               )}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="bg-white rounded-3xl border border-stroke-light p-12 text-center shadow-sm relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
                    <img src="https://www.image2url.com/r2/default/images/1777016161125-621cd0f9-908e-4b69-91dc-19c30e92b3e0.png" className="w-48 h-auto mb-6" alt="No events" />
                    <h4 className="text-xl font-bold text-headings mb-2">No classes scheduled today,</h4>
                    <p className="text-body-2 mb-8 font-medium">Perfect time to catch up on pending work!</p>
                    <button className="px-8 py-3 bg-white border border-stroke-light rounded-xl font-bold text-primary hover:bg-tertiary-6 transition-colors shadow-sm active:scale-95">
                       View Weekly Schedule
                    </button>
                 </div>
               )}
            </section>

            {/* Dynamic PW Widgets */}
            {widgets && widgets.length > 0 && (
               <section className="space-y-6">
                  {widgets
                    .filter(w => w && w.data && w.data.length > 0 && !w.title?.startsWith('<!'))
                    .map((widget, widx) => (
                     <div key={widx} className="bg-white rounded-2xl border border-stroke-light p-5 lg:p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-lg font-extrabold text-headings">{widget.title || widget.widgetType || "Study Resources"}</h3>
                           {widget.data?.length > 4 && (
                              <button className="text-[10px] font-bold text-primary hover:underline">View All</button>
                           )}
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                           {(widget.data || []).map((item: any, idx: number) => (
                              <div key={idx} className="min-w-[140px] max-w-[160px] cursor-pointer group shrink-0 space-y-2">
                                 <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-tertiary-6 border border-stroke-light relative">
                                    {(item.image || item.imageUrl || item.imageId || item.thumbnailUrl) ? (
                                       <img 
                                          src={typeof (item.image || item.imageUrl || item.imageId || item.thumbnailUrl) === 'string' 
                                            ? (item.image || item.imageUrl || item.imageId || item.thumbnailUrl) 
                                            : ((item.image || item.imageUrl || item.imageId || item.thumbnailUrl)?.baseUrl 
                                              ? `${(item.image || item.imageUrl || item.imageId || item.thumbnailUrl).baseUrl}${(item.image || item.imageUrl || item.imageId || item.thumbnailUrl).key}` 
                                              : '')}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                          referrerPolicy="no-referrer"
                                          alt=""
                                        />
                                   ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 text-primary/40">
                                         <Bookmark className="w-8 h-8 opacity-50" />
                                      </div>
                                   )}
                                   {item.isPremium && (
                                      <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[8px] font-black rounded uppercase">Pro</div>
                                   )}
                                </div>
                                <h4 className="font-bold text-headings text-[11px] leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                   {item.title || item.name || item.topic || "Resource"}
                                </h4>
                                {item.subtitle && <p className="text-[9px] text-body-2 truncate">{item.subtitle}</p>}
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </section>
           )}

            {/* My Study Zone */}
            <section>
               <h3 className="text-lg font-extrabold text-headings mb-4">My Study Zone</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                  {[
                    { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/1198cd93-18c8-470e-b496-d69f90240fcf.svg", label: "Dashboard", desc: "Interactive dashboard for the course analysis", path: 'dashboard' },
                    { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/878a6089-40dd-4db4-b276-5f153e88e645.svg", label: "My Batches", desc: "View list of batches in which you are enrolled", path: 'explore' },
                    { icon: "https://static.pw.live/study-mf/assets/svg/khazana-android-1764087133.svg", label: "Khazana", desc: "Access extra lectures and premium content", path: 'khazana' },
                    { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/06abb7b8-2680-43dc-912a-03ef655108ea.svg", label: "My History", desc: "View your recent learning here", path: 'history' },
                    { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/cdd9b9cd-c02a-4b5e-bb11-62b4afb79b37.svg", label: "Bookmarks", desc: "View the list of your saved questions", path: 'bookmarks' },
                    { icon: "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/fe9b53bc-a880-4c86-8556-97f74f4e7126.svg", label: "Battlegrounds", desc: "View all your live battlegrounds here", path: 'battle' }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (item.path === 'explore') setCurrentView('explore');
                        else if (item.path === 'khazana') {
                          setInitialBatchTab('khazana');
                          setCurrentView('explore');
                        }
                        else if (item.path === 'profile') setCurrentView('profile');
                        else if (item.path === 'history') { fetchHistory(); setCurrentView('history'); }
                      }}
                      className="bg-white p-5 rounded-2xl border border-stroke-light hover:border-primary hover:shadow-xl transition-all cursor-pointer group shadow-sm flex flex-col gap-3"
                    >
                      <div className="w-11 h-11 rounded-xl bg-tertiary-6 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                         <img src={item.icon} className="w-7 h-7 object-contain" alt="" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-headings text-base mb-0.5 group-hover:text-primary transition-colors">{item.label}</h4>
                        <p className="text-body-2 text-[11px] font-medium leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </section>



            <div className="pt-8 text-center space-y-4 pb-20">
               <h2 className="text-3xl font-black text-headings tracking-tight">Padhlo chahe kahi se, <br/> Manzil milegi yahi se!</h2>
               <div className="flex items-center gap-2 justify-center text-base font-bold text-headings"><span className="text-[#F14B68] animate-pulse">❤️</span> From PhysicsWallah</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Widget */}
      <div className="fixed bottom-6 right-6 z-[100] cursor-pointer hover:scale-110 transition-transform active:scale-90">
         <div className="w-16 h-16 rounded-2xl bg-white shadow-2xl border border-stroke-light flex items-center justify-center overflow-hidden">
            <img src="https://study-mf.pw.live/study-v2/gyan-guru-widget.49c6a623.svg" className="w-10 h-10" alt="" />
         </div>
      </div>

      {/* Batch Selection Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in">
            <div className="p-6 border-b border-stroke-light flex items-center justify-between">
              <h3 className="text-xl font-bold text-headings">Select your batch</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-tertiary-6 rounded-full transition-colors"><ChevronRight className="w-6 h-6 text-body-2 rotate-180" /></button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative">
                <input type="text" placeholder="Search for your batches" className="w-full bg-tertiary-6 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm" value={batchSearch} onChange={(e) => setBatchSearch(e.target.value)} />
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-body-2" />
              </div>
              <div className="flex bg-tertiary-6 p-1 rounded-xl">
                 <button onClick={() => setBatchTab('enrolled')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${batchTab === 'enrolled' ? 'bg-white text-primary shadow-sm' : 'text-body-2'}`}>Enrolled ({enrolledBatches.length})</button>
                 <button onClick={() => setBatchTab('paid')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${batchTab === 'paid' ? 'bg-white text-primary shadow-sm' : 'text-body-2'}`}>My Batches ({paidBatches.length})</button>
                 <button onClick={() => setBatchTab('free')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${batchTab === 'free' ? 'bg-white text-primary shadow-sm' : 'text-body-2'}`}>Free Batches ({freeBatches.length})</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {isSearching ? (
                <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
              ) : (
                <div>
                  <h4 className="text-xs font-bold text-body-2 uppercase tracking-wider mb-4 px-2">
                    {batchTab === 'paid' ? 'My' : (batchTab === 'free' ? 'Free' : 'Enrolled')} Batches
                  </h4>
                  <div className="space-y-2">
                    {(batchTab === 'paid' ? paidBatches : (batchTab === 'free' ? freeBatches : enrolledBatches)).filter(b => (b.name || b.topic || '').toLowerCase().includes(batchSearch.toLowerCase())).map((batch) => (
                      <div key={batch._id || batch.id} onClick={() => handleSelectBatch(batch)} className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedBatch?._id === batch._id || selectedBatch?.id === batch.id ? 'border-primary bg-primary/5' : 'border-stroke-light hover:border-primary/30'}`}>
                        <h5 className="font-bold text-headings text-sm">{batch.name || batch.topic}</h5>
                        {(batch.previewImage || batch.imageUrl || batch.image || batch.imageId) && (
                          <img 
                            src={typeof (batch.previewImage || batch.imageUrl || batch.image || batch.imageId) === 'string' 
                              ? (batch.previewImage || batch.imageUrl || batch.image || batch.imageId) 
                              : ((batch.previewImage || batch.imageUrl || batch.image || batch.imageId)?.baseUrl 
                                ? `${(batch.previewImage || batch.imageUrl || batch.image || batch.imageId).baseUrl}${(batch.previewImage || batch.imageUrl || batch.image || batch.imageId).key}` 
                                : '')} 
                            alt="" 
                            referrerPolicy="no-referrer" 
                            className="mt-2 rounded-lg aspect-video object-cover" 
                          />
                        )}
                        {batch.byName && <p className="text-[10px] text-body-2 mt-1">By {batch.byName}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MoEngage Live In-App Message Popup */}
      {showLivePopup && moEngageAlert && (
         <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLivePopup(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in group border-2 border-primary">
               <button 
                  onClick={() => setShowLivePopup(false)}
                  className="absolute z-10 top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
               >
                  <ChevronRight className="w-5 h-5 opacity-100" />
               </button>
               {moEngageAlert.payload?.image_url ? (
                  <img src={moEngageAlert.payload.image_url} alt="Campaign" className="w-full aspect-square md:aspect-video object-cover" referrerPolicy="no-referrer" />
               ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] border-b-4 border-primary flex flex-col items-center justify-center text-white p-6 text-center">
                     <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"/> Live Alert
                     </span>
                     <h3 className="text-xl font-black text-white">{moEngageAlert.payload?.title || 'Important Announcement'}</h3>
                  </div>
               )}
               {(moEngageAlert.payload?.message || moEngageAlert.payload?.primary_action_text) && (
                 <div className="p-6 space-y-4">
                    {moEngageAlert.payload?.title && moEngageAlert.payload?.image_url && <h3 className="text-xl font-black text-headings">{moEngageAlert.payload.title}</h3>}
                    {moEngageAlert.payload?.message && <p className="text-body-2 text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: moEngageAlert.payload.message }} />}
                    
                    <button 
                       onClick={() => setShowLivePopup(false)}
                       className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                    >
                       {moEngageAlert.payload?.primary_action_text || 'Join Class Now'}
                    </button>
                 </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default UserDashboard;
