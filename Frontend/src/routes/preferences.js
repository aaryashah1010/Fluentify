// API calls for learner preferences

export async function getLearnerPreferences(token) {
  const res = await fetch('/api/preferences/learner', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

export async function saveLearnerPreferences(token, preferences) {
  const res = await fetch('/api/preferences/learner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(preferences),
  });
  return res.json();
}
