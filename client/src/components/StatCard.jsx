export default function StatCard({ icon, label, value, color = 'indigo', sub }) {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-300',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-300',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-300',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-300',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-300',
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/20 text-violet-300',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-6 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300 cursor-default`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {sub && <span className="text-xs text-gray-500">{sub}</span>}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  )
}
