import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, Chrome, LogOut, Globe, Sparkles } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Button } from './components/ui/button';
import { useTranslation } from 'react-i18next';

// 新增頁面元件 (稍後建立)
import ExperienceExtractor from './pages/ExperienceExtractor';
import CareerNavigator from './pages/CareerNavigator';
import ResumeBuilder from './pages/ResumeBuilder';
import Auth from './pages/Auth';
import CopilotHackathonPage from './pages/CopilotHackathonPage';

function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t, i18n } = useTranslation();
  
  const navItems = [
    { path: '/extractor', label: t('nav.extractor'), icon: MessageSquare },
    { path: '/navigator', label: t('nav.navigator'), icon: LayoutDashboard },
    { path: '/resume', label: t('nav.resume'), icon: FileText },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 mt-2 px-2">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Chrome size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-wider">{t('nav.title')}</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <Link
          to="/copilot"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            location.pathname.startsWith('/copilot')
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-indigo-400 hover:bg-slate-800/50 hover:text-indigo-300'
          }`}
        >
          <Sparkles size={20} />
          <span>CopilotKit Demo</span>
        </Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4"
          onClick={toggleLanguage}
        >
          <Globe size={20} />
          <span className="font-medium">{i18n.language === 'en' ? '中文' : 'English'}</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4"
          onClick={signOut}
        >
          <LogOut size={20} />
          <span className="font-medium">{t('nav.logout')}</span>
        </Button>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 w-full font-['PingFang_SC','-apple-system',sans-serif] text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">{t('nav.loading')}</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/extractor" replace />} />
          <Route path="/extractor" element={<ProtectedRoute><ExperienceExtractor /></ProtectedRoute>} />
          <Route path="/navigator" element={<ProtectedRoute><CareerNavigator /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/copilot" element={<ProtectedRoute><CopilotHackathonPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
