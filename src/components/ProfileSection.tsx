import React from 'react';
import { ShieldCheck, Target, HelpCircle, Info, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileSectionProps {
  user: any;
  profileInfo: any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, profileInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4 sm:px-8">
       <div className="flex items-center gap-4">
          <button onClick={() => navigate('/study')} className="p-2 hover:bg-white rounded-full transition-colors group bg-white shadow-sm border border-stroke-light">
            <ChevronLeft className="w-6 h-6 text-headings group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-headings tracking-tight">Account Details</h2>
            <p className="text-xs text-body-2 font-medium">Manage your profile and educational information</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
          <div className="md:col-span-1 space-y-6">
             <div className="bg-white rounded-[24px] border border-stroke-light p-8 text-center shadow-sm">
                <div className="w-28 h-28 rounded-full border-4 border-primary/10 overflow-hidden mx-auto mb-6 bg-tertiary-6 group relative shadow-md">
                   <img src={user?.image || "https://static.pw.live/files/boy_20250107145242.png"} className="w-full h-full object-cover" alt="" onError={(e:any) => e.target.src='https://static.pw.live/files/boy_20250107145242.png'} />
                </div>
                <h3 className="text-xl font-black text-headings truncate px-2">{user?.firstName || 'Student'} {user?.lastName || ''}</h3>
                <p className="text-sm text-body-2 font-medium mb-6 truncate px-2">{user?.email || 'No email provided'}</p>
                <div className="flex items-center justify-center gap-2 py-2 px-6 bg-success/10 text-success rounded-full text-xs font-black w-fit mx-auto border border-success/20">
                   <ShieldCheck className="w-4 h-4" /> VERIFIED PROFILE
                </div>
             </div>

             <div className="bg-white rounded-[24px] border border-stroke-light p-8 shadow-sm">
                <h4 className="font-extrabold text-headings text-sm mb-6 tracking-wide uppercase opacity-70">Contact Information</h4>
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-tertiary-6 flex items-center justify-center shrink-0 border border-stroke-light"><Target className="w-5 h-5 text-body-2" /></div>
                      <div className="min-w-0">
                         <p className="text-[10px] text-body-2 font-black leading-none mb-1 uppercase opacity-50">Mobile Number</p>
                         <p className="text-sm font-extrabold text-headings truncate">+91 {user?.mobile || '----------'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-tertiary-6 flex items-center justify-center shrink-0 border border-stroke-light"><HelpCircle className="w-5 h-5 text-body-2" /></div>
                      <div className="min-w-0">
                         <p className="text-[10px] text-body-2 font-black leading-none mb-1 uppercase opacity-50">Email Address</p>
                         <p className="text-sm font-extrabold text-headings truncate">{user?.email || 'Not verified'}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="md:col-span-2 space-y-6">
             <div className="bg-white rounded-[24px] border border-stroke-light p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                     <h4 className="font-black text-headings text-xl tracking-tight">Educational Details</h4>
                     <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline px-6 py-2.5 bg-primary/5 rounded-xl border border-primary/10 active:scale-95 transition-all">Edit Details</button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10">
                     {[
                       { label: 'CLASS', value: profileInfo?.class || '12th' },
                       { label: 'EXAMS', value: profileInfo?.exams?.join(', ') || 'NEET' },
                       { label: 'STREAM', value: profileInfo?.stream || 'Science' },
                       { label: 'BOARD', value: profileInfo?.board || 'CBSE' },
                       { label: 'LANGUAGE', value: profileInfo?.language || 'English' },
                       { label: 'STATE', value: profileInfo?.state || 'Rajasthan' }
                     ].map((item, idx) => (
                       <div key={idx} className="space-y-1.5 group">
                          <p className="text-[10px] font-black text-body-2 tracking-[0.15em] uppercase opacity-40">{item.label}</p>
                          <p className="text-base font-extrabold text-headings group-hover:text-primary transition-colors">{item.value}</p>
                          <div className="h-[2px] bg-stroke-light w-0 group-hover:w-full transition-all duration-300 bg-primary" />
                          <div className="h-px bg-stroke-light w-full group-hover:opacity-0 transition-opacity" />
                       </div>
                     ))}
                  </div>

                  <div className="mt-16 p-6 bg-[#F3F2FF] rounded-2xl border border-[#5A4BDA]/10 flex items-start gap-5">
                     <div className="p-3 bg-white rounded-xl shadow-md shrink-0 border border-[#5A4BDA]/10"><Info className="w-6 h-6 text-[#5A4BDA]" /></div>
                     <div>
                        <p className="text-sm font-black text-headings mb-1 tracking-tight">Experience personalized learning</p>
                        <p className="text-xs text-body-1 font-medium leading-relaxed opacity-80">Your details allow our AI systems to curate the most relevant content and batches for your specific preparation path at PW.</p>
                     </div>
                  </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ProfileSection;
