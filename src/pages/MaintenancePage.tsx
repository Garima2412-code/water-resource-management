import React, { useState } from 'react';
import { useWater } from '../context/WaterContext';
import { MaintenanceTask } from '../types';
import { 
  Wrench, 
  Plus, 
  CheckCircle, 
  Clock, 
  Activity, 
  AlertTriangle, 
  User, 
  Calendar,
  X,
  FileText,
  TrendingDown
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { maintenanceTasks, addMaintenanceTask, updateMaintenanceStatus, sources } = useWater();

  // Filters State
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Modal Dialog Form State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [sourceId, setSourceId] = useState(sources[0]?.id || '');
  const [taskType, setTaskType] = useState<MaintenanceTask['type']>('Scheduled Inspection');
  const [priority, setPriority] = useState<MaintenanceTask['priority']>('Medium');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [description, setDescription] = useState('');

  // Handle Log Task submit
  const handleLogTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sourceId) return;

    const sourceName = sources.find(s => s.id === sourceId)?.name || 'Unknown Basin';

    addMaintenanceTask({
      title,
      sourceId,
      sourceName,
      type: taskType,
      priority,
      assignedOfficer: assignedOfficer || undefined,
      description
    });

    setTitle('');
    setDescription('');
    setAssignedOfficer('');
    setShowModal(false);
  };

  // Status transitions
  const handleQuickStatusUpdate = (id: string, status: MaintenanceTask['status']) => {
    updateMaintenanceStatus(id, status);
  };

  // Statistics calculation
  const totalTasks = maintenanceTasks.length;
  const criticalCount = maintenanceTasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed').length;
  const ongoingCount = maintenanceTasks.filter(t => t.status === 'Ongoing').length;
  const completedCount = maintenanceTasks.filter(t => t.status === 'Completed').length;

  // Filter maintenance tasks
  const filteredTasks = maintenanceTasks.filter(t => {
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    const matchesType = selectedType === 'All' || t.type === selectedType;
    return matchesPriority && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Infrastructure Maintenance Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track equipment wear, logs failure tickets, and plan preventative inspections.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white rounded-md px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Infrastructure Task</span>
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 font-semibold block">Total Tickets Logged</span>
            <span className="text-xl font-bold text-slate-800 mt-1 block">{totalTasks}</span>
          </div>
          <Wrench className="w-8 h-8 text-slate-200" />
        </div>
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 font-semibold block">Critical Pending</span>
            <span className="text-xl font-bold text-red-600 mt-1 block">{criticalCount}</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-100" />
        </div>
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 font-semibold block">Ongoing Repairs</span>
            <span className="text-xl font-bold text-blue-600 mt-1 block">{ongoingCount}</span>
          </div>
          <Activity className="w-8 h-8 text-blue-100" />
        </div>
        <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 font-semibold block">Completed Cycles</span>
            <span className="text-xl font-bold text-emerald-600 mt-1 block">{completedCount}</span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-100" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-civic-border rounded-lg p-4 shadow-civic flex gap-4 flex-wrap items-center text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Priority:</span>
          <select 
            value={selectedPriority} 
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border border-slate-200 rounded p-1 bg-slate-50"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Status:</span>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded p-1 bg-slate-50"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Type:</span>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-slate-200 rounded p-1 bg-slate-50"
          >
            <option value="All">All Types</option>
            <option value="Request">Request</option>
            <option value="Equipment Failure">Equipment Failure</option>
            <option value="Scheduled Inspection">Scheduled Inspection</option>
            <option value="Repair">Repair</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-civic-border rounded-lg shadow-civic overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-civic-border text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Task Details</th>
                <th className="py-3 px-4">Station Asset</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Crew</th>
                <th className="py-3 px-4">Logged Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Task Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No infrastructure maintenance tickets found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{t.title}</div>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5 max-w-xs">{t.description}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{t.sourceName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{t.type}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        t.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                        t.priority === 'High' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        t.priority === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 flex items-center gap-1.5 text-slate-700 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.assignedOfficer || 'Awaiting dispatch'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{t.dateCreated}</td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 font-semibold">
                        {t.status === 'Completed' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Completed</span>
                          </>
                        ) : t.status === 'Ongoing' ? (
                          <>
                            <Activity className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-blue-700">Ongoing</span>
                          </>
                        ) : t.status === 'Assigned' ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-orange-600">Assigned</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-500">Pending</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {t.status !== 'Completed' ? (
                        <select 
                          value={t.status}
                          onChange={(e) => handleQuickStatusUpdate(t.id, e.target.value as MaintenanceTask['status'])}
                          className="border border-slate-200 rounded p-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
                        >
                          <option value="Pending" disabled>Update...</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold block pr-2">CLOSED</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-civic-border rounded-lg shadow-civic-lg w-full max-w-md overflow-hidden text-xs text-left">
            <div className="px-5 py-4 bg-slate-50 border-b border-civic-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Schedule Maintenance Task</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Dispatch crews or log failure tickets</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-200 rounded text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogTask} className="p-5 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Task Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Pump Valve Replacement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Water Source Asset</label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 focus:bg-white"
                  >
                    {sources.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as MaintenanceTask['type'])}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 focus:bg-white"
                  >
                    <option value="Request">Request</option>
                    <option value="Equipment Failure">Equipment Failure</option>
                    <option value="Scheduled Inspection">Scheduled Inspection</option>
                    <option value="Repair">Repair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as MaintenanceTask['priority'])}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 focus:bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Assign Officer</label>
                  <select
                    value={assignedOfficer}
                    onChange={(e) => setAssignedOfficer(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 focus:bg-white"
                  >
                    <option value="">Awaiting Crew...</option>
                    <option value="Officer Collins">Officer Collins (Quality)</option>
                    <option value="Officer Martinez">Officer Martinez (Civil/Pipes)</option>
                    <option value="Officer Robinson">Officer Robinson (Basin/Dams)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Task Details & Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide logs for technical team dispatch..."
                  className="w-full p-2 border border-slate-200 rounded focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
