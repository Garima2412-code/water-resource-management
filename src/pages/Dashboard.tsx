import React from 'react';
import { useWater } from '../context/WaterContext';
import { 
  Droplets, 
  AlertTriangle, 
  Wrench, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { sources, complaints, maintenanceTasks, notifications } = useWater();

  // Stats Calculations
  const totalSources = sources.length;
  const activeReservoirs = sources.filter(s => s.type === 'Reservoir').length;
  
  // Low water alerts (level < 40% of capacity)
  const lowWaterSources = sources.filter(s => (s.currentLevel / s.capacity) < 0.4);
  const lowWaterAlertsCount = lowWaterSources.length;
  
  const unsafeSourcesCount = sources.filter(s => s.status === 'Unsafe').length;
  const openComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;
  const pendingTasksCount = maintenanceTasks.filter(t => t.status !== 'Completed').length;

  // Recharts: Reservoir levels comparison
  const reservoirData = sources.map(s => ({
    name: s.name,
    Level: s.currentLevel,
    Capacity: s.capacity,
    Percentage: Math.round((s.currentLevel / s.capacity) * 100)
  }));

  // Recharts: Water Quality Pie Chart
  const safeCount = sources.filter(s => s.status === 'Safe').length;
  const moderateCount = sources.filter(s => s.status === 'Moderate').length;
  const unsafeCount = sources.filter(s => s.status === 'Unsafe').length;

  const qualityPieData = [
    { name: 'Safe', value: safeCount, color: '#15803d' }, // Soft green
    { name: 'Moderate', value: moderateCount, color: '#b45309' }, // Soft orange
    { name: 'Unsafe', value: unsafeCount, color: '#b91c1c' } // Soft red
  ].filter(item => item.value > 0);

  // Active Alert logs
  const activeAlertLogs = notifications.filter(n => !n.read).slice(0, 4);

  // Recent activity simulation (using complaints + maintenance)
  const recentActivities = [
    ...complaints.map(c => ({
      id: c.id,
      type: 'complaint',
      title: `Complaint Filed: ${c.category}`,
      description: `Reported at ${c.location} by ${c.citizenName}`,
      date: c.dateSubmitted,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-100'
    })),
    ...maintenanceTasks.map(t => ({
      id: t.id,
      type: 'maintenance',
      title: `Task Logged: ${t.title}`,
      description: `Assigned to ${t.assignedOfficer || 'Unassigned'} at ${t.sourceName}`,
      date: t.dateCreated,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100'
    }))
  ]
  .sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    return dateB.localeCompare(dateA);
  })
  .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Command Center Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized telemetry monitoring and infrastructure administration overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to="/map" 
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Open Live GIS Map
          </Link>
          <Link 
            to="/sources" 
            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-xs font-semibold transition-colors"
          >
            Manage Sources
          </Link>
        </div>
      </div>

      {/* Grid: Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Sources */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sources</span>
            <Droplets className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-800 mt-2">{totalSources}</p>
          <span className="text-[10px] text-slate-400 block mt-1">All active stations</span>
        </div>

        {/* Active Reservoirs */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reservoirs</span>
            <Droplets className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xl font-bold text-slate-800 mt-2">{activeReservoirs}</p>
          <span className="text-[10px] text-slate-400 block mt-1">Major supply basins</span>
        </div>

        {/* Low Water Alerts */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Water</span>
            <AlertTriangle className={`w-4 h-4 ${lowWaterAlertsCount > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <p className="text-xl font-bold text-slate-800 mt-2">{lowWaterAlertsCount}</p>
          <span className={`text-[10px] block mt-1 font-medium ${lowWaterAlertsCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
            Level &lt; 40% capacity
          </span>
        </div>

        {/* Unsafe Sources */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unsafe Quality</span>
            <AlertTriangle className={`w-4 h-4 ${unsafeSourcesCount > 0 ? 'text-red-500' : 'text-slate-400'}`} />
          </div>
          <p className="text-xl font-bold text-slate-800 mt-2">{unsafeSourcesCount}</p>
          <span className={`text-[10px] block mt-1 font-medium ${unsafeSourcesCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
            Failed standards
          </span>
        </div>

        {/* Open Complaints */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Complaints</span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-800 mt-2">{openComplaintsCount}</p>
          <span className="text-[10px] text-slate-400 block mt-1">Pending resolution</span>
        </div>

        {/* Maintenance Tasks */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Maintenance</span>
            <Wrench className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-800 mt-2">{pendingTasksCount}</p>
          <span className="text-[10px] text-slate-400 block mt-1">Active tickets</span>
        </div>
      </div>

      {/* Grid: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservoir Overview (2 Cols) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Water Levels & Capacity</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Comparing current storage level vs maximum capacity (Megaliters)</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reservoirData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} unit=" ML" />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded p-2.5 shadow-sm text-xs text-slate-700">
                          <p className="font-bold text-slate-800">{data.name}</p>
                          <p className="mt-1">Current Level: <strong className="text-brand-600">{data.Level} ML</strong></p>
                          <p>Total Capacity: <strong className="text-slate-800">{data.Capacity} ML</strong></p>
                          <p>Utilization: <strong className="text-slate-600">{data.Percentage}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="Level" name="Current Level" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Capacity" name="Total Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Snapshot (1 Col) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Water Quality Snapshot</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Breakdown of sources meeting safety criteria</p>
          </div>
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {qualityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Sources`, 'Total']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="block text-2xl font-bold text-slate-800">{safeCount}</span>
              <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-wider">Safe Stations</span>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block shrink-0"></span>
                <span>Safe Water Sources</span>
              </span>
              <span className="font-bold text-slate-800">{safeCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block shrink-0"></span>
                <span>Moderate Warning</span>
              </span>
              <span className="font-bold text-slate-800">{moderateCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 block shrink-0"></span>
                <span>Unsafe (Action Required)</span>
              </span>
              <span className="font-bold text-slate-800">{unsafeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Alert Panel & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Panel */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Critical Warning System</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Real-time alert warnings requiring operator attention</p>
            </div>
            <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 border border-red-100 rounded-full font-bold">
              SYSTEM ALERTS
            </span>
          </div>

          <div className="space-y-3">
            {activeAlertLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No outstanding alerts. System operational.
              </div>
            ) : (
              activeAlertLogs.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border text-left flex gap-3 ${
                    alert.type === 'quality_warning' 
                      ? 'bg-red-50/50 border-red-100/80 text-red-900' 
                      : alert.type === 'low_water' 
                        ? 'bg-amber-50/50 border-amber-100/80 text-amber-900' 
                        : 'bg-blue-50/50 border-blue-100/80 text-blue-900'
                  }`}
                >
                  <div className="mt-0.5">
                    <AlertTriangle className={`w-4 h-4 shrink-0 ${
                      alert.type === 'quality_warning' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold">{alert.title}</span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(alert.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal mt-0.5">
                      {alert.message}
                    </p>
                    {alert.sourceId && (
                      <Link 
                        to={`/sources`}
                        className="text-[10px] font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-0.5 mt-1"
                      >
                        <span>Inspect Station</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Administrative Activity</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Chronological feed of infrastructure logs and reports</p>
          </div>

          <div className="relative border-l border-slate-100 pl-4 space-y-5 py-2">
            {recentActivities.map((act) => (
              <div key={act.id} className="relative text-left">
                {/* Circle timeline indicator */}
                <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-300 ring-4 ring-white"></span>
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{act.title}</span>
                    <span className="text-[9px] text-slate-400">{act.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
