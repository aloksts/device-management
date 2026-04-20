import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import Transfers from './pages/Transfers'
import Users from './pages/Users'

import { useState } from 'react'

export default function App() {
  const adminProfile = { id: 1, name: "View as Admin", email: "admin", role: "admin", department: "Demo" }
  const userProfile = { id: 2, name: "View as User", email: "user", role: "member", department: "Demo" }
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : adminProfile
  })

  const toggleRole = () => {
    const newProfile = user.role === 'admin' ? userProfile : adminProfile
    localStorage.setItem('auth_user', JSON.stringify(newProfile))
    setUser(newProfile)
    // small reload to clear states
    window.location.reload()
  }

  const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/devices', label: 'Devices', icon: '🖥️' },
    { to: '/transfers', label: 'Transfers', icon: '🔄' },
  ]
  
  if (user.role === 'admin') {
    links.push({ to: '/users', label: 'Users', icon: '👥' })
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#09090b] border-r border-white/5 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold text-slate-100">
            🛡️ Asset Tracker
          </h1>
          <p className="text-xs text-gray-500 mt-1">Device Management System</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800/80 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              <span className="text-lg">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between px-3 w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-200 truncate">{user.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
            </div>
            <button onClick={toggleRole} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors text-xs bg-indigo-500/20 px-2 py-1 rounded" title="Toggle Role">
              Swap
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
