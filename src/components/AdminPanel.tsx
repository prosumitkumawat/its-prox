import React, { useState, useEffect } from 'react';
import { Lock, Plus, Trash2, Save, X, Check, Settings, Layout, Users, Target } from 'lucide-react';
import { customBatches as initialBatches, Batch } from '../services/batches';
import { 
  getScheduleDetails, 
  getScheduleThreeDModel, 
  getStudyPageWidgets, 
  getHomepageWidgets, 
  getUserDetailsList, 
  getMoEngageCampaigns, 
  getNebulaCohort, 
  getAIPersonalisationStats 
} from '../services/api';

const ADMIN_PASSWORD = '3605';

const DebugAPIIntegration = () => {
  const [debugData, setDebugData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('pw_token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const p1 = getScheduleDetails(token, '698eb0cbc33fcf7fe6c73249', '5f709c26796f410011b7b80b', '69e88b743ef111fc87bdf113');
      const p1_5 = getScheduleThreeDModel(token, '698eb0cbc33fcf7fe6c73249', 'pralayam-tg-eapcet-crash-course-2026-595989', '69e88b743ef111fc87bdf113');
      const p2 = getStudyPageWidgets(token, '690e0745904eeba494a0ec81', '698eb0cbc33fcf7fe6c73249');
      const p3 = getHomepageWidgets(token, '634fd2463ce3d7001c50798a', 'Free');
      const p4 = getUserDetailsList(token, ['68dfa36305911a7d5944eb74', '68caff879bc0cfb73cbaec34']);
      const p5 = getMoEngageCampaigns(token, '2e9e7fba-fb4e-42a2-ba00-5ee5815571ff');
      const p6 = getNebulaCohort(token, '634fd2463ce3d7001c50798a');
      const p7 = getAIPersonalisationStats(token, '690e06a4e99e7aac3057df5b', 'Vernacular Telugu', '12+', 'SCHOOL_PREPARATION');

      try {
        const results = await Promise.allSettled([p1, p1_5, p2, p3, p4, p5, p6, p7]);
        setDebugData({
          scheduleDetails: results[0].status === 'fulfilled' ? results[0].value : 'Error',
          scheduleThreeDModel: results[1].status === 'fulfilled' ? results[1].value : 'Error',
          studyPageWidgets: results[2].status === 'fulfilled' ? results[2].value : 'Error',
          homepageWidgets: results[3].status === 'fulfilled' ? results[3].value : 'Error',
          userDetailsList: results[4].status === 'fulfilled' ? results[4].value : 'Error',
          moEngageCampaigns: results[5].status === 'fulfilled' ? results[5].value : 'Error',
          nebulaCohort: results[6].status === 'fulfilled' ? results[6].value : 'Error',
          aiPersonalisationStats: results[7].status === 'fulfilled' ? results[7].value : 'Error',
        });
      } catch (e) {
        setDebugData({ error: 'Failed to execute one or more APIs', msg: String(e) });
      }
      setLoading(false);
    };

    fetchAll();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stroke-light p-6 mt-6 overflow-hidden max-w-full">
      <h3 className="font-bold text-lg mb-4 flex justify-between items-center text-headings">
        <span className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          API Live Test Viewer
        </span>
        {loading && <span className="text-primary text-sm font-bold flex items-center gap-2"><div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"/> Fetching...</span>}
      </h3>
      <div className="max-h-[500px] overflow-y-auto bg-[#1A1A1A] rounded-lg p-5 font-mono text-xs text-[#00FF41]">
        <pre className="whitespace-pre-wrap break-words">{JSON.stringify(debugData, null, 2)}</pre>
      </div>
      <p className="mt-3 text-[10px] text-body-2 bg-yellow-50 p-2 rounded text-yellow-800">
        Note: If responses are null, verify your account access token. We have implemented all requested endpoints so you can verify their real JSON structure here before we build standard visual components for them.
      </p>
    </div>
  );
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Settings
  const [isLoginEnabled, setIsLoginEnabled] = useState(true);
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [siteName, setSiteName] = useState('Physics Wallah');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    name: '',
    byName: '',
    language: 'Hinglish',
    previewImage: '',
    _id: ''
  });

  useEffect(() => {
    // Load settings
    const storedLoginSetting = localStorage.getItem('admin_login_enabled');
    if (storedLoginSetting !== null) {
      setIsLoginEnabled(storedLoginSetting === 'true');
    }

    const storedShowLogin = localStorage.getItem('admin_show_login');
    if (storedShowLogin !== null) {
      setShowLoginButton(storedShowLogin === 'true');
    }

    const storedSiteName = localStorage.getItem('admin_site_name');
    if (storedSiteName) {
      setSiteName(storedSiteName);
    }

    const storedBatches = localStorage.getItem('admin_custom_batches');
    if (storedBatches) {
      try {
        setBatches(JSON.parse(storedBatches));
      } catch (e) {
        setBatches(initialBatches);
      }
    } else {
      setBatches(initialBatches);
    }

    // Check if session is already authenticated
    const sessionAuth = sessionStorage.getItem('admin_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      setError('Incorrect Password');
    }
  };

  const saveSettings = () => {
    localStorage.setItem('admin_login_enabled', String(isLoginEnabled));
    localStorage.setItem('admin_show_login', String(showLoginButton));
    localStorage.setItem('admin_site_name', siteName);
    localStorage.setItem('admin_custom_batches', JSON.stringify(batches));
    alert('Settings Saved Successfully! Page will now reload to apply changes.');
    window.location.reload();
  };

  const handleToggleLogin = () => {
    setIsLoginEnabled(!isLoginEnabled);
  };

  const handleRemoveBatch = (id: string) => {
    if (confirm('Are you sure you want to remove this batch?')) {
      setBatches(batches.filter(b => b._id !== id));
    }
  };

  const handleAddBatch = () => {
    if (!newBatch.name || !newBatch._id) {
      alert('Batch Name and ID are required');
      return;
    }
    const batchToAdd: Batch = {
      _id: newBatch._id || String(Date.now()),
      name: newBatch.name || '',
      byName: newBatch.byName || 'Custom Batch',
      language: newBatch.language || 'English',
      previewImage: newBatch.previewImage || 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/9769ee8a-449e-4e42-be5d-a026e6331a98.png',
      slug: newBatch.name?.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7)
    };
    setBatches([batchToAdd, ...batches]);
    setIsAddingBatch(false);
    setNewBatch({ name: '', byName: '', language: 'Hinglish', previewImage: '', _id: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-tertiary-6 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-grey-10">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-headings">Admin Panel Access</h1>
            <p className="text-body-2 text-center mt-2">Enter the secure password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Manager Password"
                className="w-full px-4 py-3 rounded-lg border border-grey-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-xl tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-error text-sm mt-2 text-center font-medium">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Unlock Dashboard
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-grey-10 text-center">
            <p className="text-xs text-grey-400">Restricted Area. Unauthorized access is monitored.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tertiary-6 pb-20">
      {/* Admin Header */}
      <div className="bg-white border-b border-grey-10 sticky top-[60px] md:top-[64px] z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-headings">Master Control Panel</h1>
          </div>
          <button
            onClick={saveSettings}
            className="bg-success text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" /> Save All Changes
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Branding & Login Section */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-grey-10">
          <div className="p-6 border-b border-grey-10">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-headings">Authentication & Branding</h2>
                <p className="text-sm text-body-2">Control identities and global site appearance</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Site Name */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-grey-10 last:border-0">
              <div>
                <p className="font-bold text-headings">App Display Name</p>
                <p className="text-xs text-body-2">This name appears in the Navbar and Footer</p>
              </div>
              <input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="px-4 py-2 rounded-lg border border-grey-10 focus:ring-1 focus:ring-primary outline-none w-full md:w-64"
                placeholder="e.g. Physics Wallah"
              />
            </div>

            {/* Login Toggle */}
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-bold text-headings">Login Requirement</p>
                <p className="text-xs text-body-2">Set to 'Open Access' to bypass the auth screen</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-bold ${isLoginEnabled ? 'text-primary' : 'text-grey-400'}`}>
                  {isLoginEnabled ? 'PROTECTED' : 'OPEN ACCESS'}
                </span>
                <button
                  onClick={handleToggleLogin}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none ${
                    isLoginEnabled ? 'bg-primary' : 'bg-grey-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      isLoginEnabled ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Show/Hide Login Button */}
            <div className="flex items-center justify-between gap-4 py-4 border-t border-grey-10">
              <div>
                <p className="font-bold text-headings">Show Login Button on Navbar</p>
                <p className="text-xs text-body-2">Turn off to completely remove the Login button from the landing page</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-bold ${showLoginButton ? 'text-primary' : 'text-grey-400'}`}>
                  {showLoginButton ? 'VISIBLE' : 'HIDDEN'}
                </span>
                <button
                  onClick={() => setShowLoginButton(!showLoginButton)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none ${
                    showLoginButton ? 'bg-primary' : 'bg-grey-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      showLoginButton ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-grey-6/30">
            <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-lg border border-primary-100">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-headings font-medium">Auto-Guest Mode:</p>
                <p className="text-xs text-body-2 mt-1">If 'Open Access' is on, users are automatically given a guest profile for the duration of their visit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Batches Management */}
        <section className="bg-white rounded-xl shadow-sm border border-grey-10">
          <div className="p-6 border-b border-grey-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layout className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-headings">Batches Management</h2>
                <p className="text-sm text-body-2">Add, edit or remove custom batches from the storefront</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingBatch(true)}
              className="bg-primary-50 text-primary hover:bg-primary-100 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Batch
            </button>
          </div>

          <div className="p-6">
            {isAddingBatch && (
              <div className="mb-8 p-6 bg-grey-6 rounded-xl border-2 border-dashed border-grey-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-headings">Configure New Batch</h3>
                  <button onClick={() => setIsAddingBatch(false)} className="text-body-2 hover:text-error">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-grey-500 uppercase">Batch Name</label>
                    <input
                      value={newBatch.name}
                      onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                      placeholder="e.g. Lakshya JEE 2025"
                      className="w-full px-4 py-2 rounded-lg border border-grey-10 focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-grey-500 uppercase">Batch ID / Order</label>
                    <input
                      value={newBatch._id}
                      onChange={(e) => setNewBatch({ ...newBatch, _id: e.target.value })}
                      placeholder="e.g. unique_batch_id"
                      className="w-full px-4 py-2 rounded-lg border border-grey-10 focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-grey-500 uppercase">Description / By Name</label>
                    <input
                      value={newBatch.byName}
                      onChange={(e) => setNewBatch({ ...newBatch, byName: e.target.value })}
                      placeholder="e.g. For Class 12 Aspirants"
                      className="w-full px-4 py-2 rounded-lg border border-grey-10 focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-grey-500 uppercase">Language</label>
                    <input
                      value={newBatch.language}
                      onChange={(e) => setNewBatch({ ...newBatch, language: e.target.value })}
                      placeholder="e.g. Hinglish"
                      className="w-full px-4 py-2 rounded-lg border border-grey-10 focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-grey-500 uppercase">Preview Image URL</label>
                    <input
                      value={newBatch.previewImage}
                      onChange={(e) => setNewBatch({ ...newBatch, previewImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-lg border border-grey-10 focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => setIsAddingBatch(false)}
                    className="px-6 py-2 text-body-2 font-bold hover:bg-grey-50 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBatch}
                    className="bg-primary text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-primary-600 transition-all"
                  >
                    Create Batch
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-grey-6 border-b border-grey-10">
                    <th className="p-4 text-xs font-bold text-grey-500 uppercase">Preview</th>
                    <th className="p-4 text-xs font-bold text-grey-500 uppercase">Batch Info</th>
                    <th className="p-4 text-xs font-bold text-grey-500 uppercase text-center">Language</th>
                    <th className="p-4 text-xs font-bold text-grey-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-10">
                  {batches.map((batch) => (
                    <tr key={batch._id} className="hover:bg-grey-6/30 transition-colors">
                      <td className="p-4">
                        <img
                          src={batch.previewImage || 'https://via.placeholder.com/100x60'}
                          alt=""
                          className="w-16 h-10 object-cover rounded border border-grey-10"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-headings">{batch.name}</div>
                        <div className="text-xs text-body-2">{batch.byName}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 bg-grey-50 rounded-full text-xs font-bold text-grey-700">
                          {batch.language}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRemoveBatch(batch._id)}
                          className="p-2 text-grey-300 hover:text-error hover:bg-error/5 rounded-lg transition-all"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* API Debugger */}
        <section className="bg-white rounded-xl shadow-sm border border-grey-10">
          <div className="p-6 border-b border-grey-10">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-headings">API System Diagnostics</h2>
                <p className="text-sm text-body-2">Live verification of raw PW API integration</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <DebugAPIIntegration />
          </div>
        </section>
      </div>

      {/* Floating Action Hint */}
      <div className="fixed bottom-6 right-6 bg-headings text-white px-4 py-2 rounded-full text-xs font-mono shadow-2xl z-50">
        ADMIN_MODE_ACTIVE
      </div>
    </div>
  );
}
