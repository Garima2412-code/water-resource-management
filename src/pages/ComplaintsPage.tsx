import React, { useState } from 'react';
import { useWater } from '../context/WaterContext';
import { Complaint } from '../types';
import { 
  AlertCircle, 
  MapPin, 
  Calendar, 
  User, 
  Send, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ExternalLink,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const { userRole, complaints, addComplaint, updateComplaintStatus } = useWater();
  const [selectedId, setSelectedId] = useState<string>(complaints[0]?.id || '');
  
  // Submit Form States
  const [category, setCategory] = useState<Complaint['category']>('Leakage');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Officer Update States
  const [officerActionStatus, setOfficerActionStatus] = useState<Complaint['status']>('In Progress');
  const [officerNote, setOfficerNote] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('Officer Collins');

  // Selected complaint details
  const selectedComplaint = complaints.find(c => c.id === selectedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !description) return;
    
    addComplaint(category, description, location);
    setLocation('');
    setDescription('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !officerNote) return;

    updateComplaintStatus(selectedId, officerActionStatus, officerNote, assignedOfficer);
    setOfficerNote('');
  };

  // Status Badge styles
  const getStatusBadgeStyle = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved': return 'bg-status-safe-bg text-status-safe-text border-status-safe-border';
      case 'In Progress': return 'bg-status-info-bg text-status-info-text border-status-info-border';
      case 'Assigned': return 'bg-status-warning-bg text-status-warning-text border-status-warning-border';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Citizen Complaints & Service Board</h1>
        <p className="text-xs text-slate-500 mt-1">
          {userRole === 'citizen' 
            ? 'Report supply outages, pressure drops, or leakages directly to regional water boards.'
            : 'Track, dispatch, and review public service requests and complaints.'}
        </p>
      </div>

      {/* Main Workspace: Left forms/list, Right details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Form (Citizen) or List (Officer/Admin) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Citizen: Submit Form */}
          {userRole === 'citizen' && (
            <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic text-xs">
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-brand-600" />
                <span>Submit Service Request</span>
              </h3>

              {showSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Complaint filed successfully. Local water board notified.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Complaint['category'])}
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white"
                  >
                    <option value="Leakage">Leakage</option>
                    <option value="Contamination">Water Contamination</option>
                    <option value="No Water Supply">Complete Supply Outage</option>
                    <option value="Low Pressure">Low Supply Pressure</option>
                    <option value="Infrastructure Damage">Pipe / Dam Damage</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Incident Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. 15 Greenwood Road, West Sector"
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Detailed Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details about pressure drop, visual contamination, etc."
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Upload Evidence (Optional)</label>
                  <div className="border border-dashed border-slate-200 rounded-md p-4 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                    <span className="text-slate-400 font-medium block">Click to select photo / video</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">JPEG, PNG up to 10MB</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-semibold mt-3"
                >
                  File Complaint
                </button>
              </form>
            </div>
          )}

          {/* All Roles: Complaints List */}
          <div className="bg-white border border-civic-border rounded-lg shadow-civic overflow-hidden">
            <div className="px-4 py-3 border-b border-civic-border bg-slate-50/50 flex justify-between items-center">
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                {userRole === 'citizen' ? 'My Active Tickets' : 'Incoming Complaints'}
              </span>
              <span className="text-[10px] bg-slate-200 font-bold px-2 py-0.5 rounded text-slate-600">
                {complaints.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
              {complaints.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3 text-left hover:bg-slate-50 cursor-pointer flex justify-between items-center gap-3 text-xs transition-colors ${
                    selectedId === c.id ? 'bg-slate-50 border-r-2 border-brand-500' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{c.category}</span>
                      <span className="text-[9px] text-slate-400">{c.id}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.location}</p>
                  </div>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${getStatusBadgeStyle(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Detail Panel & Action Logs (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedComplaint ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Complaint Overview and Update Log */}
              <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic text-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-brand-600 uppercase tracking-widest block">Service Ticket</span>
                      <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedComplaint.category}</h2>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>

                  <div className="space-y-2.5 mt-4 text-slate-600 leading-normal border-b border-slate-50 pb-4">
                    <p className="text-slate-800 bg-slate-50/50 p-2.5 rounded border border-slate-100 italic">
                      "{selectedComplaint.description}"
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedComplaint.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Filed: {selectedComplaint.dateSubmitted}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Filer: {selectedComplaint.citizenName}</span>
                    </div>
                    {selectedComplaint.assignedOfficer && (
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold bg-brand-50 border border-brand-100 rounded px-2 py-1.5 max-w-fit">
                        <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                        <span>Assigned: {selectedComplaint.assignedOfficer}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Officer Action Form */}
                {userRole !== 'citizen' && selectedComplaint.status !== 'Resolved' && (
                  <form onSubmit={handleStatusUpdate} className="space-y-3 mt-4 border-t border-slate-100 pt-4 text-left">
                    <h4 className="font-bold text-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-brand-600" />
                      <span>Action Board Update</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-500 mb-1">Dispatch Officer</label>
                        <select 
                          value={assignedOfficer}
                          onChange={(e) => setAssignedOfficer(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded bg-slate-50"
                        >
                          <option value="Officer Collins">Officer Collins (Quality)</option>
                          <option value="Officer Martinez">Officer Martinez (Civil/Pipes)</option>
                          <option value="Officer Robinson">Officer Robinson (Basin/Dams)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-500 mb-1">Next Transition</label>
                        <select 
                          value={officerActionStatus}
                          onChange={(e) => setOfficerActionStatus(e.target.value as Complaint['status'])}
                          className="w-full p-2 border border-slate-200 rounded bg-slate-50"
                        >
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-500 mb-1">Status log note</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Dispatched maintenance truck to seal pipe valve."
                        value={officerNote}
                        onChange={(e) => setOfficerNote(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded bg-slate-50"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Status Timeline Progression */}
              <div className="bg-white border border-civic-border rounded-lg p-5 shadow-civic text-xs text-left">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Ticket Progression Timeline</h3>
                
                <div className="relative border-l border-slate-100 pl-4 space-y-5 py-2">
                  {selectedComplaint.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Check circles based on status */}
                      <span className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ring-4 ring-white flex items-center justify-center ${
                        item.status === 'Resolved' 
                          ? 'bg-emerald-600 border border-emerald-600' 
                          : item.status === 'In Progress' 
                            ? 'bg-blue-500 border border-blue-500' 
                            : 'bg-slate-300 border border-slate-300'
                      }`}></span>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{item.status}</span>
                          <span className="text-[9px] text-slate-400 font-medium">{item.date}</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-civic-border border-dashed rounded-lg p-12 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <span>Select a complaint ticket from the left panel to inspect timeline progression.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
