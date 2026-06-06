import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplet, 
  Activity, 
  Wrench, 
  MessageSquare, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useWater } from '../context/WaterContext';

export const LandingPage: React.FC = () => {
  const { sources, complaints, maintenanceTasks } = useWater();

  // Computations for stats section
  const totalSources = sources.length;
  const totalCapacity = sources.reduce((acc, curr) => acc + curr.capacity, 0);
  const safePercentage = Math.round(
    (sources.filter(s => s.status === 'Safe').length / totalSources) * 100
  );
  const activeMaintenanceCount = maintenanceTasks.filter(t => t.status !== 'Completed').length;

  const features = [
    {
      title: 'Water Monitoring',
      description: 'Real-time telemetry tracking water levels, reservoir status, and regional supply levels.',
      icon: Droplet,
      color: 'text-brand-600 bg-brand-50 border-brand-100',
    },
    {
      title: 'Quality Analysis',
      description: 'Continuous sampling logs tracking pH, TDS, turbidity, and dissolved oxygen metrics.',
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Infrastructure Management',
      description: 'Track equipment wear, logs failure tickets, and plan preventative maintenance schedules.',
      icon: Wrench,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Citizen Complaints',
      description: 'Enable residents to report leakages, supply outages, or pressure drop issues directly.',
      icon: MessageSquare,
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },
    {
      title: 'Predictive Analytics',
      description: 'Model reservoir depletion patterns and quality trend analysis based on historic sensor feeds.',
      icon: TrendingUp,
      color: 'text-slate-600 bg-slate-100 border-slate-200',
    },
  ];

  return (
    <div className="bg-civic-bg min-h-screen flex flex-col justify-between">
      {/* Public Top Navbar */}
      <header className="border-b border-civic-border bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-brand-600 flex items-center justify-center">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">
            Hydro<span className="text-brand-600">Civic</span>
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/map" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
            Water Map
          </Link>
          <Link to="/complaints" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
            Report Issue
          </Link>
          <Link 
            to="/login" 
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 px-3.5 py-1.5 rounded-md hover:bg-brand-50/50 transition-colors"
          >
            Portal Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 border border-brand-100 text-brand-700 mb-6 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          Departmental Infrastructure Portal
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight max-w-3xl mx-auto leading-none mb-6">
          Smart Water Resource Management
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
          Monitor water resources, track quality, manage infrastructure, and improve sustainability through centralized, government-verified data feeds.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            to="/dashboard" 
            className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md shadow-civic hover:shadow-civic-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            to="/map" 
            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-medium rounded-md hover:bg-slate-50/50 transition-all flex items-center justify-center gap-2"
          >
            <span>View Water Status</span>
          </Link>
        </div>
      </section>

      {/* Statistics Layout */}
      <section className="bg-white border-y border-civic-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
            Current Regional Metrics Overview
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center md:text-left md:border-r border-slate-100 last:border-0 p-4">
              <span className="block text-2xl md:text-3xl font-bold text-slate-800">{totalSources}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-1 block">
                Total Water Sources
              </span>
            </div>
            <div className="text-center md:text-left md:border-r border-slate-100 last:border-0 p-4">
              <span className="block text-2xl md:text-3xl font-bold text-slate-800">{totalCapacity.toLocaleString()} ML</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-1 block">
                Reservoir Capacity
              </span>
            </div>
            <div className="text-center md:text-left md:border-r border-slate-100 last:border-0 p-4">
              <span className="block text-2xl md:text-3xl font-bold text-slate-800">{safePercentage}%</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-1 block">
                Safe Water Sources
              </span>
            </div>
            <div className="text-center md:text-left p-4">
              <span className="block text-2xl md:text-3xl font-bold text-slate-800">{activeMaintenanceCount}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-1 block">
                Active Maintenance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards Grid */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-2">
            Engineered for Municipal Resilience
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            A secure command structure built for technicians, data analysts, and local public officials.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-civic-border rounded-lg p-6 hover:shadow-civic-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 rounded-md border flex items-center justify-center mb-4 ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800 text-base mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Government Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Building className="w-5 h-5 text-brand-400" />
              <span className="font-bold tracking-tight text-base">HydroCivic Platform</span>
            </div>
            <p className="text-xs text-slate-500 leading-normal">
              Official portal of the Water Supply and Wastewater Management Directorate. Optimized for local governance compliance.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/map" className="hover:text-white transition-colors">GIS Live Dashboard</Link></li>
              <li><Link to="/complaints" className="hover:text-white transition-colors">Citizen Report Form</Link></li>
              <li><span className="text-slate-600">Water Quality Standard Regulations (2026)</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Security & Role Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white transition-colors">Officer Log In</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">System Admin Console</Link></li>
              <li><span className="text-slate-600">Supabase API Encryption</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Support Contacts</h4>
            <p className="text-xs text-slate-500 leading-normal mb-1">
              Water Board Central Hotline:
            </p>
            <p className="text-xs text-slate-300 font-semibold mb-2">
              1-800-555-WATER
            </p>
            <p className="text-xs text-slate-500 leading-normal">
              Technical: admin@hydrocivic.gov
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <span>&copy; 2026 Department of Water Resource Management & Civic Tech. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>&middot;</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
