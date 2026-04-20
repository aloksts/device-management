import { useState, useEffect } from 'react'
import { fetchUsers } from '../api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers().then(u => {
      setUsers(u)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-400 mt-1">Directory of team members and device counts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center p-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          users.map(u => (
            <div key={u.id} className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm hover:-translate-y-1 hover:border-white/10 transition-all cursor-default relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-4 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-lg font-bold text-white">
                  {u.name.charAt(0)}
                </div>
                {u.role === 'admin' && (
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-wider uppercase rounded-md border border-amber-500/20">Admin</span>
                )}
              </div>
              
              <div className="relative">
                <h3 className="text-lg font-bold text-white">{u.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{u.email}</p>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> {u.department} Team
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-xs text-gray-400">Devices:</span>
                    <span className="text-sm font-bold text-white">{u.device_count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
