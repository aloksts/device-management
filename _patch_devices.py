with open('client/src/pages/Devices.jsx', 'r') as f:
    text = f.read()

target = "const [showAddModal, setShowAddModal] = useState(false)"
replacement = "const [showAddModal, setShowAddModal] = useState(false)\n  const user = JSON.parse(localStorage.getItem('auth_user') || '{}')"
text = text.replace(target, replacement)

target2 = """<button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2"
          >
            <span>+</span> Add Device
          </button>"""
replacement2 = """{user.role === 'admin' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2"
          >
            <span>+</span> Add Device
          </button>
        )}"""
text = text.replace(target2, replacement2)

with open('client/src/pages/Devices.jsx', 'w') as f:
    f.write(text)
