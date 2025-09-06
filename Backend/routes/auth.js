const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET;

// Helper: Generate JWT
function generateToken(user, role) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role, 
      hasPreferences: user.has_preferences || false 
    }, 
    JWT_SECRET, 
    { expiresIn: '2h' }
  );
}

// Signup (Learner)
router.post('/signup/learner', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    // Start a transaction
    await db.query('BEGIN');
    
    // Insert new learner
    const result = await db.query(
      `INSERT INTO learners (name, email, password_hash, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`,
      [name, email, hash]
    );
    
    // Set has_preferences to false for new users
    const user = { ...result.rows[0], has_preferences: false };
    const token = generateToken(user, 'learner');
    
    await db.query('COMMIT');
    res.json({ token, hasPreferences: false });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed', details: err.message });
  }
});

// Signup (Admin)
router.post('/signup/admin', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO admins (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, email, hash]
    );
    const token = generateToken(result.rows[0], 'admin');
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed', details: err.message });
  }
});

// Login (Learner)
router.post('/login/learner', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Get user and check if they have set preferences
    const result = await db.query(
      `SELECT l.*, 
       EXISTS(SELECT 1 FROM learner_preferences WHERE learner_id = l.id) as has_preferences 
       FROM learners l 
       WHERE l.email = $1`, 
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user, 'learner');
    res.json({ token, hasPreferences: user.has_preferences });
  } catch (err) {
    res.status(400).json({ error: 'Login failed', details: err.message });
  }
});

// Login (Admin)
router.post('/login/admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user, 'admin');
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: 'Login failed', details: err.message });
  }
});

// Protected Profile Route
router.get('/profile', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
