with open('client/src/components/TransferModal.jsx', 'r') as f:
    text = f.read()

# Make sure we import auth_user
new_code = """import { useState } from 'react'
import { createTransfer } from '../api'

export default function TransferModal({ device, onClose, onDone }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user.id) return
    setLoading(true)
    await createTransfer({
      device_id: device.id,
      requester_id: user.id,
      notes,
    })
    setLoading(false)
    onDone?.()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-indigo-500/10"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-1">Request Device Transfer</h2>
        <p className="text-sm text-gray-400 mb-6">
          {device.target_board} — {device.asset_device_no}
          {device.status === 'in_use' && (
            <span className="block mt-2 text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">⚠️ Device is in use by {device.current_owner_name}. Your request will be queued.</span>
          )}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Requesting User</label>
            <div className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-gray-200 cursor-not-allowed">
              {user.name} ({user.department})
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Transfer Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              placeholder="Reason for transfer request..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? 'Submitting...' : 'Request Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
"""

with open('client/src/components/TransferModal.jsx', 'w') as f:
    f.write(new_code)
