with open('client/src/App.jsx', 'r') as f:
    text = f.read()

target1 = "import Users from './pages/Users'"
replacement1 = "import Users from './pages/Users'\nimport Login from './pages/Login'\nimport { useState, useEffect } from 'react'"

target2 = "const links = ["
replacement2 = """
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
"""

# Replace the component signature we just injected manually above
# So we need to remove `export default function App() {` from the old one
target3 = "export default function App() {\n  return (\n"
replacement3 = "  return (\n"

text = text.replace(target1, replacement1).replace(target2, replacement2).replace(target3, replacement3)

# Update sidebar User Info and Logout capability
old_user_info = """<div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold">A</div>
            <div>
              <p className="text-sm font-medium text-gray-300">Admin</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>"""
new_user_info = """<div className="flex items-center justify-between px-3 w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg">
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
          </div>"""

text = text.replace(old_user_info, new_user_info)

with open('client/src/App.jsx', 'w') as f:
    f.write(text)
