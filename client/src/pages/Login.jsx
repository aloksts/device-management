import { useState } from 'react'
import { loginUser } from '../api'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await loginUser({ email, password })
      localStorage.setItem('auth_user', JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      setError('Invalid credentials. Try admin/admin or user/user.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100">
            🛡️ Asset Tracker
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to manage devices</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl text-sm text-center border border-rose-500/20">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username / Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black hover:bg-slate-200 rounded-xl font-semibold text-black hover:opacity-90 transition-opacity mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">Hint: Try <strong>admin/admin</strong> or <strong>user/user</strong></p>
        </div>
      </div>
    </div>
  )
}
