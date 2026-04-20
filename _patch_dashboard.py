import sys

with open('client/src/pages/Dashboard.jsx', 'r') as f:
    text = f.read()

# Add fetchDevices to import
text = text.replace("import { fetchDashboard, fetchTransfers } from '../api'", "import { fetchDashboard, fetchTransfers, fetchDevices } from '../api'")

# Add state
state_code = """  const [stats, setStats] = useState(null)
  const [transfers, setTransfers] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('Platform')
  const [teamDevices, setTeamDevices] = useState([])

  useEffect(() => {
    fetchDevices({ team: selectedTeam }).then(d => setTeamDevices(d))
  }, [selectedTeam])
"""
text = text.replace("  const [stats, setStats] = useState(null)\n  const [transfers, setTransfers] = useState([])", state_code)

# Add Team View Section at the end
team_view_code = """
      {/* Team View */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-white">Project Group View</h3>
          <select 
            value={selectedTeam} 
            onChange={e => setSelectedTeam(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-[200px]"
          >
            <option value="Platform">Platform</option>
            <option value="Modem">Modem</option>
            <option value="Camera">Camera</option>
            <option value="Display">Display</option>
            <option value="Audio">Audio</option>
            <option value="Connectivity">Connectivity</option>
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
                    <div className="flex justify-between"><span className="text-gray-500">Location:</span><span className="text-cyan-400">{d.location || '—'}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
"""

text = text.replace("    </div>\n  )\n}", team_view_code + "    </div>\n  )\n}")

with open('client/src/pages/Dashboard.jsx', 'w') as f:
    f.write(text)
