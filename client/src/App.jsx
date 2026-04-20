import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import Transfers from './pages/Transfers'
import Users from './pages/Users'
import Login from './pages/Login'
import { useState } from 'react'

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })

  // Prevent accessing if not logged in
  if (!user) {
    return <Login onLogin={setUser} />
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
            <button onClick={() => { localStorage.removeItem('auth_user'); setUser(null); }} className="text-gray-500 hover:text-rose-400 transition-colors" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
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
