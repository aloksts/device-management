
// -----------------------------------------
// STATIC MOCK DATA SYSTEM (No Backend Required)
// -----------------------------------------

const delay = (ms) => new Promise(res => setTimeout(res, ms));

let devices = [
  { id: 1, target_board: 'ERD',  asset_device_no: 'ERD-001', serial_number: 'SN-E001', sample_number: 'S1', project_team: 'Platform', status: 'in_use', owner_id: 1, owner_name: 'Admin User', current_owner_id: 1, current_owner_name: 'Admin User', location: 'Lab A', hw_revision: 'v1.0', mac_address: '11:22:33:AA:BB' },
  { id: 2, target_board: 'SMDK', asset_device_no: 'SMDK-002', serial_number: 'SN-S002', sample_number: 'S2', project_team: 'Modem', status: 'available', owner_id: 2, owner_name: 'Standard User', location: 'Storage', hw_revision: 'v1.2', mac_address: 'AA:BB:CC:DD:EE' },
  { id: 3, target_board: 'ERD',  asset_device_no: 'ERD-003', serial_number: 'SN-E003', sample_number: 'S1', project_team: 'Camera', status: 'maintenance', owner_id: 1, owner_name: 'Admin User', current_owner_name: 'IT Support', location: 'Repair Depot', hw_revision: 'v1.0' },
  { id: 4, target_board: 'SMDK', asset_device_no: 'SMDK-004', serial_number: 'SN-S004', sample_number: 'S3', project_team: 'Platform', status: 'in_use', owner_id: 2, owner_name: 'Standard User', current_owner_name: 'Standard User', location: 'Desk 4', hw_revision: 'v2.1' },
];

for(let i=5; i<=25; i++) {
  devices.push({
    id: i, target_board: i%2===0?'ERD':'SMDK', asset_device_no: `DEV-0${i}`, serial_number: `B-00${i}`, project_team: ['Platform','Modem','Audio','Display','Camera'][i%5],
    status: i%3===0 ? 'available' : 'in_use', owner_name: 'Demo System', current_owner_name: i%3===0 ? null : 'Tester', location: `Rack ${i%4}`
  });
}

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
