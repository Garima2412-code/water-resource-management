import React, { useState } from 'react';
import { useWater } from '../context/WaterContext';
import { WaterSource } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  X, 
  Droplet, 
  MapPin,
  ChevronRight,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const SourcesPage: React.FC = () => {
  const { sources, addWaterSource, updateWaterSource, archiveWaterSource } = useWater();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Drawer Form State
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState<WaterSource['type']>('Reservoir');
  const [region, setRegion] = useState('Central Sector');
  const [capacity, setCapacity] = useState<number>(500);
  const [currentLevel, setCurrentLevel] = useState<number>(350);
  const [pH, setPh] = useState<number>(7.2);
  const [tds, setTds] = useState<number>(180);
  const [turbidity, setTurbidity] = useState<number>(1.2);
  const [dissolvedOxygen, setDissolvedOxygen] = useState<number>(8.0);

  // List unique regions for filtering
  const regions = ['All', ...Array.from(new Set(sources.map(s => s.region)))];
  const sourceTypes = ['All', 'Reservoir', 'Lake', 'Borewell', 'Dam', 'Treatment Plant'];
  const statusOptions = ['All', 'Safe', 'Moderate', 'Unsafe'];

  // Handle Edit Action - Populate Form & Open Drawer
  const handleEditClick = (source: WaterSource) => {
    setEditingSourceId(source.id);
    setName(source.name);
    setType(source.type);
    setRegion(source.region);
    setCapacity(source.capacity);
    setCurrentLevel(source.currentLevel);
    setPh(source.pH);
    setTds(source.tds);
    setTurbidity(source.turbidity);
    setDissolvedOxygen(source.dissolvedOxygen);
    setShowDrawer(true);
  };

  const handleCreateClick = () => {
    setEditingSourceId(null);
    setName('');
    setType('Reservoir');
    setRegion('Central Sector');
    setCapacity(500);
    setCurrentLevel(350);
    setPh(7.2);
    setTds(180);
    setTurbidity(1.0);
    setDissolvedOxygen(8.0);
    setShowDrawer(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || capacity <= 0 || currentLevel < 0) return;

    const sourceData = {
      name,
      type,
      region,
      capacity,
      currentLevel,
      lastInspection: new Date().toISOString().split('T')[0],
      pH,
      tds,
      turbidity,
      dissolvedOxygen,
      coordinates: editingSourceId 
        ? sources.find(s => s.id === editingSourceId)?.coordinates || { x: 50, y: 50, lat: -1.29, lng: 36.8 }
        : { x: Math.floor(15 + Math.random() * 70), y: Math.floor(15 + Math.random() * 70), lat: -1.29 + (Math.random() - 0.5) * 0.1, lng: 36.8 + (Math.random() - 0.5) * 0.1 }
    };

    if (editingSourceId) {
      updateWaterSource(editingSourceId, sourceData);
    } else {
      addWaterSource(sourceData);
    }
    
    setShowDrawer(false);
  };

  const handleArchive = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to archive the water source "${name}"? This removes it from active tracking.`)) {
      archiveWaterSource(id);
    }
  };

  // Filter logic
  const filteredSources = sources.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || s.type === selectedType;
    const matchesRegion = selectedRegion === 'All' || s.region === selectedRegion;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesRegion && matchesStatus;
  });

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Water Resource Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered monitoring stations, reservoirs, and natural regional basins.
          </p>
        </div>
        <button 
          onClick={handleCreateClick}
          className="bg-brand-600 hover:bg-brand-700 text-white rounded-md px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Water Source</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search by source name or region..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-md focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Filter selectors */}
        <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-3 text-xs">
          {/* Source Type Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-1.5">
            <span className="text-slate-400 font-medium whitespace-nowrap">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-slate-200 rounded-md p-1.5 bg-slate-50 hover:bg-white focus:bg-white"
            >
              {sourceTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-1.5">
            <span className="text-slate-400 font-medium whitespace-nowrap">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-slate-200 rounded-md p-1.5 bg-slate-50 hover:bg-white focus:bg-white"
            >
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-1.5">
            <span className="text-slate-400 font-medium whitespace-nowrap">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-200 rounded-md p-1.5 bg-slate-50 hover:bg-white focus:bg-white"
            >
              {statusOptions.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Results Table */}
      <div className="bg-white border border-civic-border rounded-lg shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-civic-border text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Source Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Region</th>
                <th className="py-3.5 px-4 text-right">Capacity (ML)</th>
                <th className="py-3.5 px-4 text-right">Level (ML)</th>
                <th className="py-3.5 px-4 text-center">Fill Rate</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Last Inspection</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSources.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No water sources match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSources.map((source) => {
                  const fillPercentage = Math.round((source.currentLevel / source.capacity) * 100);
                  
                  return (
                    <tr key={source.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <Link to={`/sources/${source.id}`} className="hover:text-brand-600 flex items-center gap-1.5">
                          <Droplet className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                          <span>{source.name}</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">{source.type}</td>
                      <td className="py-3.5 px-4 flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{source.region}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium">{source.capacity.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-medium">{source.currentLevel.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 max-w-[120px] mx-auto">
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                fillPercentage < 40 
                                  ? 'bg-amber-500' 
                                  : fillPercentage > 90 
                                    ? 'bg-teal-500' 
                                    : 'bg-brand-500'
                              }`} 
                              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-slate-500 min-w-[28px] text-right">{fillPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          source.status === 'Safe' 
                            ? 'bg-status-safe-bg text-status-safe-text border-status-safe-border' 
                            : source.status === 'Moderate'
                              ? 'bg-status-warning-bg text-status-warning-text border-status-warning-border'
                              : 'bg-status-danger-bg text-status-danger-text border-status-danger-border'
                        }`}>
                          {source.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{source.lastInspection}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => navigate(`/sources/${source.id}`)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(source)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                            title="Edit Station"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchive(source.id, source.name)}
                            className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                            title="Archive Station"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer: Add/Edit Water Source */}
      {showDrawer && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setShowDrawer(false)}
          ></div>
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-civic-border shadow-civic-lg z-50 flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-civic-border flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {editingSourceId ? 'Edit Water Source' : 'Register New Water Source'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {editingSourceId ? 'Modify telemetry credentials and limits' : 'Log new municipal water asset'}
                </p>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="p-1 hover:bg-slate-200 rounded-md text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <p className="font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">Asset Overview</p>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Source Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sector 4 Borewell"
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as WaterSource['type'])}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-brand-500"
                    >
                      <option value="Reservoir">Reservoir</option>
                      <option value="Lake">Lake</option>
                      <option value="Borewell">Borewell</option>
                      <option value="Dam">Dam</option>
                      <option value="Treatment Plant">Treatment Plant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Region</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white"
                    >
                      <option value="Central Sector">Central Sector</option>
                      <option value="North District">North District</option>
                      <option value="East Valley">East Valley</option>
                      <option value="South Plains">South Plains</option>
                      <option value="West Ridge">West Ridge</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <p className="font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">Capacity telemetry</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Total Capacity (ML)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Current Level (ML)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={capacity}
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <p className="font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">Water Chemistry Standards</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">pH Level (0-14)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      required
                      value={pH}
                      onChange={(e) => setPh(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">TDS (ppm)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tds}
                      onChange={(e) => setTds(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Turbidity (NTU)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={turbidity}
                      onChange={(e) => setTurbidity(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Dissolved Oxygen (mg/L)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={dissolvedOxygen}
                      onChange={(e) => setDissolvedOxygen(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-semibold"
                >
                  {editingSourceId ? 'Save Changes' : 'Register Source'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
