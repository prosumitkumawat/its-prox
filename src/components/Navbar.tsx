import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, User, LogOut, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import LoginModal from './LoginModal';
import { getUserInfo, getUserProfileInfo } from '../services/api';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileInfo, setProfileInfo] = useState<any>(null);
  const [hasToken, setHasToken] = useState(!!localStorage.getItem('pw_token'));
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [siteName, setSiteName] = useState('Physics Wallah');
  const [showLoginBtn, setShowLoginBtn] = useState(true);

  useEffect(() => {
    const customName = localStorage.getItem('admin_site_name');
    if (customName) setSiteName(customName);

    const showLoginSetting = localStorage.getItem('admin_show_login');
    if (showLoginSetting === 'false') setShowLoginBtn(false);

    const initUser = async () => {
      const storedUser = localStorage.getItem('pw_user');
      const token = localStorage.getItem('pw_token');
      const adminLoginSetting = localStorage.getItem('admin_login_enabled');
      const loginNotRequired = adminLoginSetting === 'false';

      if (token || loginNotRequired) setHasToken(true);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      } else if (loginNotRequired) {
        // Provide guest user if login is optional
        setUser({
          name: 'Guest User',
          firstName: 'Guest',
          image: 'https://static.pw.live/files/boy_20250107145242.png'
        });
      }

      if (token) {
        try {
          const [userData, profileData] = await Promise.all([
            !storedUser ? getUserInfo(token) : Promise.resolve(null),
            getUserProfileInfo(token)
          ]);

          if (userData) {
            setUser(userData);
            localStorage.setItem('pw_user', JSON.stringify(userData));
          }
          if (profileData) {
            setProfileInfo(profileData);
          }
        } catch (err) {
          console.error("Error refreshing auth data", err);
        }
      }
    };
    initUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pw_token');
    localStorage.removeItem('pw_user');
    setUser(null);
    setProfileInfo(null);
    window.location.reload();
  };

  const displayName = user?.firstName || user?.name || user?.lastName || 'Student';
  const avatarUrl = user?.image || "https://static.pw.live/files/boy_20250107145242.png";

  const getCohortDisplay = () => {
    if (!profileInfo) return '12th - NEET';
    
    let display = '';
    if (profileInfo.class) display += profileInfo.class;
    if (profileInfo.exams?.length > 0) {
      display += (display ? ' - ' : '') + profileInfo.exams.join(', ');
    }
    
    // Add stream/board/language selectively if they exist and aren't already represented
    const extras = [];
    if (profileInfo.stream && !display.includes(profileInfo.stream)) extras.push(profileInfo.stream);
    if (profileInfo.board && !display.includes(profileInfo.board)) extras.push(profileInfo.board);
    if (profileInfo.language) extras.push(profileInfo.language);
    
    if (extras.length > 0) {
      return `${display} (${extras.join(' | ')})`;
    }
    
    return display || '12th - NEET';
  };

  const cohortDisplay = getCohortDisplay();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] h-[60px] md:h-[64px] bg-[#5a4bda] border-b border-white/10">
        <div className="mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Left Side: Logo & Cohort */}
          <div className="flex items-center gap-2 md:gap-4">
            {hasToken && (
               <button 
                 onClick={onMenuClick}
                 className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
               >
                 <Menu size={24} />
               </button>
            )}
            <a href="/" className="flex items-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M14.4659 11.2233C14.9254 10.8076 15.1552 10.2593 15.1552 9.56773C15.1552 8.87612 14.9434 8.37443 14.5198 8.00174C14.0962 7.62547 13.4429 7.43555 12.5705 7.43555C12.1864 7.43555 11.7198 7.47497 11.1741 7.55022C11.1311 9.00512 11.1095 10.3776 11.1023 11.6713C11.648 11.7859 12.1182 11.8433 12.5095 11.8433C13.3531 11.8433 14.0029 11.6354 14.4659 11.2233Z" fill="white"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M16.182 3.66895C9.36148 3.66895 3.82968 9.19113 3.82968 15.9998C3.82968 22.8085 9.36148 28.3306 16.182 28.3306C23.0025 28.3306 28.5343 22.8085 28.5343 15.9998C28.5343 9.19113 23.0061 3.66895 16.182 3.66895ZM25.3394 17.1537C25.2533 17.2254 25.1707 17.3508 25.0917 17.5228C24.9697 17.8023 24.4025 19.3826 23.3974 22.2602C23.3687 22.3354 22.8446 23.8978 21.8251 26.9474L21.703 27.0155H21.301L19.5205 21.9663C19.3589 21.5148 19.1471 20.9486 18.8815 20.2642C18.2389 21.9484 17.4348 24.1989 16.462 27.0155H15.9415C15.1517 24.6755 14.2902 22.2172 13.364 19.6371C12.9081 18.3613 12.6138 17.616 12.481 17.3974C12.4128 17.2827 12.3266 17.1895 12.2189 17.1178C12.1148 17.0498 11.9246 16.9745 11.6481 16.8957C10.381 16.8957 8.9666 16.9028 7.85019 16.8957V16.5517C8.05481 16.5051 8.20199 16.4728 8.3025 16.4585C8.98096 16.3295 9.35789 16.2327 9.43686 16.1754C9.5625 16.0679 9.63071 15.7884 9.63071 15.3297L9.65584 11.8322L9.64865 8.33467V8.177C9.64865 7.37071 8.63635 6.96219 7.97942 6.82243C8.83737 6.7651 9.47635 6.81526 10.4061 6.80451L13.4538 6.77585C14.5881 6.77585 15.4102 7.00161 15.9307 7.44955C16.4512 7.90465 16.7097 8.51743 16.7097 9.29147C16.7097 10.1909 16.3579 10.947 15.6615 11.5562C14.9615 12.169 13.9994 12.47 12.7717 12.47C12.2979 12.47 11.7379 12.4091 11.0881 12.2837C11.0846 13.0362 11.0846 13.5702 11.0846 13.8963C11.0846 15.1183 11.1097 15.8314 11.1599 16.0285C11.1815 16.1109 11.2281 16.1754 11.3035 16.2184C11.4471 16.2972 11.7415 16.3868 12.7574 16.4047C12.7681 16.4047 12.7753 16.4047 12.7861 16.4119C13.0087 16.4191 13.1774 16.4226 13.2922 16.4226C13.7015 16.4226 14.362 16.394 15.2702 16.3438V16.7774C14.6958 16.9243 14.3584 17.0354 14.2579 17.1178C14.1574 17.1967 14.1107 17.2899 14.1107 17.4045C14.1107 17.5084 14.2112 17.8668 14.4158 18.4796C15.3133 21.2532 16.0133 23.2958 16.5158 24.6038L18.4974 19.1712C18.1779 18.2717 17.9553 17.7235 17.844 17.5192C17.7292 17.3185 17.6143 17.1788 17.4922 17.1071C17.3702 17.0318 17.0292 16.9208 16.4656 16.7738V16.3402C17.363 16.394 18.0594 16.4191 18.5512 16.4191C19.0681 16.4191 19.7394 16.3904 20.5722 16.3402V16.7738L20.3138 16.8383C19.9117 16.9172 19.6533 17.0032 19.5384 17.0963C19.4666 17.1609 19.4307 17.254 19.4307 17.383C19.4307 17.4368 19.4343 17.4869 19.4451 17.5407C19.4738 17.6661 19.743 18.4796 20.2492 19.9703L21.8035 24.4748C22.1374 23.5431 22.5358 22.3498 23.0061 20.8949L24.083 17.5335C24.0974 17.4619 24.1046 17.4009 24.1046 17.3472C24.1046 17.2576 24.0758 17.1931 24.0256 17.1537C23.9717 17.1107 23.6128 16.9853 22.9451 16.7738V16.3402C23.8461 16.394 24.4312 16.4191 24.704 16.4191C25.0343 16.4191 25.5871 16.3904 26.3625 16.3402V16.7738C25.8133 16.9208 25.4687 17.0498 25.3358 17.1573L25.3394 17.1537Z" fill="white"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M16.1818 1.45459C22.8228 1.45459 28.43 5.89097 30.1818 11.9614H28.9649C27.249 6.54317 22.1767 2.61923 16.1818 2.61923C10.1869 2.61923 5.11463 6.54317 3.39873 11.9614H2.18181C3.93719 5.89097 9.54078 1.45459 16.1818 1.45459ZM30.1818 20.0387C28.4264 26.1055 22.8228 30.5455 16.1818 30.5455C9.54078 30.5455 3.93719 26.1091 2.18181 20.0387H3.39873C5.11463 25.4533 10.1905 29.3809 16.1818 29.3809C22.1731 29.3809 27.249 25.4533 28.9649 20.0387H30.1818Z" fill="white"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-white hidden md:block">{siteName}</span>
            </a>
            
            {user && (
              <div className="hidden lg:flex items-center gap-2 border-l pl-4 border-white/10 text-white">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group">
                  <img src="https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/d9884a89-e9f5-4d01-ad95-ff4435c66284.svg" className="w-5 h-5 brightness-0 invert" alt="" />
                  <span className="text-sm font-bold">{cohortDisplay}</span>
                  <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </button>
              </div>
            )}
          </div>

          {!user && (
            <div className="items-center lg:flex hidden gap-1 xl:gap-3 text-white">
              <button className="flex items-center gap-1.5 border border-white/30 text-white px-6 py-2.5 rounded-md font-semibold text-base hover:bg-white/10 transition-colors">
                All Courses
                <ChevronDown className="w-5 h-5" />
              </button>
              <nav className="flex items-center gap-1 xl:gap-2">
                {['Vidyapeeth', 'PW Skills', 'PW Store', 'Real Test', 'Class 1st - 8th', 'Power Batch'].map((item) => (
                  <a key={item} href="#" className="px-3 py-2 text-base font-semibold whitespace-nowrap rounded-md hover:bg-white/10 transition-colors">{item}</a>
                ))}
              </nav>
            </div>
          )}

          {/* Right Side: Login / Download / Profile */}
          <div className="flex items-center gap-4">
            {hasToken ? (
              <div className="flex items-center gap-4 relative">
                <a href="#" className="hidden sm:block">
                  <img src="https://www.pw.live/study-v2/static/image/google-play.1ef2ec78.png" alt="Get App" className="h-[24px]" />
                </a>
                
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white hidden sm:block whitespace-nowrap">Hi, {user ? displayName : 'Student'}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-8 rounded-full border border-white/30 overflow-hidden shadow-sm bg-white p-1">
                        <img src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/537952c6-cac8-4284-83a1-4a81818d3ccc.webp" className="w-full h-full object-contain" alt="PW" />
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/50 group-hover:text-white transition-all ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-stroke-light overflow-hidden text-headings"
                      >
                        <div className="p-4 bg-tertiary-6 border-b border-stroke-light">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full border border-stroke-light overflow-hidden bg-white p-1.5">
                              <img src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/537952c6-cac8-4284-83a1-4a81818d3ccc.webp" className="w-full h-full object-contain" alt="PW" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{displayName}</p>
                              <p className="text-[10px] text-body-2 truncate">{user?.email || '+91 ' + user?.mobile}</p>
                            </div>
                          </div>
                          <div className="bg-primary/5 p-2 rounded-lg border border-primary/10">
                            <p className="text-[10px] font-bold text-primary uppercase">Current Batch</p>
                            <p className="text-xs font-semibold truncate">{cohortDisplay}</p>
                          </div>
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-secondary hover:bg-secondary/5 rounded-lg transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : showLoginBtn ? (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-white text-primary px-8 py-2.5 rounded-md font-semibold text-base hover:bg-opacity-90 transition-opacity"
              >
                Login/Register
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
};

export default Navbar;
