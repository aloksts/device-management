with open('client/src/api.js', 'r') as f:
    text = f.read()

new_functions = """
export async function loginUser(credentials) {
  const res = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function fetchTeams() {
  const res = await fetch(`${BASE}/devices/teams/all`);
  return res.json();
}
"""
text += new_functions

with open('client/src/api.js', 'w') as f:
    f.write(text)
