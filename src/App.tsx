import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BannerCarousel from './components/BannerCarousel';
import Hero from './components/Hero';
import UserDashboard from './components/UserDashboard';
import LibrarySection from './components/LibrarySection';
import PowerBatch from './components/PowerBatch';
import PISection from './components/PISection';
import TestSeriesSection from './components/TestSeriesSection';
import BooksSection from './components/BooksSection';
import BatchesSection from './components/BatchesSection';
import ProfileSection from './components/ProfileSection';
import StatsSection from './components/StatsSection';
import ExamCategories from './components/ExamCategories';
import OfflineCentres from './components/OfflineCentres';
import ResultsSection from './components/ResultsSection';
import PlatformStats from './components/PlatformStats';
import AppBanner from './components/AppBanner';
import YouTubeSection from './components/YouTubeSection';
import Footer from './components/Footer';
import FloatingAction from './components/FloatingAction';
import AdminPanel from './components/AdminPanel';
import PurchasedBatchesSection from './components/PurchasedBatchesSection';
import { getUserInfo, getUserProfileInfo } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileInfo, setProfileInfo] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginRequired, setIsLoginRequired] = useState(true);

  useEffect(() => {
    // Check if admin has disabled login requirement
    const adminLoginSetting = localStorage.getItem('admin_login_enabled');
    if (adminLoginSetting === 'false') {
      setIsLoginRequired(false);
      // If login is not required, we simulate authenticated state for navigation
      setIsAuthenticated(true);
      // Provide a guest user if none exists
      if (!localStorage.getItem('pw_user')) {
        setUser({
          name: 'Guest User',
          firstName: 'Guest',
          isGuest: true,
          image: 'https://static.pw.live/files/boy_20250107145242.png'
        });
      }
    }

    const token = localStorage.getItem('pw_token');
    const storedUser = localStorage.getItem('pw_user');
    
    if (token) {
      setIsAuthenticated(true);
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    const fetchData = async () => {
      // Add a safety timeout to ensure we don't hang forever
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 5000));
      
      if (token) {
        try {
          const fetchPromise = Promise.all([
            !storedUser ? getUserInfo(token) : Promise.resolve(null),
            getUserProfileInfo(token)
          ]);
          
          const result = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (result === 'timeout') {
            console.warn("Auth initialization timed out, proceeding with stored data");
          } else {
            const [userData, extraInfo] = result as [any, any];
            if (userData) {
              setUser(userData);
              localStorage.setItem('pw_user', JSON.stringify(userData));
            }
            if (extraInfo) setProfileInfo(extraInfo);
          }
        } catch (e) {
          console.error("Auth init failed", e);
        }
      } else {
        // If no token, we still want to finish loading quickly
        await Promise.race([Promise.resolve(), timeoutPromise]);
      }
      setIsLoadingAuth(false);
    };
    fetchData();
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-tertiary-6 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tertiary-6">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className={isAuthenticated ? "pt-[60px] md:pt-[64px] lg:pl-[240px]" : "pt-[60px] md:pt-[64px]"}>
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
        <main className={isAuthenticated ? "min-h-[calc(100vh-64px)]" : ""}>
          <Routes>
            {/* Hidden Admin Route */}
            <Route path="/xyzabc123" element={<AdminPanel />} />

            {isAuthenticated ? (
              <>
                <Route path="/study" element={<UserDashboard />} />
                <Route path="/batches" element={<BatchesSection />} />
                <Route path="/power-batch" element={<PowerBatch />} />
                <Route path="/test-series" element={<TestSeriesSection />} />
                <Route path="/purchased-batches" element={<PurchasedBatchesSection />} />
                <Route path="/books" element={<BooksSection />} />
                <Route path="/pi" element={<PISection />} />
                <Route path="/library" element={<LibrarySection />} />
                <Route path="/profile" element={<ProfileSection user={user} profileInfo={profileInfo} />} />
                <Route path="/" element={<Navigate to="/study" replace />} />
              </>
            ) : (
              <Route path="*" element={
                <>
                  <BannerCarousel />
                  <Hero />
                  <StatsSection />
                  <ExamCategories />
                  <OfflineCentres />
                  <ResultsSection />
                  <PlatformStats />
                  <AppBanner />
                  <YouTubeSection />
                </>
              } />
            )}
          </Routes>
        </main>
      </div>

      {!isAuthenticated && <Footer />}
      <FloatingAction />
    </div>
  );
}
