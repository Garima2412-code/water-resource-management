import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, X, Check, Trash2, SlidersHorizontal, AlertTriangle, Droplet, Wrench, MessageSquare } from 'lucide-react';
import { useWater } from '../context/WaterContext';

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { notifications, markNotificationAsRead, clearNotifications, userRole } = useWater();
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Close notifications on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const displayedNotifications = notifications
    .filter(n => filterType === 'all' || !n.read)
    .slice(0, 10); // Display top 10

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'low_water':
        return <Droplet className="w-4 h-4 text-orange-500" />;
      case 'quality_warning':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'maintenance_reminder':
        return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'complaint_update':
        return <MessageSquare className="w-4 h-4 text-teal-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const getNotifColor = (type: string) => {
    switch (type) {
      case 'low_water': return 'bg-orange-50 border-orange-100';
      case 'quality_warning': return 'bg-red-50 border-red-100';
      case 'maintenance_reminder': return 'bg-blue-50 border-blue-100';
      case 'complaint_update': return 'bg-teal-50 border-teal-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <header className="h-16 border-b border-civic-border bg-white sticky top-0 z-20 px-4 flex items-center justify-between">
      {/* Left items: menu toggle & page breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 block md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Water Board Portal</span>
          <span className="text-slate-300">/</span>
          <span className="text-brand-600 font-bold">Live Data</span>
        </div>
      </div>

      {/* Center Search bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search sources, complaints, regions..." 
            className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Right side options: notifications, date, user info */}
      <div className="flex items-center gap-4">
        {/* Current Date Display */}
        <span className="text-xs text-slate-500 font-medium hidden lg:inline-block bg-slate-50 px-2.5 py-1.5 border border-slate-100 rounded-md">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>

        {/* Notifications Icon & Panel */}
        <div className="relative" ref={panelRef}>
          <button 
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifPanel && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-civic-border rounded-lg shadow-civic-lg z-50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-civic-border flex items-center justify-between bg-slate-50/50">
                <span className="font-semibold text-sm text-slate-800">Alert Center</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFilterType(filterType === 'all' ? 'unread' : 'all')}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500"
                    title={filterType === 'all' ? 'Show unread only' : 'Show all'}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={clearNotifications}
                    className="p-1 hover:bg-red-50 hover:text-red-600 rounded text-slate-500"
                    title="Mark all as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                {displayedNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-400">
                    No notifications to display
                  </div>
                ) : (
                  displayedNotifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 text-left hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors ${
                        !n.read ? 'bg-slate-50/70 border-l-2 border-brand-500' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 ${getNotifColor(n.type)}`}>
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <p className={`text-xs font-semibold text-slate-800 ${!n.read ? 'font-bold' : ''}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* View all footer */}
              <div className="px-4 py-2.5 border-t border-civic-border bg-slate-50 text-center">
                <span className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer">
                  See all alerts
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar / Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
            {userRole === 'admin' ? 'AD' : userRole === 'officer' ? 'FO' : 'CT'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-700 capitalize">{userRole}</p>
            <p className="text-[10px] text-slate-400">Departmental Staff</p>
          </div>
        </div>
      </div>
    </header>
  );
};
