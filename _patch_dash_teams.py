with open('client/src/pages/Dashboard.jsx', 'r') as f:
    text = f.read()

# Add getTeams
target1 = "import { fetchDashboard, fetchTransfers, fetchDevices } from '../api'"
replacement1 = "import { fetchDashboard, fetchTransfers, fetchDevices, fetchTeams } from '../api'"
text = text.replace(target1, replacement1)

target2 = "const [teamDevices, setTeamDevices] = useState([])"
replacement2 = "const [teamDevices, setTeamDevices] = useState([])\n  const [availableTeams, setAvailableTeams] = useState([])"
text = text.replace(target2, replacement2)

target3 = """  useEffect(() => {
    fetchDashboard().then(setStats)
    fetchTransfers().then(t => setTransfers(t.slice(0, 5)))
  }, [])"""
replacement3 = """  useEffect(() => {
    fetchDashboard().then(setStats)
    fetchTransfers().then(t => setTransfers(t.slice(0, 5)))
    fetchTeams().then(t => {
      setAvailableTeams(t)
      if (t.length > 0 && !selectedTeam) setSelectedTeam(t[0])
    })
  }, [])"""
text = text.replace(target3, replacement3)

target4 = """          <select 
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
          </select>"""
replacement4 = """          <select 
            value={selectedTeam} 
            onChange={e => setSelectedTeam(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-[200px] max-w-[300px]"
          >
            {availableTeams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>"""
text = text.replace(target4, replacement4)

with open('client/src/pages/Dashboard.jsx', 'w') as f:
    f.write(text)
