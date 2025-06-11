const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age:   { type: Number, min: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Person', personSchema);
