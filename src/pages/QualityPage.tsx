import React from 'react';
import { useWater } from '../context/WaterContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QualityPage: React.FC = () => {
  const { sources } = useWater();

  // Computations
  const totalSourcesCount = sources.length;
  const unsafeCount = sources.filter(s => s.status === 'Unsafe').length;
  const safeCount = sources.filter(s => s.status === 'Safe').length;
  
  const averagePH = (sources.reduce((acc, curr) => acc + curr.pH, 0) / totalSourcesCount).toFixed(2);
  const averageTDS = Math.round(sources.reduce((acc, curr) => acc + curr.tds, 0) / totalSourcesCount);
  const totalSamplesCount = totalSourcesCount * 4; // Mocking 4 samples per source collected this cycle

  // Trend analysis (simulating monthly parameters change over 6 months)
  const qualityTrendsData = [
    { month: 'Jan', pH: 7.2, TDS: 230, Turbidity: 2.1 },
    { month: 'Feb', pH: 7.3, TDS: 240, Turbidity: 1.9 },
    { month: 'Mar', pH: 7.1, TDS: 255, Turbidity: 2.3 },
    { month: 'Apr', pH: 7.2, TDS: 220, Turbidity: 1.8 },
    { month: 'May', pH: 7.4, TDS: 215, Turbidity: 1.5 },
    { month: 'Jun', pH: 7.3, TDS: 260, Turbidity: 2.4 } // Mock active month
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Water Quality Registry</h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed chemical tracking, TDS counts, and sensor safety validation.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average pH */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average pH</span>
          <p className="text-xl font-bold text-slate-800 mt-1 flex items-baseline gap-1">
            <span>{averagePH}</span>
            <span className="text-xs font-normal text-slate-400">pH</span>
          </p>
          <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">Target: 6.5 - 8.5</span>
        </div>

        {/* Average TDS */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average TDS</span>
          <p className="text-xl font-bold text-slate-800 mt-1 flex items-baseline gap-1">
            <span>{averageTDS}</span>
            <span className="text-xs font-normal text-slate-400">ppm</span>
          </p>
          <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">Target: &lt; 500 ppm</span>
        </div>

        {/* Unsafe Sources */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Unsafe Sources</span>
          <p className="text-xl font-bold text-red-600 mt-1">
            {unsafeCount}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Requiring immediate action</span>
        </div>

        {/* Samples Collected */}
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Samples Collected</span>
          <p className="text-xl font-bold text-slate-800 mt-1">
            {totalSamplesCount}
          </p>
          <span className="text-[10px] text-brand-600 block mt-1 font-semibold">Active Sampling Cycle</span>
        </div>
      </div>

      {/* Grid: Quality Table & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View (2 Cols) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Active Station Water Chemistry</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Physical and chemical values from latest telemetry sync</p>
            </div>
            <button className="text-[10px] border border-slate-200 rounded px-2.5 py-1 text-slate-500 font-semibold hover:bg-slate-50 flex items-center gap-1">
              <FileSpreadsheet className="w-3 h-3" />
              <span>Export Report</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-civic-border text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Source Name</th>
                  <th className="py-2.5 px-3 text-center">pH</th>
                  <th className="py-2.5 px-3 text-right">TDS (ppm)</th>
                  <th className="py-2.5 px-3 text-right">Turbidity (NTU)</th>
                  <th className="py-2.5 px-3 text-right">Dissolved Oxygen (mg/L)</th>
                  <th className="py-2.5 px-3 text-center">Quality Status</th>
                  <th className="py-2.5 px-3">Sample Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sources.map((source) => (
                  <tr key={source.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      <Link to={`/sources/${source.id}`} className="hover:text-brand-600">
                        {source.name}
                      </Link>
                    </td>
                    <td className={`py-2.5 px-3 text-center font-bold ${
                      source.pH < 6.5 || source.pH > 8.5 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {source.pH}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-medium ${
                      source.tds > 500 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {source.tds}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-medium ${
                      source.turbidity > 5 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {source.turbidity}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-medium ${
                      source.dissolvedOxygen < 5.0 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {source.dissolvedOxygen}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                        source.status === 'Safe' 
                          ? 'bg-status-safe-bg text-status-safe-text border-status-safe-border' 
                          : source.status === 'Moderate'
                            ? 'bg-status-warning-bg text-status-warning-text border-status-warning-border'
                            : 'bg-status-danger-bg text-status-danger-text border-status-danger-border'
                      }`}>
                        {source.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-medium">{source.lastInspection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trend Analysis (1 Col) */}
        <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">6-Month Parameter Trends</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Average monthly chemical changes across all stations</p>
          </div>

          <div className="h-56 text-xs mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTrendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis yAxisId="ph" domain={[6.0, 8.0]} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis yAxisId="tds" orientation="right" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconSize={8} iconType="circle" />
                <Line yAxisId="ph" type="monotone" dataKey="pH" stroke="#0f766e" name="pH" strokeWidth={1.5} activeDot={{ r: 4 }} />
                <Line yAxisId="tds" type="monotone" dataKey="TDS" stroke="#b45309" name="TDS (ppm)" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-4 text-left">
            <div className="flex gap-2 text-slate-600">
              <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Quality Standard Notice:</strong> Chemical monitoring follows WHO Water Safety standards. Anomalies trigger emergency alerts to local treatment plants instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
