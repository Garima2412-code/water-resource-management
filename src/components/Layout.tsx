import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { DeveloperBar } from './DeveloperBar';
import { useWater } from '../context/WaterContext';
import { ShieldAlert, LogIn } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { userRole } = useWater();

  // Public/Full screen routes
  const isPublicPage = ['/landing', '/login', '/register', '/404'].includes(location.pathname);

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-civic-bg flex flex-col justify-between">
        <main className="flex-1">{children}</main>
        <DeveloperBar />
      </div>
    );
  }

  // Check role restriction for current route
  // Citizen restricted pages
  const restrictedPages = ['/dashboard', '/sources', '/quality', '/maintenance', '/analytics', '/reports'];
  const isRestricted = userRole === 'citizen' && restrictedPages.some(path => location.pathname.startsWith(path));


  return (
    <div className="min-h-screen bg-civic-bg flex">
      {/* Sidebar navigation */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Spacious content area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
          {isRestricted ? (
            <div className="bg-white border border-civic-border rounded-xl p-8 text-center max-w-lg mx-auto mt-16 shadow-civic">
              <div className="w-12 h-12 bg-status-danger-bg rounded-full flex items-center justify-center mx-auto mb-4 text-status-danger-text">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Restricted Departmental View</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                This page contains internal water management data, infrastructure status, and field logs. Access is limited to registered Field Officers and Administrators.
              </p>
              
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">How to inspect this screen:</p>
                <p className="text-xs text-slate-600 leading-normal">
                  Use the <strong className="text-slate-800">Dev Sandbox</strong> bar floating at the bottom of the window to change your active role to <strong className="text-brand-600">Officer</strong> or <strong className="text-brand-600">Admin</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link 
                  to="/complaints" 
                  className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Return to Complaints
                </Link>
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log in as Official</span>
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Sandbox controller */}
      <DeveloperBar />
    </div>
  );
};
