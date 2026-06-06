import React, { useState } from 'react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useWater } from '../context/WaterContext';
import { Calendar, Download, TrendingUp, BarChart3, PieChart as PieIcon, LineChart as LineIcon, Layers } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { sources, complaints } = useWater();
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Regions list
  const regions = ['All', ...Array.from(new Set(sources.map(s => s.region)))];

  // 1. Water Levels Monthly Trend (Simulated)
  const monthlyLevelsData = [
    { month: 'Jan', Reservoirs: 880, Borewells: 240, Lakes: 380 },
    { month: 'Feb', Reservoirs: 850, Borewells: 235, Lakes: 375 },
    { month: 'Mar', Reservoirs: 810, Borewells: 210, Lakes: 350 },
    { month: 'Apr', Reservoirs: 780, Borewells: 195, Lakes: 310 },
    { month: 'May', Reservoirs: 860, Borewells: 250, Lakes: 360 },
    { month: 'Jun', Reservoirs: 920, Borewells: 280, Lakes: 410 }
  ];

  // 2. Consumption Analytics (Area-wise Usage)
  const consumptionData = [
    { area: 'Central Sector', Residential: 120, Commercial: 85, Municipal: 40 },
    { area: 'North District', Residential: 95, Commercial: 110, Municipal: 35 },
    { area: 'East Valley', Residential: 140, Commercial: 45, Municipal: 50 },
    { area: 'South Plains', Residential: 110, Commercial: 55, Municipal: 30 },
    { area: 'West Ridge', Residential: 80, Commercial: 35, Municipal: 25 }
  ];

  // 3. Complaint Analytics (Distribution by Category)
  const complaintsByCategory = complaints.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const complaintColors: Record<string, string> = {
    'Leakage': '#0d9488',
    'Contamination': '#dc2626',
    'No Water Supply': '#ea580c',
    'Low Pressure': '#eab308',
    'Infrastructure Damage': '#0284c7'
  };

  const complaintPieData = Object.keys(complaintsByCategory).map(key => ({
    name: key,
    value: complaintsByCategory[key],
    color: complaintColors[key] || '#64748b'
  }));

  // 4. Quality Trends over time
  const qualityTrendsData = [
    { date: '05/01', pH: 7.2, TDS: 190, Turbidity: 1.1 },
    { date: '05/08', pH: 7.1, TDS: 210, Turbidity: 1.2 },
    { date: '05/15', pH: 7.3, TDS: 205, Turbidity: 1.4 },
    { date: '05/22', pH: 7.4, TDS: 180, Turbidity: 0.9 },
    { date: '05/29', pH: 7.2, TDS: 195, Turbidity: 1.0 },
    { date: '06/05', pH: 7.3, TDS: 240, Turbidity: 2.1 }
  ];

  // 5. Capacity Utilization by Source
  const capacityUtilizationData = sources.map(s => ({
    name: s.name,
    Capacity: s.capacity,
    Level: s.currentLevel,
    Unused: s.capacity - s.currentLevel
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Analytics & Systems Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">
            Historic trends, usage mapping, and structural performance reports.
          </p>
        </div>
        
        {/* Quick action buttons */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 border border-slate-200 bg-white rounded p-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-600 font-semibold"
            >
              <option value="All">All Regions</option>
              {regions.filter(r => r !== 'All').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <button className="bg-slate-800 hover:bg-slate-900 text-white rounded p-1.5 font-semibold flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bento Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Water Levels Monthly Trend (Area Chart) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>Monthly Water Basin Levels</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Average storage capacity variations across natural & concrete basins</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyLevelsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReservoirs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLakes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} unit=" ML" />
                <Tooltip />
                <Legend iconSize={8} iconType="circle" />
                <Area type="monotone" dataKey="Reservoirs" stroke="#0f766e" fillOpacity={1} fill="url(#colorReservoirs)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="Lakes" stroke="#0284c7" fillOpacity={1} fill="url(#colorLakes)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Consumption Analytics (Bar Chart) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Regional Consumption Analytics</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Water demand distributions by district sector (Megaliters/day)</p>
            </div>
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="area" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} unit=" ML" />
                <Tooltip />
                <Legend iconSize={8} iconType="circle" />
                <Bar dataKey="Residential" fill="#0d9488" stackId="a" maxBarSize={30} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Commercial" fill="#38bdf8" stackId="a" maxBarSize={30} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Municipal" fill="#cbd5e1" stackId="a" maxBarSize={30} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Complaint Analytics by Category (Donut Chart) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-amber-600" />
                <span>Citizen Complaint Categories</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Incident ticket distributions logged by category type</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div className="h-48 relative flex items-center justify-center">
              {complaintPieData.length === 0 ? (
                <span className="text-xs text-slate-400">No active complaints</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complaintPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {complaintPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-left">
              {complaintPieData.map((entry, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-1.5 last:border-0">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full block shrink-0" style={{ backgroundColor: entry.color }}></span>
                    <span>{entry.name}</span>
                  </span>
                  <span className="font-bold text-slate-700">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Quality Trends Over Time (Line Chart) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                <LineIcon className="w-4 h-4 text-blue-600" />
                <span>Chemistry Parameter Deviations</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Average TDS and pH deviation index compared to safety norms</p>
            </div>
          </div>
          <div className="h-48 text-xs mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTrendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis yAxisId="ph" domain={[6.5, 7.8]} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis yAxisId="tds" orientation="right" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconSize={8} iconType="circle" />
                <Line yAxisId="ph" type="monotone" dataKey="pH" stroke="#0d9488" name="pH Value" strokeWidth={1.5} />
                <Line yAxisId="tds" type="monotone" dataKey="TDS" stroke="#ea580c" name="TDS Index" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Resource Capacity Utilization (Stacked/Grouped Bar Chart) - Span 2 Columns on desktop */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Station capacity Utilization</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Individual asset utilization rate showing current capacity vs vacant reserve space (Megaliters)</p>
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityUtilizationData} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tickLine={false} axisLine={false} unit=" ML" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tickLine={false} axisLine={false} width={120} />
                <Tooltip />
                <Legend iconSize={8} iconType="circle" />
                <Bar dataKey="Level" name="Current Water Level" fill="#0f766e" stackId="u" maxBarSize={15} />
                <Bar dataKey="Unused" name="Vacant Capacity" fill="#e2e8f0" stackId="u" maxBarSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
