const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.methods.addRating = function (rating) {
  this.rating = (this.rating * this.ratingCount + rating) / (this.ratingCount + 1);
  this.ratingCount += 1;
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);
