import { WaterSource, Complaint, MaintenanceTask, SystemNotification } from '../types';

export const initialWaterSources: WaterSource[] = [
  {
    id: 'src-01',
    name: 'Central Reservoir',
    type: 'Reservoir',
    region: 'Central Sector',
    capacity: 500,
    currentLevel: 380,
    status: 'Safe',
    lastInspection: '2026-05-15',
    pH: 7.2,
    tds: 180,
    turbidity: 0.8,
    dissolvedOxygen: 8.2,
    coordinates: { x: 50, y: 45, lat: -1.2921, lng: 36.8219 }
  },
  {
    id: 'src-02',
    name: 'North Dam',
    type: 'Dam',
    region: 'North District',
    capacity: 1200,
    currentLevel: 420, // 35% capacity -> Alert/Warning trigger
    status: 'Safe',
    lastInspection: '2026-05-20',
    pH: 7.4,
    tds: 210,
    turbidity: 1.2,
    dissolvedOxygen: 7.9,
    coordinates: { x: 48, y: 15, lat: -1.2521, lng: 36.8019 }
  },
  {
    id: 'src-03',
    name: 'East Valley Borewell',
    type: 'Borewell',
    region: 'East Valley',
    capacity: 80,
    currentLevel: 68,
    status: 'Moderate',
    lastInspection: '2026-06-01',
    pH: 7.9,
    tds: 480, // High TDS
    turbidity: 4.8, // Slightly high turbidity
    dissolvedOxygen: 6.1,
    coordinates: { x: 80, y: 35, lat: -1.2821, lng: 36.8919 }
  },
  {
    id: 'src-04',
    name: 'South Treatment Plant',
    type: 'Treatment Plant',
    region: 'South Plains',
    capacity: 300,
    currentLevel: 270,
    status: 'Safe',
    lastInspection: '2026-05-28',
    pH: 7.1,
    tds: 140,
    turbidity: 0.4,
    dissolvedOxygen: 8.8,
    coordinates: { x: 60, y: 80, lat: -1.3321, lng: 36.8419 }
  },
  {
    id: 'src-05',
    name: 'West Ridge Lake',
    type: 'Lake',
    region: 'West Ridge',
    capacity: 450,
    currentLevel: 160,
    status: 'Unsafe', // Unsafe due to pH & Turbidity
    lastInspection: '2026-06-03',
    pH: 5.8, // Low pH (acidic)
    tds: 820, // Dangerous TDS
    turbidity: 16.5, // Dangerous Turbidity
    dissolvedOxygen: 3.2, // Dangerous DO (low)
    coordinates: { x: 20, y: 55, lat: -1.3021, lng: 36.7519 }
  }
];

export const initialComplaints: Complaint[] = [
  {
    id: 'cmp-01',
    category: 'Leakage',
    description: 'Main distribution valve leaking near the Central Metro Square. Water has been pooling for 2 days.',
    location: 'Central Sector - Metro Square, Lane 4',
    status: 'Resolved',
    citizenName: 'Robert K.',
    dateSubmitted: '2026-05-30',
    assignedOfficer: 'Officer Collins',
    timeline: [
      { date: '2026-05-30', status: 'Submitted', note: 'Complaint filed by citizen with location details.' },
      { date: '2026-05-31', status: 'Assigned', note: 'Assigned to Field Officer Collins for inspection.' },
      { date: '2026-05-31', status: 'In Progress', note: 'Gasket replacement initiated at valve junction.' },
      { date: '2026-06-01', status: 'Resolved', note: 'Valve gasket replaced. Flow checks normal. Site cleared.' }
    ]
  },
  {
    id: 'cmp-02',
    category: 'Low Pressure',
    description: 'Extremely low water pressure in the residential sector of South Plains since yesterday morning.',
    location: 'South Plains - Greenwood Estates, Block C',
    status: 'In Progress',
    citizenName: 'Sarah Jenkins',
    dateSubmitted: '2026-06-04',
    assignedOfficer: 'Officer Martinez',
    timeline: [
      { date: '2026-06-04', status: 'Submitted', note: 'Complaint filed by resident.' },
      { date: '2026-06-04', status: 'Assigned', note: 'Assigned to South District Maintenance team.' },
      { date: '2026-06-05', status: 'In Progress', note: 'Checking booster pumps and line valves for obstructions.' }
    ]
  },
  {
    id: 'cmp-03',
    category: 'Contamination',
    description: 'Tap water appearing turbid and smelling metallic since this afternoon.',
    location: 'West Ridge - Hillview Apartments, Apt 14B',
    status: 'Assigned',
    citizenName: 'David Vance',
    dateSubmitted: '2026-06-05',
    assignedOfficer: 'Officer Collins',
    timeline: [
      { date: '2026-06-05', status: 'Submitted', note: 'Complaint filed. Turbidity and odor concerns.' },
      { date: '2026-06-05', status: 'Assigned', note: 'Assigned to Water Quality Team for sampling.' }
    ]
  },
  {
    id: 'cmp-04',
    category: 'No Water Supply',
    description: 'Complete water outage in the commercial area for the last 6 hours without prior announcement.',
    location: 'North District - Commercial Hub, sector 2',
    status: 'Submitted',
    citizenName: 'M. Ibrahim',
    dateSubmitted: '2026-06-05',
    timeline: [
      { date: '2026-06-05', status: 'Submitted', note: 'Complaint logged. Awaiting engineering assignment.' }
    ]
  }
];

export const initialMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'maint-01',
    title: 'Booster Pump Refurbishment',
    sourceId: 'src-03',
    sourceName: 'East Valley Borewell',
    type: 'Repair',
    priority: 'High',
    status: 'Ongoing',
    dateCreated: '2026-06-02',
    assignedOfficer: 'Officer Martinez',
    description: 'Replace degraded seals and clean pump impeller to restore maximum suction rate.'
  },
  {
    // High turbidity at West Ridge Lake
    id: 'maint-02',
    title: 'Emergency Water Quality Sampling',
    sourceId: 'src-05',
    sourceName: 'West Ridge Lake',
    type: 'Scheduled Inspection',
    priority: 'High',
    status: 'Assigned',
    dateCreated: '2026-06-04',
    assignedOfficer: 'Officer Collins',
    description: 'Take water samples at 5 distinct coordinates to find source of high acidity (pH 5.8) and TDS.'
  },
  {
    id: 'maint-03',
    title: 'Sluice Gate Inspection',
    sourceId: 'src-02',
    sourceName: 'North Dam',
    type: 'Scheduled Inspection',
    priority: 'Critical',
    status: 'Pending',
    dateCreated: '2026-06-04',
    description: 'Inspect sluice gates 2 and 3 for corrosion and mechanical stress. Crucial due to current low reservoir level.'
  },
  {
    id: 'maint-04',
    title: 'Activated Carbon Filter Flush',
    sourceId: 'src-04',
    sourceName: 'South Treatment Plant',
    type: 'Request',
    priority: 'Medium',
    status: 'Completed',
    dateCreated: '2026-05-26',
    dateCompleted: '2026-05-28',
    assignedOfficer: 'Officer Collins',
    description: 'Perform backwash and flush of carbon filtration beds in module B.'
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-01',
    type: 'low_water',
    title: 'Critical Reservoir Warning',
    message: 'North Dam level is at 35% capacity. Secondary intake pumps deactivated to prevent silt intake.',
    date: '2026-06-05T08:30:00Z',
    read: false,
    sourceId: 'src-02'
  },
  {
    id: 'notif-02',
    type: 'quality_warning',
    title: 'Water Quality Flagged Unsafe',
    message: 'West Ridge Lake has failed pH (5.8) and TDS (820 ppm) safety thresholds. Local distribution paused.',
    date: '2026-06-04T14:15:00Z',
    read: false,
    sourceId: 'src-05'
  },
  {
    id: 'notif-03',
    type: 'complaint_update',
    title: 'Leakage Resolved',
    message: 'Complaint cmp-01 (Leakage at Central Metro Square) has been marked RESOLVED by Officer Collins.',
    date: '2026-06-01T17:00:00Z',
    read: true,
    sourceId: 'src-01'
  },
  {
    id: 'notif-04',
    type: 'maintenance_reminder',
    title: 'Sluice Gate Check Pending',
    message: 'Critical inspection task at North Dam needs assignment. Planned execution before monsoon inflow.',
    date: '2026-06-05T10:00:00Z',
    read: false,
    sourceId: 'src-02'
  }
];
