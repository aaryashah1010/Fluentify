const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

// Save learner preferences (protected, only for learners)
router.post('/learner', authMiddleware, async (req, res) => {
  const { language, expected_duration } = req.body;
  const { id, role } = req.user;
  if (role !== 'learner') return res.status(403).json({ error: 'Only learners can set preferences' });
  try {
    await db.query(
      'INSERT INTO learner_preferences (learner_id, language, expected_duration) VALUES ($1, $2, $3)',
      [id, language, expected_duration]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Could not save preferences', details: err.message });
  }
});

// Get learner preferences (protected, only for learners)
router.get('/learner', authMiddleware, async (req, res) => {
  const { id, role } = req.user;
  if (role !== 'learner') return res.status(403).json({ error: 'Only learners can view preferences' });
  try {
    const result = await db.query('SELECT * FROM learner_preferences WHERE learner_id = $1', [id]);
    res.json({ preferences: result.rows });
  } catch (err) {
    res.status(400).json({ error: 'Could not fetch preferences', details: err.message });
  }
});

module.exports = router;
