const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequestSchema = new Schema({
  name:  { type: String, unique: true, required: true },
  ticker: { type: String, required: true },
  minable_via: [ String ],
  link: {type: String, required: true},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema);