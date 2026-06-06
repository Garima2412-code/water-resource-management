export type UserRole = 'citizen' | 'officer' | 'admin';

export interface WaterSource {
  id: string;
  name: string;
  type: 'Reservoir' | 'Lake' | 'Borewell' | 'Dam' | 'Treatment Plant';
  region: string;
  capacity: number; // in Megaliters (ML)
  currentLevel: number; // in Megaliters (ML)
  status: 'Safe' | 'Moderate' | 'Unsafe';
  lastInspection: string; // YYYY-MM-DD
  pH: number;
  tds: number; // ppm (Total Dissolved Solids)
  turbidity: number; // NTU
  dissolvedOxygen: number; // mg/L
  coordinates: {
    x: number; // relative coordinate percentage (0-100) for SVG map
    y: number; // relative coordinate percentage (0-100) for SVG map
    lat: number;
    lng: number;
  };
}

export interface ComplaintTimelineEntry {
  date: string;
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
  note: string;
}

export interface Complaint {
  id: string;
  category: 'Leakage' | 'Contamination' | 'No Water Supply' | 'Low Pressure' | 'Infrastructure Damage';
  description: string;
  location: string;
  evidenceUrl?: string;
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
  citizenName: string;
  dateSubmitted: string;
  assignedOfficer?: string;
  timeline: ComplaintTimelineEntry[];
}

export interface MaintenanceTask {
  id: string;
  title: string;
  sourceId: string;
  sourceName: string;
  type: 'Request' | 'Equipment Failure' | 'Scheduled Inspection' | 'Repair';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Assigned' | 'Ongoing' | 'Completed';
  dateCreated: string;
  dateCompleted?: string;
  assignedOfficer?: string;
  description: string;
}

export interface SystemNotification {
  id: string;
  type: 'low_water' | 'quality_warning' | 'complaint_update' | 'maintenance_reminder';
  title: string;
  message: string;
  date: string;
  read: boolean;
  sourceId?: string;
}
