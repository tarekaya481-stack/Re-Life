const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: String,
  imagePublicId: String, // if using cloudinary
  condition: { type: String, enum: ['new','like_new','used','worn'], default: 'used' },
  category: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

ItemSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Item', ItemSchema);
