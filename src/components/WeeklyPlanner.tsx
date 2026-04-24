import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, ListRestart, BookOpen, AlertCircle } from 'lucide-react';
import { getWeeklyPlanner, getWeeklySchedules, getAllTeacherDetails } from '../services/api';

interface WeeklyPlannerProps {
  batchId: string;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ batchId }) => {
  const [plannerData, setPlannerData] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [teacherDetails, setTeacherDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('pw_token');
      if (token) {
        setLoading(true);
        const [planner, scheduleList] = await Promise.all([
          getWeeklyPlanner(token, batchId, activeDate, false),
          getWeeklySchedules(token, batchId, activeDate, activeDate)
        ]);
        setPlannerData(planner);
        setSchedules(scheduleList || []);

        setLoading(false);
      }
    };
    fetchData();
  }, [batchId, activeDate]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-headings flex items-center gap-2">
          <Calendar className="text-primary w-5 h-5" />
          Weekly Schedule
        </h3>
        <div className="flex bg-tertiary-6 p-1 rounded-xl border border-stroke-light">
          {['2026-04-23', '2026-04-24', '2026-04-25'].map(date => (
            <button
              key={date}
              onClick={() => setActiveDate(date)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeDate === date ? 'bg-white shadow-sm text-primary' : 'text-body-2 hover:text-headings'
              }`}
            >
              {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedules / Lectures */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-sm font-black text-body-2 uppercase tracking-wider">Scheduled Lectures</h4>
          {schedules.length > 0 ? (
            schedules.map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-stroke-light hover:border-primary transition-all flex items-start gap-4 group shadow-sm">
                <div className="w-24 aspect-video rounded-xl bg-tertiary-6 overflow-hidden shrink-0 border border-stroke-light relative">
                   {(() => {
                     let thumb = '';
                     const imgSource = item.image || item.imageUrl || item.thumbnail || item.videoDetails?.image || item.videoDetails?.thumbnail;
                     if (typeof imgSource === 'string') {
                       thumb = imgSource;
                     } else if (imgSource?.baseUrl && imgSource?.key) {
                       thumb = `${imgSource.baseUrl}${imgSource.key}`;
                     }

                     const isPdf = item.notesUrl || 
                                  item.contentTypeId === 2 || 
                                  item.contentTypeId === 3 || 
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
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                          <Video size={24} className="fill-current" />
                       </div>
                     );
                   })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.subjectName || 'Lecture'}</span>
                    <span className="text-[10px] font-bold text-body-2 flex items-center gap-1">
                      <Clock size={10} />
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  <h5 className="font-bold text-headings group-hover:text-primary transition-colors">{item.topic || 'Class Session'}</h5>
                  
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
                            <p className="text-[10px] font-medium text-body-2 truncate">{tName}</p>
                          </>
                        );
                    })()}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button className="text-[10px] font-black text-white bg-primary px-3 py-1 rounded-lg uppercase tracking-wider hover:opacity-90 transition-opacity">
                      Join Class
                    </button>
                    {item.notesUrl && (
                      <button className="text-[10px] font-black text-body-2 hover:text-headings flex items-center gap-1 uppercase tracking-wider">
                        <BookOpen size={12} />
                        Notes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-10 rounded-2xl border border-dashed border-stroke-light text-center">
              <div className="w-12 h-12 bg-tertiary-6 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListRestart className="text-body-2 opacity-30" />
              </div>
              <p className="text-sm text-body-2 font-medium">No lectures scheduled for this day.</p>
            </div>
          )}
        </div>

        {/* Planner / Events */}
        <div className="space-y-4">
          <h4 className="text-sm font-black text-body-2 uppercase tracking-wider">Plan & Events</h4>
          {plannerData && Array.isArray(plannerData) && plannerData.length > 0 ? (
            plannerData.map((event: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-stroke-light border-l-4 border-l-primary flex items-start gap-3">
                <div className="p-2 bg-primary/5 rounded text-primary">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-headings">{event.title || 'Weekly Event'}</h5>
                  <p className="text-[10px] text-body-2 mt-1">{event.description || 'Important update for the week'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <p className="text-xs text-headings/70 font-medium">No specific planner events for today. Stay consistent with your scheduled classes!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
