const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// send message
router.post('/', auth, async (req, res) => {
  const { toUserId, itemId, text } = req.body;
  const msg = new Message({ from: req.user._id, to: toUserId, item: itemId, text });
  await msg.save();
  // Optionally emit socket.io event (server should have io)
  res.json(msg);
});

// get messages for conversation
router.get('/conversation/:userId', auth, async (req, res) => {
  const otherId = req.params.userId;
  const msgs = await Message.find({
    $or: [
      { from: req.user._id, to: otherId },
      { from: otherId, to: req.user._id }
    ]
  }).sort('createdAt');
  res.json(msgs);
});

module.exports = router;
