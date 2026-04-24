import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, FileText, Download, Lock, BookOpen, Layers, Calendar, Bell, X, ExternalLink, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import TestPlayer from './TestPlayer';
import WeeklyPlanner from './WeeklyPlanner';
import VideoPlayer from './VideoPlayer';
import { 
  getSubjectTopics, 
  getVideosForChapter, 
  getNotesForChapter,
  getDppQuestions,
  getDppVideos,
  getBatchQuizzes,
  getSubjectDPPTests,
  getBatchAddons,
  getAnnouncements,
  recordAnnouncementAnalytics
} from '../services/api';

interface BatchExplorerProps {
  batch: any;
  onBack: () => void;
  initialViewTab?: 'subjects' | 'weekly' | 'khazana' | 'announcements';
}

const BatchExplorer: React.FC<BatchExplorerProps> = ({ batch, onBack, initialViewTab = 'subjects' }) => {
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'notes' | 'dpp' | 'tests'>('videos');
  const [batchViewTab, setBatchViewTab] = useState<'subjects' | 'weekly' | 'khazana' | 'announcements'>(initialViewTab);
  const [addons, setAddons] = useState<any[]>([]);
  const [showTestPlayer, setShowTestPlayer] = useState(false);
  const [activeTest, setActiveTest] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAnnouncementDetail, setShowAnnouncementDetail] = useState<any>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [activeVideoItem, setActiveVideoItem] = useState<any>(null);

  const subjects = batch?.subjects || [];

  // Fetch Announcements
  useEffect(() => {
    const token = localStorage.getItem('pw_token');
    const bId = batch._id || batch.id;
    if (token && bId) {
      getAnnouncements(token, bId).then(data => {
        setAnnouncements(Array.isArray(data) ? data : []);
      });
    }
  }, [batch]);
  
  useEffect(() => {
    if (selectedSubject) {
      fetchTopics();
      setSelectedTopic(null);
      setContents([]);
    }
  }, [selectedSubject]);

  // Fetch Content when topic or tab changes
  useEffect(() => {
    if (selectedTopic) {
      fetchTopicContent();
    }
  }, [selectedTopic, activeTab]);

  useEffect(() => {
    if (batchViewTab === 'khazana') {
      fetchAddons();
    }
  }, [batchViewTab]);

  const fetchAddons = async () => {
    setLoading(true);
    const token = localStorage.getItem('pw_token');
    const bId = batch._id || batch.id;
    if (token && bId) {
      const data = await getBatchAddons(token, bId);
      setAddons(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  };

  const fetchTopics = async () => {
    setLoading(true);
    const token = localStorage.getItem('pw_token');
    if (token && batch) {
      const res = await getSubjectTopics(token, batch.slug, selectedSubject.slug);
      if (res.success) {
        setTopics(res.data);
      }
    }
    setLoading(false);
  };

  const fetchTopicContent = async () => {
    setLoading(true);
    const token = localStorage.getItem('pw_token');
    const bId = batch._id || batch.id;
    const sId = selectedSubject._id || selectedSubject.id;

    if (token && batch && selectedTopic) {
      let data: any = { data: [] };
      if (activeTab === 'videos') {
        data = await getVideosForChapter(token, batch.slug, selectedSubject.slug, selectedTopic.slug);
      } else if (activeTab === 'notes') {
        data = await getNotesForChapter(token, batch.slug, selectedSubject.slug, selectedTopic.slug);
      } else if (activeTab === 'dpp') {
        const [q, v] = await Promise.all([
          getDppQuestions(token, batch.slug, selectedSubject.slug, selectedTopic.slug),
          getDppVideos(token, batch.slug, selectedSubject.slug, selectedTopic.slug)
        ]);
        const qData = Array.isArray(q?.data) ? q.data : [];
        const vData = Array.isArray(v?.data) ? v.data : [];
        data = { data: [...qData, ...vData] };
      } else if (activeTab === 'tests') {
        const [quizzes, dppTests] = await Promise.all([
          getBatchQuizzes(token, bId, sId),
          getSubjectDPPTests(token, bId, sId)
        ]);
        
        // Map tests/quizzes to a consistent format for display
        const quizzesArray = Array.isArray(quizzes) ? quizzes : [];
        const dppTestsArray = Array.isArray(dppTests) ? dppTests : [];
        
        const combined = [
          ...quizzesArray.map((q: any) => ({
            ...q,
            topic: q.testName || q.name || q.testTitle || q.title || q.topic || q.testDetails?.name || q.exerciseName || q.exerciseDetails?.name || 'Untitled Test',
            questionsCount: q.totalQuestions || q.questionsCount || q.questionCount || q.testDetails?.totalQuestions || q.test?.totalQuestions || 0,
            duration: q.duration || q.timeDuration || q.timing || q.testDetails?.duration || q.test?.duration || 0,
            isTest: true,
            testType: 'Quiz'
          })),
          ...dppTestsArray.map((t: any) => ({
            ...t,
            topic: t.testName || t.name || t.testTitle || t.topic || t.title || t.testDetails?.name || t.exerciseName || t.exerciseDetails?.name || 'Untitled DPP Test',
            questionsCount: t.totalQuestions || t.questionsCount || t.questionCount || t.testDetails?.totalQuestions || t.test?.totalQuestions || 0,
            duration: t.duration || t.timeDuration || t.timing || t.testDetails?.duration || t.test?.duration || 0,
            isTest: true,
            testType: 'DPP Test'
          }))
        ];
        data = { data: combined };
      }
      setContents(data.data || []);
    }
    setLoading(false);
  };

  const handleContentAction = (item: any) => {
    const token = localStorage.getItem('pw_token');

    if (item.videoDetails) {
      // Construct the URL with required parameters
      let videoUrl = item.videoDetails.videoUrl;
      const appendParam = (param: string, value: string) => {
         if (!videoUrl.includes(param)) {
            videoUrl += (videoUrl.includes('?') ? '&' : '?') + `${param}=${value}`;
         }
      };
      
      if (item.parentId) appendParam('parentId', item.parentId);
      if (item.childId) appendParam('childId', item.childId);
      if (item.videoId) appendParam('videoId', item.videoId);
      if (token) appendParam('token', token);
      
      if (videoUrl) {
         setActiveVideoItem({ ...item, videoDetails: { ...item.videoDetails, videoUrl } });
         setShowVideoPlayer(true);
      }
    } else if (item.pdfUrl) {
      window.open(item.pdfUrl, '_blank');
    } else if (item.isTest) {
      setActiveTest(item);
      setShowTestPlayer(true);
    }
  };

  return (
    <div className="space-y-6">
      {showVideoPlayer && activeVideoItem && (
        <VideoPlayer 
          url={activeVideoItem.videoDetails?.videoUrl} 
          title={activeVideoItem.topic || activeVideoItem.name || activeVideoItem.title || 'Video Player'}
          token={localStorage.getItem('pw_token') || undefined}
          onClose={() => {
            setShowVideoPlayer(false);
            setActiveVideoItem(null);
          }}
        />
      )}

      {showTestPlayer && activeTest && (
        <TestPlayer 
          test={activeTest}
          batchId={batch._id || batch.id}
          subjectId={selectedSubject?._id || selectedSubject?.id}
          onClose={() => setShowTestPlayer(false)}
        />
      )}

      {/* Announcement Detail Overlay */}
      {showAnnouncementDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAnnouncementDetail(null)} />
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-stroke-light flex items-center justify-between bg-tertiary-6">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Bell size={18} />
                 </div>
                 <h3 className="font-extrabold text-headings">Batch Announcement</h3>
               </div>
               <button onClick={() => setShowAnnouncementDetail(null)} className="p-2 hover:bg-stroke-light rounded-full transition-colors">
                 <X size={20} className="text-body-2" />
               </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 scrollbar-hide">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${showAnnouncementDetail.isImportant ? 'bg-red-600 text-white' : 'bg-primary/10 text-primary'}`}>
                      {showAnnouncementDetail.isImportant ? 'URGENT' : 'UPDATE'}
                   </span>
                   {showAnnouncementDetail.publishedBy && (
                     <span className="text-[10px] text-body-2 font-bold">• By {showAnnouncementDetail.publishedBy}</span>
                   )}
                 </div>
                 <span className="text-[10px] text-body-2 font-bold bg-tertiary-6 px-2 py-0.5 rounded border border-stroke-light">
                   {showAnnouncementDetail.createdAt ? new Date(showAnnouncementDetail.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently'}
                 </span>
              </div>

              {showAnnouncementDetail.imageUrl && (
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-stroke-light shadow-sm">
                  <img 
                    src={showAnnouncementDetail.imageUrl} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    alt="" 
                  />
                </div>
              )}

              <h1 className="text-xl sm:text-2xl font-black text-headings leading-tight tracking-tight">{showAnnouncementDetail.title || 'New Batch Update'}</h1>
              
              <div 
                className="text-sm sm:text-base text-body-1 leading-relaxed announcement-content-light prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: showAnnouncementDetail.description || showAnnouncementDetail.message || '' }}
              />
              
              {(showAnnouncementDetail.fileUrl || showAnnouncementDetail.attachment) && (
                <a 
                  href={showAnnouncementDetail.fileUrl || (showAnnouncementDetail.attachment?.baseUrl && `${showAnnouncementDetail.attachment.baseUrl}${showAnnouncementDetail.attachment.key}`)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-dashed border-stroke-light hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-inner">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-headings">Download Attachment</p>
                      <p className="text-[10px] text-body-2 group-hover:text-primary transition-colors">Click to view/download file</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-stroke-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <Download size={14} />
                  </div>
                </a>
              )}
            </div>
            <div className="p-4 bg-tertiary-6 border-t border-stroke-light">
              <button 
                onClick={() => setShowAnnouncementDetail(null)}
                className="w-full py-3 bg-headings text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Close Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button 
          onClick={selectedTopic ? () => setSelectedTopic(null) : (selectedSubject ? () => setSelectedSubject(null) : onBack)}
          className="p-2 hover:bg-white rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-headings" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-headings">
            {selectedTopic ? (selectedTopic.topic || selectedTopic.name || selectedTopic.title) : (selectedSubject ? (selectedSubject.subject || selectedSubject.name) : batch.name)}
          </h2>
          <p className="text-xs text-body-2">
            {selectedTopic ? 'Study Materials' : (selectedSubject ? 'Select a Chapter' : 'Explore subjects and content')}
          </p>
        </div>
      </div>

      {!selectedSubject ? (
        <div className="space-y-6">
          <div className="flex border-b border-stroke-light overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setBatchViewTab('subjects')}
              className={`px-6 py-3 text-sm font-bold transition-all whitespace-nowrap relative flex items-center gap-2 ${batchViewTab === 'subjects' ? 'text-primary' : 'text-body-2 hover:text-headings'}`}
            >
              <BookOpen size={16} />
              All Classes
              {batchViewTab === 'subjects' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button 
              onClick={() => setBatchViewTab('khazana')}
              className={`px-6 py-3 text-sm font-bold transition-all whitespace-nowrap relative flex items-center gap-2 ${batchViewTab === 'khazana' ? 'text-primary' : 'text-body-2 hover:text-headings'}`}
            >
              <Layers size={16} />
              Khazana
              {batchViewTab === 'khazana' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button 
              onClick={() => setBatchViewTab('weekly')}
              className={`px-6 py-3 text-sm font-bold transition-all whitespace-nowrap relative flex items-center gap-2 ${batchViewTab === 'weekly' ? 'text-primary' : 'text-body-2 hover:text-headings'}`}
            >
              <FileText size={16} />
              Weekly Schedule
              {batchViewTab === 'weekly' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            {announcements.length > 0 && (
              <button 
                onClick={() => {
                  setBatchViewTab('announcements');
                  const token = localStorage.getItem('pw_token');
                  if (token) recordAnnouncementAnalytics(token);
                }}
                className={`px-6 py-3 text-sm font-bold transition-all whitespace-nowrap relative flex items-center gap-2 ${batchViewTab === 'announcements' ? 'text-primary' : 'text-body-2 hover:text-headings'}`}
              >
                <Bell size={16} />
                Announcements
                {batchViewTab === 'announcements' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
              </button>
            )}
          </div>

          <div className="mt-0">
            {batchViewTab === 'subjects' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                {subjects.map((sub: any) => (
                  <div 
                    key={sub._id || sub.slug}
                    onClick={() => setSelectedSubject(sub)}
                    className="bg-white p-6 rounded-2xl border border-stroke-light hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-all overflow-hidden border border-primary/5">
                      {(sub.imageId || sub.image) ? (
                        <img 
                          src={typeof sub.imageId === 'string' ? sub.imageId : (sub.imageId?.baseUrl ? `${sub.imageId.baseUrl}${sub.imageId.key}` : sub.image)} 
                          alt="" 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <BookOpen className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-bold text-headings text-lg mb-1">{sub.subject || sub.name}</h3>
                    <p className="text-xs text-body-2">{sub.tagCount || 0} Chapters available</p>
                  </div>
                ))}
              </div>
            ) : batchViewTab === 'khazana' ? (
              <div className="space-y-4 pt-6">
                 {loading ? (
                   <div className="py-20 flex justify-center">
                     <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                   </div>
                 ) : addons.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {addons.map((addon, idx) => (
                       <div 
                        key={idx}
                        className="bg-white p-6 rounded-2xl border border-stroke-light hover:border-primary hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center text-center"
                       >
                         <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                           <img src="https://static.pw.live/study-mf/assets/svg/khazana-android-1764087133.svg" className="w-12 h-12" alt={addon.type} />
                         </div>
                         <h3 className="font-bold text-headings text-lg capitalize">{addon.type.toLowerCase()}</h3>
                         <p className="text-xs text-body-2 mt-1">Unlock premium content with {addon.type}</p>
                         <button className="mt-6 px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md transition-shadow">
                           Open {addon.type}
                         </button>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="bg-white rounded-2xl border border-stroke-light p-20 text-center">
                     <Lock className="w-10 h-10 text-body-2/30 mx-auto mb-4" />
                     <h3 className="text-lg font-bold text-headings">No Addons found</h3>
                     <p className="text-sm text-body-2">Khazana and Saarthi are currently unavailable for this batch.</p>
                   </div>
                 )}
              </div>
            ) : batchViewTab === 'weekly' ? (
              <div className="pt-6">
                <WeeklyPlanner batchId={batch._id || batch.id} />
              </div>
            ) : (
              <div className="pt-6 min-h-[500px]">
                <div className="space-y-6 max-w-2xl mx-auto">
                  {announcements.length > 0 ? (
                    announcements.map((ann, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-stroke-light overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Post Header */}
                        <div className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-headings flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                            <img 
                              src="https://static.pw.live/files/pw_logo_20250107145242.png" 
                              alt="PW" 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=PW&background=1B2124&color=fff';
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="text-[15px] font-bold text-headings leading-none">
                              {ann.teacherName || ann.postedBy || ann.createdBy || ann.facultyName || 'PW Team'}
                            </h4>
                            <p className="text-[12px] text-body-2 mt-0.5 leading-none">
                              {(() => {
                                const dateStr = ann.createdAt || ann.date || ann.updatedAt || ann.publishedAt || ann.time;
                                if (!dateStr) return 'Recently';
                                const now = new Date();
                                const created = new Date(dateStr);
                                const diffMs = now.getTime() - created.getTime();
                                const diffMins = Math.floor(diffMs / (1000 * 60));
                                const diffHours = Math.floor(diffMins / 60);
                                const diffDays = Math.floor(diffHours / 24);
                                
                                if (diffMins < 1) return 'Just now';
                                else if (diffMins < 60) return `${diffMins}m ago`;
                                else if (diffHours < 24) return `${diffHours}h ago`;
                                else if (diffDays === 1) return '1d ago';
                                else return `${diffDays}d ago`;
                              })()}
                            </p>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="px-4 pb-4">
                          <div 
                            className="text-[14px] text-body-1 leading-relaxed announcement-content-light"
                            dangerouslySetInnerHTML={{ __html: ann.description || ann.message || '' }}
                          />
                          
                          {/* Image logic */}
                          {(ann.imageUrl || (ann.attachment?.baseUrl && ann.attachment.key && (ann.attachment.contentType?.includes('image') || true))) && (
                            <div 
                              className="w-full mt-3 overflow-hidden rounded-lg bg-tertiary-6"
                              onClick={() => setShowAnnouncementDetail(ann)}
                            >
                              <img 
                                src={ann.imageUrl || (ann.attachment?.baseUrl && `${ann.attachment.baseUrl}${ann.attachment.key}`)} 
                                alt={ann.title || 'Announcement Image'}
                                className="w-full h-auto object-contain cursor-pointer"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (ann.imageUrl && ann.attachment?.baseUrl && ann.attachment.key && target.src !== `${ann.attachment.baseUrl}${ann.attachment.key}`) {
                                        target.src = `${ann.attachment.baseUrl}${ann.attachment.key}`;
                                    }
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Attachment Link Footer */}
                        {(ann.fileUrl) && (
                          <div className="px-4 py-3 bg-tertiary-6 border-t border-stroke-light flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="text-primary" size={16} />
                              <span className="text-[12px] text-headings font-bold truncate max-w-[150px]">
                                {ann.fileUrl?.split('/').pop() || 'Attachment File'}
                              </span>
                            </div>
                            <a 
                              href={ann.fileUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[11px] font-bold text-primary px-4 py-1.5 bg-white border border-primary rounded hover:bg-primary hover:text-white transition-all uppercase tracking-wider"
                            >
                              Download
                            </a>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl border border-stroke-light p-20 text-center">
                      <Bell className="w-10 h-10 text-body-2/30 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-headings">No Announcements</h3>
                      <p className="text-sm text-body-2">Updates for this batch will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      ) : !selectedTopic ? (
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : topics.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {topics.map((topic, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedTopic(topic)}
                  className="bg-white p-4 rounded-xl border border-stroke-light hover:border-primary transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-tertiary-6 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors overflow-hidden border border-stroke-light">
                      {(topic.imageUrl || topic.image || topic.imageId) ? (
                        <img 
                          src={typeof (topic.imageUrl || topic.image || topic.imageId) === 'string' ? (topic.imageUrl || topic.image || topic.imageId) : ((topic.imageUrl || topic.image || topic.imageId)?.baseUrl ? `${(topic.imageUrl || topic.image || topic.imageId).baseUrl}${(topic.imageUrl || topic.image || topic.imageId).key}` : '')} 
                          alt="" 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Layers className="w-5 h-5 text-body-2 group-hover:text-primary" />
                      )}
                    </div>
                    <h4 className="font-bold text-headings text-sm line-clamp-1">{topic.topic || topic.name || topic.title || 'Chapter Name Not Available'}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-body-2 text-xs font-medium">
                    <span>{(() => {
                      const total = (topic.count || topic.totalContents || topic.contentsCount || 0) || 
                                   ((topic.videosCount || 0) + (topic.notesCount || 0) + (topic.exercisesCount || 0) + (topic.testsCount || 0));
                      return total > 0 ? `${total} items` : 'View';
                    })()}</span>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stroke-light p-20 text-center">
              <Lock className="w-10 h-10 text-body-2/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-headings">No chapters found</h3>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-stroke-light overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {(['videos', 'notes', 'dpp', 'tests'] as const).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all capitalize ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-body-2 hover:bg-tertiary-6'}`}
                >
                  {tab === 'dpp' ? 'DPP' : tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : contents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {contents.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleContentAction(item)}
                  className="bg-white p-4 rounded-xl border border-stroke-light hover:border-primary/30 transition-all flex flex-col sm:flex-row gap-4 group cursor-pointer"
                >
                  <div className="w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-tertiary-6 shrink-0 relative">
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                      {(item.videoDetails?.image || item.imageUrl) ? (
                        <img 
                          src={item.videoDetails?.image || item.imageUrl} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          alt="" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <img 
                            src="https://www.image2url.com/r2/default/images/1776957997005-fdbd026d-c585-491c-bf1f-68e5be13b6ec.png" 
                            className="w-12 h-12" 
                            alt="PDF" 
                          />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                        {item.videoDetails ? <Play className="w-6 h-6 fill-current" /> : <FileText className="w-6 h-6" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2 py-0.5 bg-tertiary-6 text-body-2 text-[10px] font-bold rounded uppercase">
                         {item.isTest ? item.testType : (item.videoDetails ? 'Video' : 'PDF Notes')}
                       </span>
                    </div>
                    <h4 className="font-bold text-headings text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
                      {item.topic || item.pdfName || item.testName || item.testTitle || item.name || item.title || 'Untitled Content'}
                    </h4>
                    {(item.note || item.description) && (
                      <p className="text-xs text-body-2 mt-2 line-clamp-2">{item.note || item.description}</p>
                    )}
                    {item.videoDetails?.duration && (
                      <p className="text-xs text-body-2 mt-2">Duration: {item.videoDetails.duration}</p>
                    )}
                    {item.isTest && (
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded font-bold">
                          {item.questionsCount || 0} Questions
                        </span>
                        <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded font-bold">
                          {item.duration || 0} Mins
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContentAction(item);
                      }}
                      className="flex-1 sm:flex-none px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      {item.isTest ? 'Start Test' : (item.videoDetails ? 'Watch' : 'View PDF')}
                    </button>
                    {!item.videoDetails && !item.isTest && (
                      <button className="p-2 border border-stroke-light rounded-lg text-body-2 hover:bg-tertiary-6 transition-colors hidden sm:block">
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stroke-light p-20 text-center">
              <div className="w-16 h-16 bg-tertiary-6 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-body-2/30" />
              </div>
              <h3 className="text-lg font-bold text-headings mb-1">No material found</h3>
              <p className="text-sm text-body-2">Try checking another tab or chapter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchExplorer;
