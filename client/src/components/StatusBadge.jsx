const styles = {
  available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  in_use: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  maintenance: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  retired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  queued: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

export default function StatusBadge({ status }) {
  const cls = styles[status] || styles.available
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}
