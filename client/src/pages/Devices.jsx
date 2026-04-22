import React, { useState, useEffect } from 'react'
import { fetchDevices, createDevice } from '../api'
import StatusBadge from '../components/StatusBadge'
import TransferModal from '../components/TransferModal'

// New Add Device Modal Component
function AddDeviceModal({ onClose, onDone }) {
  const [formData, setFormData] = useState({
    target_board: 'ERD',
    asset_device_no: '',
    serial_number: '',
    sample_number: '',
    project_team: 'Platform',
    hw_revision: '',
    mac_address: '',
    ram_size: '',
    storage_capacity: '',
    os_version: '',
    location: '',
    acquired_date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await createDevice(formData)
    setLoading(false)
    onDone?.()
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-2xl my-8 relative" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6">Register New Device</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target Board</label>
              <select name="target_board" value={formData.target_board} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200">
                <option value="ERD">ERD</option>
                <option value="SMDK">SMDK</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Project Team</label>
              <select name="project_team" value={formData.project_team} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200">
                <option value="Platform">Platform</option>
                <option value="Modem">Modem</option>
                <option value="Camera">Camera</option>
                <option value="Display">Display</option>
                <option value="Audio">Audio</option>
                <option value="Connectivity">Connectivity</option>
              </select>
            </div>
            
            <div><label className="block text-xs font-medium text-gray-400 mb-1">Asset Device No</label><input required name="asset_device_no" value={formData.asset_device_no} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="e.g. ERD-011"/></div>
            <div><label className="block text-xs font-medium text-gray-400 mb-1">Serial Number</label><input required name="serial_number" value={formData.serial_number} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="e.g. SN-E011"/></div>
            
            <div><label className="block text-xs font-medium text-gray-400 mb-1">HW Revision</label><input name="hw_revision" value={formData.hw_revision} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="v1.0"/></div>
            <div><label className="block text-xs font-medium text-gray-400 mb-1">Sample Number</label><input name="sample_number" value={formData.sample_number} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="S1"/></div>
            
            <div><label className="block text-xs font-medium text-gray-400 mb-1">MAC Address</label><input name="mac_address" value={formData.mac_address} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="00:1B:44:11:3A:B7"/></div>
            <div><label className="block text-xs font-medium text-gray-400 mb-1">RAM Size</label><input name="ram_size" value={formData.ram_size} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="16GB"/></div>
            
            <div><label className="block text-xs font-medium text-gray-400 mb-1">Storage Capacity</label><input name="storage_capacity" value={formData.storage_capacity} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="256GB"/></div>
            <div><label className="block text-xs font-medium text-gray-400 mb-1">OS / Firmware Version</label><input name="os_version" value={formData.os_version} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="Android 15"/></div>
            
            <div><label className="block text-xs font-medium text-gray-400 mb-1">Location</label><input name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" placeholder="Lab A"/></div>
            <div><label className="block text-xs font-medium text-gray-400 mb-1">Acquired Date</label><input type="date" required name="acquired_date" value={formData.acquired_date} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200" /></div>
          </div>
          
          <div className="flex gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">{loading ? 'Adding...' : 'Add Device'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Devices() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState(null)
  const [transferDevice, setTransferDevice] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}')

  const [filterBoard, setFilterBoard] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const load = () => {
    setLoading(true)
    fetchDevices({ board: filterBoard, status: filterStatus }).then(d => {
      setDevices(d)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [filterBoard, filterStatus])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Devices</h1>
          <p className="text-gray-400 mt-1">Manage target boards and SMDKs</p>
        </div>
        <div className="flex gap-3">
          {user.role === 'admin' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2"
          >
            <span>+</span> Add Device
          </button>
        )}
          <select
            value={filterBoard}
            onChange={e => setFilterBoard(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">All Boards</option>
            <option value="ERD">ERD</option>
            <option value="SMDK">SMDK</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/5 bg-white/[0.02]">
                  <th className="w-8 py-4 px-4"></th>
                  <th className="text-left py-4 px-4 font-medium">Device Asset NO</th>
                  <th className="text-left py-4 px-4 font-medium">S/N</th>
                  <th className="text-left py-4 px-4 font-medium">Team</th>
                  <th className="text-left py-4 px-4 font-medium">Owner</th>
                  <th className="text-left py-4 px-4 font-medium">Current Holder</th>
                  <th className="text-left py-4 px-4 font-medium">Days Held</th>
                  <th className="text-left py-4 px-4 font-medium">Status</th>
                  <th className="text-right py-4 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {devices.map(d => (
                  <React.Fragment key={d.id}>
                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setExpandedRow(expandedRow === d.id ? null : d.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-500 group-hover:text-white transition-all disabled:opacity-0"
                        >
                          {expandedRow === d.id ? '▼' : '▶'}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        <div className="flex gap-2 items-center">
                          <span className="text-xl">{d.target_board === 'ERD' ? '📱' : '💻'}</span>
                          {d.target_board} — {d.asset_device_no}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-gray-500">{d.serial_number}</td>
                      <td className="py-3 px-4">{d.project_team}</td>
                      <td className="py-3 px-4">{d.owner_name}</td>
                      <td className="py-3 px-4">{d.current_owner_name || '—'}</td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                        {d.status === 'in_use' && d.assignment_date 
                          ? Math.floor((new Date() - new Date(d.assignment_date)) / (1000 * 60 * 60 * 24)) + 'd'
                          : '—'}
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={d.status} /></td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setTransferDevice(d)}
                          disabled={d.status === 'retired' || d.status === 'maintenance'}
                          className="px-3 py-1.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Request Transfer
                        </button>
                      </td>
                    </tr>
                    {expandedRow === d.id && (
                      <tr className="bg-white/[0.01] border-b border-white/5">
                        <td colSpan={9} className="py-4 px-6 sm:px-12">
                          <div className="flex flex-col xl:flex-row gap-8">
                            <div className="space-y-6 flex-1">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hardware Specifications</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                  <div><span className="block text-xs text-gray-500 mb-0.5">HW Revision</span><span className="text-sm font-medium">{d.hw_revision || '—'}</span></div>
                                  <div><span className="block text-xs text-gray-500 mb-0.5">MAC Address</span><span className="text-sm font-mono">{d.mac_address || '—'}</span></div>
                                  <div><span className="block text-xs text-gray-500 mb-0.5">RAM</span><span className="text-sm">{d.ram_size || '—'}</span></div>
                                  <div><span className="block text-xs text-gray-500 mb-0.5">Storage</span><span className="text-sm">{d.storage_capacity || '—'}</span></div>
                                  <div><span className="block text-xs text-gray-500 mb-0.5">OS / Firmware</span><span className="text-sm">{d.os_version || '—'}</span></div>
                                  <div><span className="block text-xs text-gray-500 mb-0.5">Physical Location</span><span className="text-sm text-cyan-300">{d.location || '—'}</span></div>
                                </div>
                              </div>
                              <div className="pt-4 border-t border-white/5">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Summary / Notes</h4>
                                <p className="text-sm text-gray-300">{d.summary || 'No summary available.'}</p>
                              </div>
                            </div>
                            <div className="w-full xl:w-64 bg-slate-950/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between shrink-0 h-full">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lifecycle</h4>
                                <div className="space-y-3 text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Sample No:</span>
                                    <span className="font-mono">{d.sample_number || 'N/A'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Board Type:</span>
                                    <span className="font-medium bg-white/5 px-2 py-0.5 rounded text-gray-300">{d.target_board}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Acquired:</span>
                                    <span className="font-medium text-emerald-400">{d.acquired_date}</span>
                                  </div>
                                  {d.release_date && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400">Released:</span>
                                      <span className="font-medium text-rose-400">{d.release_date}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {transferDevice && (
        <TransferModal
          device={transferDevice}
          onClose={() => setTransferDevice(null)}
          onDone={() => {
            setTransferDevice(null)
            load()
          }}
        />
      )}
      
      {showAddModal && (
        <AddDeviceModal 
          onClose={() => setShowAddModal(false)} 
          onDone={() => {
            setShowAddModal(false)
            load()
          }} 
        />
      )}
    </div>
  )
}
