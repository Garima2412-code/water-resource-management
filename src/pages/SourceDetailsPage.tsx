import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWater } from '../context/WaterContext';
import { 
  ArrowLeft, 
  Droplet, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Wrench, 
  CheckCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SourceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sources, maintenanceTasks } = useWater();

  // Find the current source
  const source = sources.find(s => s.id === id);

  // Filter maintenance tasks for this source
  const sourceMaintenance = maintenanceTasks.filter(t => t.sourceId === id);

  // Generate 30-day level history data dynamically
  const levelHistoryData = useMemo(() => {
    if (!source) return [];
    
    const data = [];
    const baseLevel = source.currentLevel;
    const capacity = source.capacity;
    
    // Create dates going back 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Calculate a realistic level fluctuation (walk)
      // e.g. sinus fluctuation + small random
      const dayFactor = Math.sin(i * 0.2) * 0.05; // 5% fluctuation
      const noise = (Math.random() - 0.5) * 0.02; // 2% noise
      let level = Math.round(baseLevel * (1 + dayFactor + noise));
      
      // Bound level between 10% and capacity
      level = Math.max(Math.round(capacity * 0.1), Math.min(level, capacity));

      data.push({
        date: dateStr,
        Level: level,
        Capacity: capacity,
        Percentage: Math.round((level / capacity) * 100)
      });
    }
    return data;
  }, [source]);

  if (!source) {
    return (
      <div className="text-center py-16 bg-white border border-civic-border rounded-lg max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800">Water Source Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The specified station ID does not exist in the municipal inventory.</p>
        <Link 
          to="/sources"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-xs font-semibold transition-colors"
        >
          Back to Inventory
        </Link>
      </div>
    );
  }

  // Quality threshold configurations
  const pHConfig = {
    value: source.pH,
    min: 6.5,
    max: 8.5,
    unit: '',
    status: source.pH >= 6.5 && source.pH <= 8.5 ? 'Safe' : 'Danger',
    label: 'pH Level'
  };

  const tdsConfig = {
    value: source.tds,
    min: 0,
    max: 500,
    unit: ' ppm',
    status: source.tds <= 500 ? 'Safe' : source.tds <= 650 ? 'Moderate' : 'Danger',
    label: 'Total Dissolved Solids'
  };

  const turbidityConfig = {
    value: source.turbidity,
    min: 0,
    max: 5,
    unit: ' NTU',
    status: source.turbidity <= 5 ? 'Safe' : source.turbidity <= 10 ? 'Moderate' : 'Danger',
    label: 'Turbidity'
  };

  const doConfig = {
    value: source.dissolvedOxygen,
    min: 5.0,
    max: 15.0,
    unit: ' mg/L',
    status: source.dissolvedOxygen >= 5.0 ? 'Safe' : 'Danger',
    label: 'Dissolved Oxygen'
  };

  const getCardStatusStyle = (status: string) => {
    switch (status) {
      case 'Safe': return 'border-status-safe-border bg-status-safe-bg/30 text-status-safe-text';
      case 'Moderate': return 'border-status-warning-border bg-status-warning-bg/30 text-status-warning-text';
      default: return 'border-status-danger-border bg-status-danger-bg/30 text-status-danger-text';
    }
  };

  // Static mock inspection timeline
  const inspectionTimeline = [
    { date: source.lastInspection, title: 'Compliance Audited', inspector: 'Senior Quality Inspector Collins', outcome: `Passed standards. Overall status marked: ${source.status}` },
    { date: '2026-04-10', title: 'Routine Sensor Calibration', inspector: 'Field Engineer Martinez', outcome: 'pH and TDS telemetry sensors calibrated to master standard.' },
    { date: '2026-03-05', title: 'Annual Structural Inspection', inspector: 'Structural Engineer Robinson', outcome: 'Concrete basin, piping joints, and flow gates inspected. Found intact.' }
  ];

  return (
    <div className="space-y-6">
      {/* Back navigation & Action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={() => navigate('/sources')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </button>
        <div className="text-xs text-slate-400 font-medium">
          Source ID: <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{source.id}</code>
        </div>
      </div>

      {/* Main station stats layout */}
      <div className="bg-white border border-civic-border rounded-lg p-6 shadow-civic">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
              <Droplet className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{source.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  source.status === 'Safe' 
                    ? 'bg-status-safe-bg text-status-safe-text border-status-safe-border' 
                    : source.status === 'Moderate'
                      ? 'bg-status-warning-bg text-status-warning-text border-status-warning-border'
                      : 'bg-status-danger-bg text-status-danger-text border-status-danger-border'
                }`}>
                  {source.status}
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-slate-200">
                  {source.type}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{source.region} District System</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 text-xs border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
            <div>
              <span className="text-slate-400 block font-medium">Capacity</span>
              <span className="text-base font-bold text-slate-800 mt-0.5 block">{source.capacity.toLocaleString()} ML</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Current Level</span>
              <span className="text-base font-bold text-slate-800 mt-0.5 block">{source.currentLevel.toLocaleString()} ML</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Fill Percentage</span>
              <span className="text-base font-bold text-slate-800 mt-0.5 block">
                {Math.round((source.currentLevel / source.capacity) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Charts & Chemistry Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Area Chart Level History (2 Cols) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">30-Day Level History</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Historical telemetry tracker reflecting basin capacity fluctuation</p>
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={levelHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} unit=" ML" />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded p-2.5 shadow-sm text-xs text-slate-700">
                          <p className="font-bold text-slate-800">{data.date}</p>
                          <p className="mt-1">Level: <strong className="text-brand-600">{data.Level} ML</strong></p>
                          <p>Fill Rate: <strong className="text-slate-600">{data.Percentage}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="Level" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#levelGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Chemistry Metrics (1 Col) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Water Chemistry Sensors</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Immediate sensor feeds compared to safety thresholds</p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {[pHConfig, tdsConfig, turbidityConfig, doConfig].map((item, idx) => (
              <div 
                key={idx} 
                className={`p-3 border rounded-lg flex flex-col justify-between transition-colors ${getCardStatusStyle(item.status)}`}
              >
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider block opacity-75">{item.label}</span>
                  <span className="text-base font-bold mt-1 block">
                    {item.value}
                    <span className="text-xs font-normal opacity-80">{item.unit}</span>
                  </span>
                </div>
                <div className="text-[9px] mt-2 flex items-center justify-between opacity-85">
                  <span>Target: {item.min !== 0 ? `${item.min}-` : '< '}{item.max}</span>
                  <span className="font-bold">{item.status === 'Safe' ? 'OK' : 'FAIL'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Inspections Timeline & Maintenance logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection History (1 Col) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Inspection History</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Audit log of engineer visits and checks</p>
          </div>

          <div className="relative border-l border-slate-100 pl-4 space-y-5 py-2 text-xs text-left">
            {inspectionTimeline.map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-300 ring-4 ring-white"></span>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{item.title}</span>
                    <span className="text-[9px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.inspector}</p>
                  <p className="text-slate-500 mt-1 leading-normal text-[11px]">{item.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Records (2 Cols) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Station Maintenance History</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Maintenance logs and tasks associated with this asset</p>
            </div>
            <Link 
              to="/maintenance"
              className="text-[10px] font-bold text-brand-600 hover:text-brand-700"
            >
              Go to Module
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-civic-border text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Task Title</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Assigned To</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Logged Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {sourceMaintenance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No active or past maintenance tickets on file.
                    </td>
                  </tr>
                ) : (
                  sourceMaintenance.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{task.title}</td>
                      <td className="py-2.5 px-3">{task.type}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          task.priority === 'Critical' ? 'bg-red-50 text-red-700 border border-red-100' :
                          task.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          task.priority === 'Medium' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{task.assignedOfficer || 'Unassigned'}</td>
                      <td className="py-2.5 px-3">
                        <span className="flex items-center gap-1 font-medium">
                          {task.status === 'Completed' ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Completed</span>
                            </>
                          ) : task.status === 'Ongoing' ? (
                            <>
                              <Activity className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-blue-700">Ongoing</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-slate-500">Pending</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-400">{task.dateCreated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
