
// -----------------------------------------
// STATIC MOCK DATA SYSTEM (No Backend Required)
// -----------------------------------------

const delay = (ms) => new Promise(res => setTimeout(res, ms));

let devices = [
  { 
    id: 1, target_board: 'ERD', asset_device_no: 'ERD-101', serial_number: 'SN-X1K2', sample_number: 'Q1-Alpha', project_team: 'Platform', 
    status: 'in_use', owner_id: 1, owner_name: 'Admin User', current_owner_id: 1, current_owner_name: 'Admin User', assignment_date: new Date(Date.now() - 10*24*60*60*1000).toISOString(), 
    location: 'Bldg 4 - Server Rack A', hw_revision: 'v2.1', mac_address: 'AA:11:BB:22:CC:33', ram_size: '32GB LPDDR5X', 
    storage_capacity: '1TB UFS 4.0', os_version: 'Android 15 (Beta 2)', summary: 'Primary bring-up board for next-gen flagship SoC validation.'
  },
  { 
    id: 2, target_board: 'SMDK', asset_device_no: 'SMDK-204', serial_number: 'SN-B2Z4', sample_number: 'M3-Beta', project_team: 'Modem', 
    status: 'available', owner_id: 2, owner_name: 'Standard User', location: 'Lab B - RF Shield Box', hw_revision: 'v1.0.5', 
    mac_address: 'FF:EE:DD:CC:BB:AA', ram_size: '16GB LPDDR5', storage_capacity: '256GB UFS', os_version: 'AOSP 14', 
    summary: 'Dedicated 5G mmWave evaluation kit. Requires liquid cooling attachment.'
  },
  { 
    id: 3, target_board: 'ERD', asset_device_no: 'ERD-305', serial_number: 'SN-C4F1', sample_number: 'C1-Proto', project_team: 'Camera', 
    status: 'maintenance', owner_id: 1, owner_name: 'Admin User', current_owner_name: 'Hardware Support', location: 'Repair Depot', 
    hw_revision: 'v1.4', mac_address: '00:1A:2B:3C:4D:5E', ram_size: '24GB', storage_capacity: '512GB', os_version: 'QNX RTOS', 
    summary: 'Currently experiencing sensor detachment issue on ISP-2 module.'
  },
  { 
    id: 4, target_board: 'SMDK', asset_device_no: 'SMDK-412', serial_number: 'SN-D5G5', sample_number: 'D4-Gamma', project_team: 'Display', 
    status: 'in_use', owner_id: 2, owner_name: 'Standard User', current_owner_name: 'Standard User', assignment_date: new Date(Date.now() - 4*24*60*60*1000).toISOString(), location: 'Desk 42', 
    hw_revision: 'v3.0 (OLED Variant)', mac_address: '12:34:56:78:9A:BC', ram_size: '16GB', storage_capacity: '256GB', 
    summary: 'Connected to external 8K reference display matrix.'
  },
  { 
    id: 5, target_board: 'ERD', asset_device_no: 'ERD-155', serial_number: 'SN-A1B2', sample_number: 'A1', project_team: 'Audio', 
    status: 'available', owner_id: 1, owner_name: 'Admin User', location: 'Acoustic Chamber 2', hw_revision: 'v1.1', 
    mac_address: '00:11:22:33:44:55', ram_size: '8GB', storage_capacity: '128GB', summary: 'Used for spatial audio validation.'
  },
  { 
    id: 6, target_board: 'ERD', asset_device_no: 'ERD-882', serial_number: 'SN-Z9Y8', sample_number: 'Z1', project_team: 'Platform', 
    status: 'retired', owner_id: 1, owner_name: 'Admin User', location: 'Deep Storage Facility', hw_revision: 'v0.9', 
    summary: 'Legacy engineering sample. Bootloader locked permanently.'
  },
  { 
    id: 7, target_board: 'SMDK', asset_device_no: 'SMDK-900', serial_number: 'SN-W7W7', sample_number: 'W-Max', project_team: 'Connectivity', 
    status: 'in_use', owner_id: 1, owner_name: 'Wi-Fi Team', current_owner_name: 'Admin User', assignment_date: new Date(Date.now() - 28*24*60*60*1000).toISOString(), location: 'Lab C', 
    hw_revision: 'v2.2', mac_address: 'FC:FB:FA:F9:F8:F7', ram_size: '16GB', os_version: 'Android 15', summary: 'Wi-Fi 7 certification testing.'
  }
];

let transfers = [
  { id: 1, device_id: 1, device: devices.find(d=>d.id===1), requester_id: 2, requester_name: 'Standard User', current_holder_id: 1, current_holder_name: 'Admin User', status: 'pending', request_date: new Date().toISOString(), notes: 'Need this board for kernel debug.' }
];

let users = [
  { id: 1, name: "Admin View", email: "admin", department: "Operations", role: "admin", device_count: 5 },
  { id: 2, name: "Standard View", email: "user", department: "Engineering", role: "member", device_count: 2 },
];

export async function fetchDashboard() {
  await delay(150);
  return {
    total_devices: devices.length,
    available_devices: devices.filter(d=>d.status==='available').length,
    in_use_devices: devices.filter(d=>d.status==='in_use').length,
    pending_transfers: transfers.filter(t=>t.status==='pending').length,
    erd_count: devices.filter(d=>d.target_board==='ERD').length,
    smdk_count: devices.filter(d=>d.target_board==='SMDK').length
  };
}

export async function fetchDevices(filters = {}) {
  await delay(200);
  let res = [...devices];
  if (filters.board) res = res.filter(d => d.target_board === filters.board);
  if (filters.status) res = res.filter(d => d.status === filters.status);
  if (filters.team) res = res.filter(d => d.project_team === filters.team);
  return res;
}

export async function createDevice(data) {
  await delay(300);
  const newD = { id: devices.length+1, ...data, status: 'available', owner_name: 'Admin User' };
  devices.unshift(newD);
  return newD;
}

export async function fetchUsers() {
  await delay(200);
  return users;
}

export async function fetchTransfers() {
  await delay(200);
  return transfers;
}

export async function createTransfer(data) {
  await delay(300);
  const device = devices.find(d => d.id === data.device_id);
  const newT = { id: transfers.length+1, device_id: data.device_id, device, requester_id: data.requester_id, requester_name: 'Current User', status: 'pending', notes: data.notes, request_date: new Date().toISOString() };
  transfers.unshift(newT);
  return newT;
}

export async function updateTransfer(id, status) {
  await delay(200);
  const t = transfers.find(x => x.id === id);
  if (t) t.status = status;
  return t;
}


export async function approveTransfer(id) {
  await delay(200);
  const t = transfers.find(x => x.id === id);
  if (t) t.status = 'approved';
  return t;
}

export async function rejectTransfer(id) {
  await delay(200);
  const t = transfers.find(x => x.id === id);
  if (t) t.status = 'rejected';
  return t;
}

export async function fetchTeams() {
  await delay(100);
  return [...new Set(devices.map(d => d.project_team))].filter(Boolean);
}

export async function loginUser(creds) {
  await delay(400);
  if(creds.email === 'admin') return users[0];
  if(creds.email === 'user') return users[1];
  throw new Error('Invalid');
}
