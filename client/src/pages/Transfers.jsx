import { useState, useEffect } from 'react'
import { fetchTransfers, approveTransfer, rejectTransfer } from '../api'
import StatusBadge from '../components/StatusBadge'

export default function Transfers() {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetchTransfers().then(t => {
      setTransfers(t)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (id) => {
    if (!confirm('Approve transfer and hand over device?')) return
    await approveTransfer(id)
    load()
  }

  const handleReject = async (id) => {
    if (!confirm('Reject transfer request?')) return
    await rejectTransfer(id)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Transfers</h1>
        <p className="text-gray-400 mt-1">Manage device handovers and queues</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Transfer Requests Activity</h3>
            {loading ? (
              <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : transfers.length === 0 ? (
              <p className="text-gray-500 py-12 text-center text-sm">No transfer requests to display.</p>
            ) : (
              <div className="space-y-4">
                {transfers.map(t => (
                  <div key={t.id} className="bg-slate-950/50 border border-white/5 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-white/10 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-white">{t.device_name}</span>
                        <StatusBadge status={t.status} />
                        {t.status === 'queued' && (
                          <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full font-medium">Queue Pos: {t.priority}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500">Requester:</span> <span className="text-gray-200">{t.requester_name}</span>
                        </div>
                        {t.holder_name && (
                          <>
                            <span className="text-gray-600">→</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-500">Current Holder:</span> <span className="text-gray-200">{t.holder_name}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {t.notes && <p className="text-sm text-gray-500 mt-3 bg-white/5 p-3 rounded-lg">"{t.notes}"</p>}
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-32 shrink-0">
                      {t.status === 'pending' ? (
                        <>
                          <button onClick={() => handleApprove(t.id)} className="w-full px-3 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/20 transition-colors">
                            Approve & Yield
                          </button>
                          <button onClick={() => handleReject(t.id)} className="w-full px-3 py-2 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-lg hover:bg-rose-500/20 transition-colors">
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-xs text-gray-500">
                          {t.resolved_at ? (
                            <>Resolved:<br/>{new Date(t.resolved_at).toLocaleDateString()}</>
                          ) : (
                            <>Requested:<br/>{new Date(t.created_at).toLocaleDateString()}</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">ℹ️</span> Workflow Helper
            </h3>
            <div className="text-sm text-gray-300 space-y-4">
              <p>When a device is marked as <strong>Available</strong>, requesting it will automatically assign it to you.</p>
              <p>If the device is <strong>In Use</strong>, your request becomes <strong>Pending</strong>.</p>
              <p>The <strong>Current Holder</strong> decides whether to <strong>Approve</strong> your request (yielding the device) or <strong>Reject</strong> it.</p>
              <p>If multiple people request an in-use device, subsequent requests are placed in the <strong>Queue</strong>, automatically advancing when the current holder yields the device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
