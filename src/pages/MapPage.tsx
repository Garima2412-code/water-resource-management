import React, { useState } from 'react';
import { useWater } from '../context/WaterContext';
import { WaterSource } from '../types';
import { 
  Droplet, 
  MapPin, 
  Activity, 
  Info, 
  Filter, 
  ArrowUpRight, 
  Compass, 
  Layers,
  CheckCircle,
  AlertTriangle,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapPage: React.FC = () => {
  const { sources } = useWater();
  const [selectedId, setSelectedId] = useState<string>(sources[0]?.id || '');
  const [visibleType, setVisibleType] = useState<string>('All');

  const selectedSource = sources.find(s => s.id === selectedId);

  // Filter sources for the map
  const mapSources = sources.filter(s => {
    return visibleType === 'All' || s.type === visibleType;
  });

  const getStatusColor = (status: WaterSource['status']) => {
    switch (status) {
      case 'Safe': return 'fill-emerald-500 stroke-emerald-600 text-emerald-600';
      case 'Moderate': return 'fill-amber-500 stroke-amber-600 text-amber-600';
      default: return 'fill-red-500 stroke-red-600 text-red-600';
    }
  };

  const getStatusBgColor = (status: WaterSource['status']) => {
    switch (status) {
      case 'Safe': return 'bg-emerald-50 border-emerald-100 text-emerald-800';
      case 'Moderate': return 'bg-amber-50 border-amber-100 text-amber-800';
      default: return 'bg-red-50 border-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">GIS Regional Telemetry Map</h1>
          <p className="text-xs text-slate-500 mt-1">
            Spatial monitoring dashboard mapping aquifer stations and municipal basins.
          </p>
        </div>

        {/* Map Filters */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 border border-slate-200 bg-white rounded p-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={visibleType}
              onChange={(e) => setVisibleType(e.target.value)}
              className="bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-600 font-semibold"
            >
              <option value="All">All Station Types</option>
              <option value="Reservoir">Reservoir</option>
              <option value="Lake">Lake</option>
              <option value="Borewell">Borewell</option>
              <option value="Dam">Dam</option>
              <option value="Treatment Plant">Treatment Plant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Left Side: SVG Map Canvas (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-civic-border rounded-lg p-4 shadow-civic flex flex-col justify-between relative overflow-hidden min-h-[420px] md:min-h-[500px]">
          
          {/* Compass & Map Metadata Overlay */}
          <div className="absolute top-4 left-4 z-10 space-y-1.5 pointer-events-none">
            <div className="bg-slate-900/90 text-white px-2.5 py-1.5 rounded-md flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase backdrop-blur-xs shadow-sm">
              <Compass className="w-4 h-4 text-brand-400" />
              <span>Gis Vector Canvas: active</span>
            </div>
            <div className="bg-white/80 text-slate-500 border border-slate-200 px-2 py-1 rounded text-[9px] font-medium backdrop-blur-xs">
              Scale: 1:25,000 Grid
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full flex-1 flex items-center justify-center py-6 min-h-[300px]">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full max-w-[450px] aspect-square"
            >
              {/* Region Border Boundaries */}
              <path 
                d="M 10,10 L 90,10 L 95,40 L 80,85 L 20,90 L 5,50 Z" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="0.75" 
                strokeDasharray="2 2"
              />
              
              {/* Regional grid lines */}
              <line x1="25" y1="0" x2="25" y2="100" stroke="#f1f5f9" strokeWidth="0.25" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#f1f5f9" strokeWidth="0.25" />
              <line x1="75" y1="0" x2="75" y2="100" stroke="#f1f5f9" strokeWidth="0.25" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.25" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.25" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="0.25" />

              {/* Water Conduits / Rivers (Blue paths linking sections) */}
              <path 
                d="M 50,15 Q 52,35 80,35 T 60,80" 
                fill="none" 
                stroke="#e0f2fe" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
              <path 
                d="M 20,55 Q 35,50 50,45" 
                fill="none" 
                stroke="#e0f2fe" 
                strokeWidth="1" 
                strokeLinecap="round"
              />

              {/* Interactive Station Nodes */}
              {mapSources.map((s) => {
                const isSelected = selectedId === s.id;
                const statusColor = getStatusColor(s.status);

                return (
                  <g 
                    key={s.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedId(s.id)}
                  >
                    {/* Ring glow when selected or hovered */}
                    <circle 
                      cx={s.coordinates.x} 
                      cy={s.coordinates.y} 
                      r={isSelected ? 5.5 : 4.5} 
                      className={`fill-transparent transition-all stroke-2 ${
                        isSelected 
                          ? s.status === 'Safe' ? 'stroke-emerald-200' : s.status === 'Moderate' ? 'stroke-amber-200' : 'stroke-red-200'
                          : 'stroke-transparent group-hover:stroke-slate-200'
                      }`}
                    />
                    
                    {/* Actual Node */}
                    <circle 
                      cx={s.coordinates.x} 
                      cy={s.coordinates.y} 
                      r={isSelected ? 2.5 : 2} 
                      className={`transition-all ${statusColor.split(' ')[0]} ${statusColor.split(' ')[1]}`}
                    />

                    {/* Label tooltip (subtle hover) */}
                    <text 
                      x={s.coordinates.x} 
                      y={s.coordinates.y - 4} 
                      className="text-[3px] font-bold fill-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-center"
                      textAnchor="middle"
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-4 text-[10px] font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block shrink-0"></span>
              <span>Safe Chemical Index</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block shrink-0"></span>
              <span>Moderate Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 block shrink-0"></span>
              <span>Unsafe Standards violation</span>
            </div>
          </div>
        </div>

        {/* Right Side: Station Info Details (1 Col) */}
        <div className="lg:col-span-1 bg-white border border-civic-border rounded-lg p-5 shadow-civic flex flex-col justify-between text-xs text-left">
          {selectedSource ? (
            <div className="space-y-4 h-full flex flex-col justify-between">
              
              {/* Basic overview info */}
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">GIS Station Node</span>
                <h2 className="text-base font-bold text-slate-900 mt-1">{selectedSource.name}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBgColor(selectedSource.status)}`}>
                    {selectedSource.status}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] border border-slate-200">
                    {selectedSource.type}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 mt-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedSource.region}</span>
                </div>
              </div>

              {/* Water fill rate telemetry bar */}
              <div className="border-y border-slate-100 py-3.5 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Current Volume</span>
                  <span className="text-slate-700">
                    {selectedSource.currentLevel} / {selectedSource.capacity} ML
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedSource.status === 'Safe' ? 'bg-emerald-500' : selectedSource.status === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.round((selectedSource.currentLevel / selectedSource.capacity) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Capacity utilization</span>
                  <span>{Math.round((selectedSource.currentLevel / selectedSource.capacity) * 100)}%</span>
                </div>
              </div>

              {/* Chemical sensor parameters */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chemical Sensors</span>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] leading-normal">
                  <div className="bg-slate-50 border border-slate-100 rounded p-2 flex justify-between">
                    <span className="text-slate-400 font-medium">pH level:</span>
                    <strong className="text-slate-700">{selectedSource.pH}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded p-2 flex justify-between">
                    <span className="text-slate-400 font-medium">TDS count:</span>
                    <strong className="text-slate-700">{selectedSource.tds} <span className="text-[9px] font-normal opacity-75">ppm</span></strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded p-2 flex justify-between">
                    <span className="text-slate-400 font-medium">Turbidity:</span>
                    <strong className="text-slate-700">{selectedSource.turbidity} <span className="text-[9px] font-normal opacity-75">NTU</span></strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded p-2 flex justify-between">
                    <span className="text-slate-400 font-medium">DO index:</span>
                    <strong className="text-slate-700">{selectedSource.dissolvedOxygen} <span className="text-[9px] font-normal opacity-75">mg/L</span></strong>
                  </div>
                </div>
              </div>

              {/* Action Button Link to Source Details */}
              <div className="pt-3 border-t border-slate-100">
                <Link 
                  to={`/sources/${selectedSource.id}`}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-semibold transition-colors flex items-center justify-center gap-1 text-[11px]"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Inspect Detailed Logs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <MapPin className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <span>Select a coordinate pin on the GIS map to inspect live data feeds.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
