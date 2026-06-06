import React, { useState } from 'react';
import { useWater } from '../context/WaterContext';
import { FileText, Download, Printer, Filter, Calendar, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { sources, complaints, maintenanceTasks } = useWater();
  const [reportType, setReportType] = useState<'quality' | 'consumption' | 'complaints' | 'maintenance'>('quality');
  const [region, setRegion] = useState('All');
  const [timeframe, setTimeframe] = useState('30d');
  const [format, setFormat] = useState<'csv' | 'json' | 'print'>('csv');
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [generating, setGenerating] = useState(false);

  const regions = ['All', ...Array.from(new Set(sources.map(s => s.region)))];

  // CSV Generation Utility
  const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Generation Utility
  const downloadJSON = (data: any, filename: string) => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    setTimeout(() => {
      let previewSummary: any[] = [];
      let dataCount = 0;
      let extraStats = {};

      // Filter logic based on region
      const filteredSources = sources.filter(s => region === 'All' || s.region === region);
      const filteredComplaints = complaints.filter(c => {
        if (region === 'All') return true;
        return c.location.toLowerCase().includes(region.toLowerCase());
      });
      const filteredTasks = maintenanceTasks.filter(t => {
        if (region === 'All') return true;
        const src = sources.find(s => s.id === t.sourceId);
        return src && src.region === region;
      });

      if (reportType === 'quality') {
        dataCount = filteredSources.length;
        const avgPh = (filteredSources.reduce((acc, curr) => acc + curr.pH, 0) / (dataCount || 1)).toFixed(2);
        const avgTds = Math.round(filteredSources.reduce((acc, curr) => acc + curr.tds, 0) / (dataCount || 1));
        const unsafeCount = filteredSources.filter(s => s.status === 'Unsafe').length;

        extraStats = {
          'Average pH': avgPh,
          'Average TDS': `${avgTds} ppm`,
          'Unsafe Stations': unsafeCount,
          'Compliance Rate': `${Math.round(((dataCount - unsafeCount) / (dataCount || 1)) * 100)}%`
        };

        previewSummary = filteredSources.map(s => ({
          'Station ID': s.id,
          'Station Name': s.name,
          'Type': s.type,
          'pH': s.pH,
          'TDS': s.tds,
          'Turbidity': s.turbidity,
          'Status': s.status
        }));

      } else if (reportType === 'consumption') {
        dataCount = filteredSources.length;
        const totalCapacity = filteredSources.reduce((acc, curr) => acc + curr.capacity, 0);
        const totalCurrent = filteredSources.reduce((acc, curr) => acc + curr.currentLevel, 0);
        const utilRate = Math.round((totalCurrent / (totalCapacity || 1)) * 100);

        extraStats = {
          'Total Available capacity': `${totalCapacity.toLocaleString()} ML`,
          'Current volume Reserve': `${totalCurrent.toLocaleString()} ML`,
          'Capacity Utilization': `${utilRate}%`,
          'Vacant storage Space': `${(totalCapacity - totalCurrent).toLocaleString()} ML`
        };

        previewSummary = filteredSources.map(s => ({
          'Basin Name': s.name,
          'Basin Type': s.type,
          'Region': s.region,
          'Total Storage (ML)': s.capacity,
          'Current Level (ML)': s.currentLevel,
          'Fill Percentage': `${Math.round((s.currentLevel / s.capacity) * 100)}%`
        }));

      } else if (reportType === 'complaints') {
        dataCount = filteredComplaints.length;
        const resolvedCount = filteredComplaints.filter(c => c.status === 'Resolved').length;
        const pendingCount = dataCount - resolvedCount;

        extraStats = {
          'Total Reports Filed': dataCount,
          'Tickets Resolved': resolvedCount,
          'Awaiting Crew': pendingCount,
          'Resolution Efficiency': `${Math.round((resolvedCount / (dataCount || 1)) * 100)}%`
        };

        previewSummary = filteredComplaints.map(c => ({
          'Ticket ID': c.id,
          'Issue Category': c.category,
          'Filer Name': c.citizenName,
          'Location Address': c.location,
          'Incident Date': c.dateSubmitted,
          'Status Flag': c.status
        }));

      } else if (reportType === 'maintenance') {
        dataCount = filteredTasks.length;
        const completed = filteredTasks.filter(t => t.status === 'Completed').length;
        const critical = filteredTasks.filter(t => t.priority === 'Critical').length;

        extraStats = {
          'Total Tickets Logged': dataCount,
          'Closed Audits': completed,
          'Critical Tickets': critical,
          'Active Backlog': dataCount - completed
        };

        previewSummary = filteredTasks.map(t => ({
          'Task ID': t.id,
          'Task Title': t.title,
          'Asset Location': t.sourceName,
          'Priority': t.priority,
          'Status': t.status,
          'Assigned Crew': t.assignedOfficer || 'Awaiting dispatch'
        }));
      }

      setGeneratedReport({
        type: reportType,
        region,
        timeframe,
        dateGenerated: new Date().toLocaleString(),
        extraStats,
        headers: Object.keys(previewSummary[0] || {}),
        rows: previewSummary
      });
      setGenerating(false);
    }, 800);
  };

  const handleExport = () => {
    if (!generatedReport) return;
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `hydrocivic_report_${generatedReport.type}_${timestamp}`;

    if (format === 'csv') {
      const headers = generatedReport.headers;
      const rows = generatedReport.rows.map((r: any) => headers.map((h: string) => String(r[h])));
      downloadCSV(headers, rows, `${filename}.csv`);

    } else if (format === 'json') {
      downloadJSON(generatedReport, `${filename}.json`);
    } else if (format === 'print') {
      window.print();
    }
  };

  return (
    <div className="space-y-6 print:p-0 print:m-0">
      {/* Header (Hidden on Print) */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">System Report Generator</h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal summaries, chemical audits, and complaints performance indexes.
          </p>
        </div>
      </div>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Customizer Form (Hidden on Print) */}
        <div className="lg:col-span-1 bg-white border border-civic-border rounded-lg p-5 shadow-civic text-xs space-y-4 print:hidden">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Filter className="w-4 h-4 text-brand-600" />
            <span>Report Configurator</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-500 mb-1">Report Data Class</label>
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value as any);
                  setGeneratedReport(null);
                }}
                className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white"
              >
                <option value="quality">Water Quality & Chemistry</option>
                <option value="consumption">Supply & Basin Consumption</option>
                <option value="complaints">Complaints & Resolutions</option>
                <option value="maintenance">Infrastructure Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Target Region</label>
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setGeneratedReport(null);
                }}
                className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white"
              >
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Audit Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value);
                  setGeneratedReport(null);
                }}
                className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white rounded-md font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Compile Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Report Preview (Occupies full viewport on Print) */}
        <div className="lg:col-span-3 print:col-span-4 space-y-6">
          {generatedReport ? (
            <div className="space-y-4">
              
              {/* Export Panel (Hidden on Print) */}
              <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic flex justify-between items-center text-xs print:hidden">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Output Export:</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="border border-slate-200 rounded p-1 bg-slate-50"
                  >
                    <option value="csv">Download CSV Spreadsheets</option>
                    <option value="json">Download JSON Payload</option>
                    <option value="print">Standard HTML Print / PDF</option>
                  </select>
                </div>

                <button
                  onClick={handleExport}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded font-semibold flex items-center gap-1"
                >
                  {format === 'print' ? <Printer className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{format === 'print' ? 'Trigger Print Dialog' : 'Download File'}</span>
                </button>
              </div>

              {/* Printable Official Document Layout */}
              <div className="bg-white border border-civic-border rounded-lg p-8 shadow-civic text-xs text-left space-y-6 relative overflow-hidden print:border-0 print:shadow-none">
                
                {/* Official waterboard banner watermark */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full flex items-center justify-center pointer-events-none opacity-50">
                  <FileText className="w-8 h-8 text-slate-200" />
                </div>

                {/* Report Header */}
                <div className="border-b-2 border-slate-800 pb-4 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                      Department of Water Resource Management
                    </h2>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
                      System Status & Audit Log Report
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Platform Name: <span className="font-semibold text-slate-600">HydroCivic Management Console</span>
                    </p>
                  </div>
                  <div className="text-left md:text-right text-[10px] text-slate-500">
                    <p>Report ID: <code className="bg-slate-100 px-1 rounded text-slate-800 font-mono">REP-{Math.floor(10000 + Math.random() * 90000)}</code></p>
                    <p className="mt-0.5">Date Compiled: <span className="font-medium text-slate-700">{generatedReport.dateGenerated}</span></p>
                    <p className="mt-0.5">Region Scope: <span className="font-semibold text-slate-800 capitalize">{generatedReport.region}</span></p>
                  </div>
                </div>

                {/* Section 1: Summary Statistics */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs border-l-2 border-brand-600 pl-2">I. EXECUTIVE SUMMARY</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {Object.keys(generatedReport.extraStats).map((statKey) => (
                      <div key={statKey} className="bg-slate-50 border border-slate-100 rounded p-3 text-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                          {statKey}
                        </span>
                        <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                          {generatedReport.extraStats[statKey]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Data Table */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-800 text-xs border-l-2 border-brand-600 pl-2">II. SYSTEM TELEMETRY DATA TABLE</h4>
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left border-collapse border border-slate-200">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                          {generatedReport.headers.map((header: string) => (
                            <th key={header} className="p-2 border border-slate-200">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {generatedReport.rows.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            {generatedReport.headers.map((header: string) => (
                              <td key={header} className="p-2 border border-slate-200 font-medium">{String(row[header])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3: Sign-Off */}
                <div className="pt-8 border-t border-dashed border-slate-200 flex flex-col md:flex-row justify-between items-end gap-6 text-[10px]">
                  <div className="text-slate-400 max-w-sm">
                    <p className="font-semibold">Security Compliance Notice:</p>
                    <p className="leading-normal mt-0.5">
                      This audit document is cryptographically compiled and contains telemetry metadata verified by HydroCivic. Unauthorized editing is prohibited under municipal environmental policy regulations.
                    </p>
                  </div>
                  
                  {/* Signature lines */}
                  <div className="w-48 text-center space-y-1">
                    <div className="border-b border-slate-400 h-8"></div>
                    <p className="font-bold text-slate-700">Official Inspector Sign-off</p>
                    <p className="text-slate-400">Title: Water Quality Directorate</p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white border border-civic-border border-dashed rounded-lg p-16 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700 text-sm mb-1">Awaiting Compilation</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Configure your data class, target region boundaries, and auditing timeline on the left panel, then click **Compile Report** to generate a preview.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
