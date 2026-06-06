import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Droplets, 
  Activity, 
  AlertCircle, 
  Wrench, 
  BarChart3, 
  Map, 
  Home, 
  Menu,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Settings,
  FileText
} from 'lucide-react';
import { useWater } from '../context/WaterContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { userRole, complaints, maintenanceTasks } = useWater();

  // Get active badges count
  const pendingComplaintsCount = complaints.filter(c => c.status === 'Submitted' || c.status === 'Assigned').length;
  const activeTasksCount = maintenanceTasks.filter(t => t.status !== 'Completed').length;

  const menuItems = [
    { path: '/dashboard', label: 'Command Center', icon: LayoutDashboard, roles: ['admin', 'officer'] },
    { path: '/sources', label: 'Water Sources', icon: Droplets, roles: ['admin', 'officer'] },
    { path: '/quality', label: 'Water Quality', icon: Activity, roles: ['admin', 'officer'] },
    { path: '/map', label: 'GIS Live Map', icon: Map, roles: ['admin', 'officer', 'citizen'] },
    { path: '/complaints', label: 'Complaints', icon: AlertCircle, roles: ['admin', 'officer', 'citizen'], badge: userRole !== 'citizen' ? pendingComplaintsCount : null },
    { path: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['admin', 'officer'], badge: activeTasksCount },
    { path: '/analytics', label: 'Analytics & Reports', icon: BarChart3, roles: ['admin', 'officer'] },
    { path: '/reports', label: 'Report Generator', icon: FileText, roles: ['admin', 'officer'] },
  ];


  return (
    <aside 
      className={`bg-white border-r border-civic-border h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div>
        {/* Header Branding */}
        <div className="h-16 border-b border-civic-border flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-md bg-brand-600 flex items-center justify-center shrink-0 shadow-sm">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-slate-800 text-lg tracking-tight whitespace-nowrap">
                Hydro<span className="text-brand-600">Civic</span>
              </span>
            )}
          </Link>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-500 hidden md:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Role Card */}
        <div className={`p-4 border-b border-civic-border bg-slate-50/50 flex items-center gap-3 overflow-hidden`}>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            {userRole === 'admin' ? (
              <ShieldCheck className="w-5 h-5 text-brand-600" />
            ) : (
              <User className="w-5 h-5 text-slate-600" />
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active View</p>
              <p className="text-sm font-medium text-slate-700 capitalize truncate">
                {userRole === 'admin' ? 'Administrator' : userRole === 'officer' ? 'Field Officer' : 'Citizen'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const hasAccess = item.roles.includes(userRole);
            // Even if role doesn't have direct access, let's keep it visible but styled differently/disabled or restrict on routing
            // For citizen, let's hide admin-only pages or keep them visible as locked.
            // Let's show locked pages with a lock icon, which is extremely nice UI!
            
            return (
              <NavLink
                key={item.path}
                to={hasAccess ? item.path : '#'}
                className={({ isActive }) => {
                  const baseClasses = "flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-all group";
                  if (!hasAccess) {
                    return `${baseClasses} text-slate-400 cursor-not-allowed opacity-50`;
                  }
                  return isActive && item.path !== '#'
                    ? `${baseClasses} bg-brand-50 text-brand-700 shadow-sm`
                    : `${baseClasses} text-slate-600 hover:bg-slate-50 hover:text-slate-900`;
                }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 shrink-0 transition-colors ${
                    hasAccess ? 'text-slate-500 group-hover:text-slate-900' : 'text-slate-400'
                  }`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                
                {!collapsed && item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-civic-border space-y-1">
        <Link 
          to="/landing" 
          className="flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 group"
        >
          <Home className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-900" />
          {!collapsed && <span className="truncate">Public Portal</span>}
        </Link>
        <Link 
          to="/login" 
          className="flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 group"
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-900" />
          {!collapsed && <span className="truncate">Switch Account</span>}
        </Link>
      </div>
    </aside>
  );
};
