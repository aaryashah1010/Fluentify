
export async function login(role, email, password) {
  const res = await fetch(`/api/auth/login/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function signup(role, name, email, password) {
  const res = await fetch(`/api/auth/signup/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function getProfile(token) {
  const res = await fetch('/api/auth/profile', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}
