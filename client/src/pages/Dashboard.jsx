import { useState, useEffect } from 'react'
import { fetchDashboard, fetchTransfers, fetchDevices, fetchTeams } from '../api'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [transfers, setTransfers] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('Platform')
  const [teamDevices, setTeamDevices] = useState([])
  const [availableTeams, setAvailableTeams] = useState([])

  useEffect(() => {
    fetchDevices({ team: selectedTeam }).then(d => setTeamDevices(d))
  }, [selectedTeam])


  useEffect(() => {
    fetchDashboard().then(setStats)
    fetchTransfers().then(t => setTransfers(t.slice(0, 5)))
    fetchTeams().then(t => {
      setAvailableTeams(t)
      if (t.length > 0 && !selectedTeam) setSelectedTeam(t[0])
    })
  }, [])

  if (!stats) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Asset management overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon="🖥️" label="Total Devices" value={stats.total_devices} color="indigo" />
        <StatCard icon="✅" label="In Use" value={stats.in_use_devices} color="cyan" />
        <StatCard icon="📦" label="Available" value={stats.available_devices} color="emerald" />
        <StatCard icon="🔧" label="Maintenance" value={stats.maintenance_devices} color="amber" />
        <StatCard icon="🔄" label="Pending Transfers" value={stats.pending_transfers} color="violet" />
      </div>

      {/* Distribution cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Board Distribution */}
        <div className="bg-[#09090b] border border-white/5 shadow-sm shadow-black/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Target Board Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">ERD</span>
                <span className="text-blue-400 font-semibold">{stats.erd_count}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${(stats.erd_count / stats.total_devices) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">SMDK</span>
                <span className="text-slate-400 font-semibold">{stats.smdk_count}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all duration-700"
                  style={{ width: `${(stats.smdk_count / stats.total_devices) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-[#09090b] border border-white/5 shadow-sm shadow-black/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Device Status Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'In Use', value: stats.in_use_devices, icon: '🟢', pct: ((stats.in_use_devices / stats.total_devices) * 100).toFixed(0) },
              { label: 'Available', value: stats.available_devices, icon: '🔵', pct: ((stats.available_devices / stats.total_devices) * 100).toFixed(0) },
              { label: 'Maintenance', value: stats.maintenance_devices, icon: '🟡', pct: ((stats.maintenance_devices / stats.total_devices) * 100).toFixed(0) },
              { label: 'Retired', value: stats.retired_devices, icon: '⚫', pct: ((stats.retired_devices / stats.total_devices) * 100).toFixed(0) },
            ].map(s => (
              <div key={s.label} className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{s.icon}</span>
                  <span className="text-sm text-gray-400">{s.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500">{s.pct}% of total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transfers */}
      <div className="bg-[#09090b] border border-white/5 shadow-sm shadow-black/50 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transfer Requests</h3>
        {transfers.length === 0 ? (
          <p className="text-gray-500 text-sm">No transfer requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-white/5">
                  <th className="text-left py-3 px-4 font-medium">Device</th>
                  <th className="text-left py-3 px-4 font-medium">Requester</th>
                  <th className="text-left py-3 px-4 font-medium">Current Holder</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {transfers.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium">{t.device_name}</td>
                    <td className="py-3 px-4">{t.requester_name}</td>
                    <td className="py-3 px-4">{t.holder_name || '—'}</td>
                    <td className="py-3 px-4"><StatusBadge status={t.status} /></td>
                    <td className="py-3 px-4 text-gray-500">{t.created_at ? new Date(t.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Team View */}
      <div className="bg-[#09090b] border border-white/5 shadow-sm shadow-black/50 rounded-2xl p-6 backdrop-blur-sm mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-white">Project Group View</h3>
          <select 
            value={selectedTeam} 
            onChange={e => setSelectedTeam(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-[200px] max-w-[300px]"
          >
            {availableTeams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        
        {teamDevices.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No devices found for this team.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {teamDevices.map(d => (
              <div key={d.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-white">{d.target_board} — {d.asset_device_no}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-xs text-gray-400 font-mono mb-3">{d.serial_number}</p>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Holder:</span><span className="text-gray-300">{d.current_owner_name || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Location:</span><span className="text-slate-400">{d.location || '—'}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
