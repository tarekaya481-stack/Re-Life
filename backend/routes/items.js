const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');
const { upload, uploadToCloudinary } = require('../utils/upload');

// create item (with image)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, condition, category, lat, lng } = req.body;
    let imageUrl, imagePublicId;
    if (req.file && process.env.CLOUDINARY_API_KEY) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    } else if (req.file) {
      // fallback: save locally (not implemented fully here) - for production prefer cloud
      imageUrl = `/uploads/${Date.now()}_${req.file.originalname}`;
      // would need to actually write buffer to that path
    }

    const item = new Item({
      title,
      description,
      imageUrl,
      imagePublicId,
      condition,
      category,
      owner: req.user._id,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }
    });
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get items near a point (radius in meters)
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 5000, category } = req.query;
  if (!lat || !lng) return res.status(400).json({ msg: 'lat and lng required' });

  const query = {
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(radius)
      }
    },
    isAvailable: true
  };
  if (category) query.category = category;

  const items = await Item.find(query).populate('owner', 'name rating avatar');
  res.json(items);
});

// get item by id
router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id).populate('owner', 'name rating avatar');
  if (!item) return res.status(404).json({ msg: 'Item not found' });
  res.json(item);
});

// mark as taken
router.post('/:id/take', auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ msg: 'Item not found' });
  if (!item.isAvailable) return res.status(400).json({ msg: 'Item already taken' });

  item.isAvailable = false;
  await item.save();
  // create a system message or notification to owner (not included)
  res.json({ msg: 'Success', item });
});

module.exports = router;
