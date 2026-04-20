with open('client/src/index.css', 'r') as f:
    text = f.read()

target = "@apply bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-gray-100 min-h-screen font-sans antialiased;"
replacement = "@apply bg-[#030712] text-slate-300 min-h-screen font-sans antialiased selection:bg-blue-500/30;"
text = text.replace(target, replacement)

with open('client/src/index.css', 'w') as f:
    f.write(text)

# Clean up App.jsx
with open('client/src/App.jsx', 'r') as f:
    app_text = f.read()
app_text = app_text.replace("bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent", "text-slate-100")
app_text = app_text.replace("bg-slate-950/70 backdrop-blur-xl border-r border-white/5", "bg-[#09090b] border-r border-white/5")
app_text = app_text.replace("bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10", "bg-slate-800/80 text-white shadow-sm")
app_text = app_text.replace("bg-gradient-to-br from-indigo-500 to-cyan-500", "bg-blue-600")

with open('client/src/App.jsx', 'w') as f:
    f.write(app_text)

# Clean up Login.jsx
with open('client/src/pages/Login.jsx', 'r') as f:
    login_text = f.read()
login_text = login_text.replace("bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent", "text-slate-100")
login_text = login_text.replace("bg-slate-950", "bg-[#030712]")
login_text = login_text.replace("bg-slate-900", "bg-[#09090b]")
login_text = login_text.replace("bg-gradient-to-r from-indigo-500 to-cyan-500", "bg-white text-black hover:bg-slate-200")
login_text = login_text.replace("text-white font-bold", "font-semibold text-black")

with open('client/src/pages/Login.jsx', 'w') as f:
    f.write(login_text)

# Clean up Dashboard.jsx charts
with open('client/src/pages/Dashboard.jsx', 'r') as f:
    dash_text = f.read()
dash_text = dash_text.replace("from-indigo-500 to-indigo-400", "from-blue-600 to-blue-500")
dash_text = dash_text.replace("from-cyan-500 to-cyan-400", "from-slate-400 to-slate-500")
dash_text = dash_text.replace("text-indigo-400", "text-blue-400")
dash_text = dash_text.replace("text-cyan-400", "text-slate-400")
dash_text = dash_text.replace("bg-slate-900/60", "bg-[#09090b]")
dash_text = dash_text.replace("bg-[#09090b] border border-white/5", "bg-[#09090b] border border-white/5 shadow-sm shadow-black/50")

with open('client/src/pages/Dashboard.jsx', 'w') as f:
    f.write(dash_text)
