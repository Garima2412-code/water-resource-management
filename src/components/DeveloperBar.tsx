import React from 'react';
import { useWater } from '../context/WaterContext';
import { Shield, Hammer, Users, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DeveloperBar: React.FC = () => {
  const { userRole, setUserRole } = useWater();
  const navigate = useNavigate();

  const handleRoleChange = (role: 'citizen' | 'officer' | 'admin') => {
    setUserRole(role);
    // Redirect citizens to map/complaints if they are on dashboard/sources which is restricted
    if (role === 'citizen') {
      navigate('/complaints');
    } else {
      navigate('/dashboard');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all mock data to defaults? This will clear all submitted complaints, added sources, and tasks.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg z-50 text-xs border border-slate-700/50 backdrop-blur-sm bg-opacity-90">
      <span className="font-semibold text-slate-400 border-r border-slate-700 pr-3">Dev Sandbox</span>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleRoleChange('citizen')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
            userRole === 'citizen'
              ? 'bg-emerald-600 text-white shadow'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Citizen</span>
        </button>

        <button
          onClick={() => handleRoleChange('officer')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
            userRole === 'officer'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Hammer className="w-3.5 h-3.5" />
          <span>Officer</span>
        </button>

        <button
          onClick={() => handleRoleChange('admin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
            userRole === 'admin'
              ? 'bg-teal-600 text-white shadow'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>

      <button
        onClick={handleReset}
        className="ml-2 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition-colors border-l border-slate-700 pl-3"
        title="Reset all data to default"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
