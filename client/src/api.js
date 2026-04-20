const BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchDashboard() {
  const res = await fetch(`${BASE}/dashboard`);
  return res.json();
}

export async function fetchDevices(params = {}) {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  const res = await fetch(`${BASE}/devices${q ? '?' + q : ''}`);
  return res.json();
}

export async function createDevice(data) {
  const res = await fetch(`${BASE}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchDevice(id) {
  const res = await fetch(`${BASE}/devices/${id}`);
  return res.json();
}

export async function updateDevice(id, data) {
  const res = await fetch(`${BASE}/devices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${BASE}/users`);
  return res.json();
}

export async function fetchTransfers(params = {}) {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  const res = await fetch(`${BASE}/transfers${q ? '?' + q : ''}`);
  return res.json();
}

export async function fetchDeviceQueue(deviceId) {
  const res = await fetch(`${BASE}/transfers/queue/${deviceId}`);
  return res.json();
}

export async function createTransfer(data) {
  const res = await fetch(`${BASE}/transfers/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function approveTransfer(id) {
  const res = await fetch(`${BASE}/transfers/${id}/approve`, { method: 'PUT' });
  return res.json();
}

export async function rejectTransfer(id) {
  const res = await fetch(`${BASE}/transfers/${id}/reject`, { method: 'PUT' });
  return res.json();
}

export async function loginUser(credentials) {
  const res = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function fetchTeams() {
  const res = await fetch(`${BASE}/devices/teams/all`);
  return res.json();
}
