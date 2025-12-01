const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

router.post('/:id/rate', auth, async (req, res) => {
  const { rating } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  await user.addRating(parseFloat(rating));
  res.json({ rating: user.rating, ratingCount: user.ratingCount });
});

module.exports = router;
