import React, { createContext, useContext, useState, useEffect } from 'react';
import { WaterSource, Complaint, MaintenanceTask, SystemNotification, UserRole, ComplaintTimelineEntry } from '../types';
import { initialWaterSources, initialComplaints, initialMaintenanceTasks, initialNotifications } from '../data/mockData';

interface WaterContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  sources: WaterSource[];
  addWaterSource: (source: Omit<WaterSource, 'id' | 'status'>) => void;
  updateWaterSource: (id: string, updates: Partial<WaterSource>) => void;
  archiveWaterSource: (id: string) => void;
  complaints: Complaint[];
  addComplaint: (category: Complaint['category'], description: string, location: string, evidenceUrl?: string) => void;
  updateComplaintStatus: (id: string, status: Complaint['status'], note: string, officer?: string) => void;
  maintenanceTasks: MaintenanceTask[];
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id' | 'status' | 'dateCreated'>) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceTask['status'], officer?: string) => void;
  notifications: SystemNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  triggerSystemWarning: (type: SystemNotification['type'], title: string, message: string, sourceId?: string) => void;
}

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export const WaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global User Role
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('hydrocivic_role');
    return (saved as UserRole) || 'admin'; // Defaulting to Admin for immediate exploration of the command center
  });

  // Sources State
  const [sources, setSources] = useState<WaterSource[]>([]);
  useEffect(() => {
    console.log("FETCH STARTED");

    fetch("http://localhost:5000/api/sources")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA RECEIVED", data);
      })
      .catch((err) => {
        console.error("FETCH ERROR", err);
      });
  }, []);
  useEffect(() => {
    const mapLatLngToSvg = (lat: number, lng: number) => {
      const latTop = -1.2521;
      const latBottom = -1.3321;
      const lngLeft = 36.7519;
      const lngRight = 36.8919;

      const yMin = 15;
      const yMax = 80;
      const xMin = 20;
      const xMax = 80;

      let y = yMin + ((latTop - lat) / (latTop - latBottom)) * (yMax - yMin);
      let x = xMin + ((lng - lngLeft) / (lngRight - lngLeft)) * (xMax - xMin);

      x = Math.max(5, Math.min(95, x));
      y = Math.max(5, Math.min(95, y));

      return { x: Math.round(x), y: Math.round(y) };
    };

    const getMockSvgCoordinates = (id: string, lat: number, lng: number) => {
      switch (id) {
        case 'src-01': return { x: 50, y: 45 };
        case 'src-02': return { x: 48, y: 15 };
        case 'src-03': return { x: 80, y: 35 };
        case 'src-04': return { x: 60, y: 80 };
        case 'src-05': return { x: 20, y: 55 };
        default:
          return mapLatLngToSvg(lat, lng);
      }
    };

    fetch("http://localhost:5000/api/sources")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((s: any) => {
          const latVal = Number(s.latitude);
          const lngVal = Number(s.longitude);
          const svgCoords = getMockSvgCoordinates(s.source_id, latVal, lngVal);
          return {
            id: s.source_id,
            name: s.name,
            type: s.type,
            region: s.region,
            capacity: Number(s.capacity),
            currentLevel: Number(s.current_level),
            status: s.status,
            lastInspection: s.last_inspection ? s.last_inspection.split('T')[0] : '',
            pH: Number(s.ph),
            tds: Number(s.tds),
            turbidity: Number(s.turbidity),
            dissolvedOxygen: Number(s.dissolved_oxygen),
            coordinates: {
              x: svgCoords.x,
              y: svgCoords.y,
              lat: latVal,
              lng: lngVal
            }
          };
        });
        setSources(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  // Complaints State
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  useEffect(() => {
    const buildTimeline = (c: any) => {
      const dateStr = c.date_submitted ? c.date_submitted.split('T')[0] : '';
      const timeline: ComplaintTimelineEntry[] = [{ date: dateStr, status: 'Submitted', note: 'Issue reported to system database.' }];
      if (c.status === 'Submitted') return timeline;

      timeline.push({ date: dateStr, status: 'Assigned', note: `Assigned to ${c.assigned_officer || 'Field Officer'}.` });
      if (c.status === 'Assigned') return timeline;

      timeline.push({ date: dateStr, status: 'In Progress', note: 'Inspection and repair work initiated.' });
      if (c.status === 'In Progress') return timeline;

      timeline.push({ date: dateStr, status: 'Resolved', note: 'Resolution confirmed by assigned officer.' });
      return timeline;
    };

    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((c: any) => ({
          id: c.complaint_id,
          category: c.category,
          description: c.description,
          location: c.location,
          evidenceUrl: c.evidence_url || undefined,
          status: c.status,
          citizenName: c.citizen_name || 'Anonymous',
          dateSubmitted: c.date_submitted ? c.date_submitted.split('T')[0] : '',
          assignedOfficer: c.assigned_officer || undefined,
          timeline: buildTimeline(c)
        }));
        setComplaints(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  // Maintenance State
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/maintenance")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((t: any) => ({
          id: t.task_id,
          title: t.title,
          sourceId: t.source_id,
          sourceName: t.source_name,
          type: t.type,
          priority: t.priority,
          status: t.status,
          dateCreated: t.date_created ? t.date_created.split('T')[0] : '',
          dateCompleted: t.date_completed ? t.date_completed.split('T')[0] : undefined,
          assignedOfficer: t.assigned_officer || undefined,
          description: t.description
        }));
        setMaintenanceTasks(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  // Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/notifications")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((n: any) => ({
          id: n.notification_id,
          type: n.type,
          title: n.title,
          message: n.message,
          date: n.notification_date,
          read: n.is_read === 1 || n.is_read === true,
          sourceId: n.source_id || undefined
        }));
        setNotifications(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hydrocivic_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('hydrocivic_sources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('hydrocivic_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('hydrocivic_maintenance', JSON.stringify(maintenanceTasks));
  }, [maintenanceTasks]);

  useEffect(() => {
    localStorage.setItem('hydrocivic_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
  };

  const addWaterSource = (source: Omit<WaterSource, 'id' | 'status'>) => {
    // Determine status based on quality readings
    let status: WaterSource['status'] = 'Safe';
    if (source.pH < 6.0 || source.pH > 8.5 || source.tds > 600 || source.turbidity > 10 || source.dissolvedOxygen < 4.0) {
      status = 'Unsafe';
    } else if (source.pH < 6.5 || source.pH > 8.0 || source.tds > 400 || source.turbidity > 4 || source.dissolvedOxygen < 6.0) {
      status = 'Moderate';
    }

    const newSource: WaterSource = {
      ...source,
      id: `src-${Math.floor(100 + Math.random() * 900)}`,
      status
    };

    setSources(prev => [newSource, ...prev]);

    // Push notification
    if (status === 'Unsafe') {
      triggerSystemWarning(
        'quality_warning',
        'New Unsafe Source Registered',
        `Source "${newSource.name}" has safety threshold violations. Verification suggested.`,
        newSource.id
      );
    }
  };

  const updateWaterSource = (id: string, updates: Partial<WaterSource>) => {
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        const merged = { ...s, ...updates };
        // Recalculate status if quality parameters updated
        if (updates.pH !== undefined || updates.tds !== undefined || updates.turbidity !== undefined || updates.dissolvedOxygen !== undefined) {
          let status: WaterSource['status'] = 'Safe';
          if (merged.pH < 6.0 || merged.pH > 8.5 || merged.tds > 600 || merged.turbidity > 10 || merged.dissolvedOxygen < 4.0) {
            status = 'Unsafe';
          } else if (merged.pH < 6.5 || merged.pH > 8.0 || merged.tds > 400 || merged.turbidity > 4 || merged.dissolvedOxygen < 6.0) {
            status = 'Moderate';
          }
          merged.status = status;
        }
        return merged;
      }
      return s;
    }));
  };

  const archiveWaterSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };


  const addComplaint = async (
    category: Complaint['category'],
    description: string,
    location: string,
    evidenceUrl?: string
  ) => {

    const today = new Date().toISOString().split('T')[0];

    const newComplaint: Complaint = {
      id: `cmp-${Math.floor(100 + Math.random() * 900)}`,
      category,
      description,
      location,
      evidenceUrl,
      status: 'Submitted',
      citizenName:
        userRole === 'citizen'
          ? 'Citizen Reporter'
          : 'Anonymous Citizen',
      dateSubmitted: today,
      timeline: [
        {
          date: today,
          status: 'Submitted',
          note: 'Issue reported to system database.'
        }
      ]
    };

    try {

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            complaint_id: newComplaint.id,
            category: newComplaint.category,
            description: newComplaint.description,
            location: newComplaint.location,
            status: newComplaint.status,
            citizen_name: newComplaint.citizenName,
            assigned_officer: null,
            date_submitted: newComplaint.dateSubmitted
          })
        }
      );

      const result = await response.json();

      if (result.success) {

        setComplaints(prev => [
          newComplaint,
          ...prev
        ]);

        triggerSystemWarning(
          'complaint_update',
          'New Citizen Complaint',
          `New complaint filed under "${category}" in "${location}".`
        );

      }

    } catch (error) {

      console.error(error);

    }
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], note: string, officer?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const updatedTimeline = [...c.timeline, { date: today, status, note }];
        return {
          ...c,
          status,
          assignedOfficer: officer || c.assignedOfficer,
          timeline: updatedTimeline
        };
      }
      return c;
    }));

    // Trigger notification
    triggerSystemWarning(
      'complaint_update',
      'Complaint Status Updated',
      `Complaint ${id} is now [${status}]: "${note}"`
    );
  };

  const addMaintenanceTask = (task: Omit<MaintenanceTask, 'id' | 'status' | 'dateCreated'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newTask: MaintenanceTask = {
      ...task,
      id: `maint-${Math.floor(100 + Math.random() * 900)}`,
      status: task.assignedOfficer ? 'Assigned' : 'Pending',
      dateCreated: today
    };

    setMaintenanceTasks(prev => [newTask, ...prev]);

    triggerSystemWarning(
      'maintenance_reminder',
      'New Maintenance Logged',
      `Task "${task.title}" created for ${task.sourceName} (${task.priority} Priority).`
    );
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceTask['status'], officer?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setMaintenanceTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          assignedOfficer: officer || t.assignedOfficer,
          dateCompleted: status === 'Completed' ? today : t.dateCompleted
        };
      }
      return t;
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const triggerSystemWarning = (type: SystemNotification['type'], title: string, message: string, sourceId?: string) => {
    const newNotif: SystemNotification = {
      id: `notif-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      title,
      message,
      date: new Date().toISOString(),
      read: false,
      sourceId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <WaterContext.Provider value={{
      userRole,
      setUserRole,
      sources,
      addWaterSource,
      updateWaterSource,
      archiveWaterSource,
      complaints,
      addComplaint,
      updateComplaintStatus,
      maintenanceTasks,
      addMaintenanceTask,
      updateMaintenanceStatus,
      notifications,
      markNotificationAsRead,
      clearNotifications,
      triggerSystemWarning
    }}>
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
};
