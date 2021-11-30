const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name:  { type: String, unique: true, required: true }, // String is shorthand for {type: String}
  ticker: { type: String, required: true },
  link: { type: String},
  date: { type: Date, default: Date.now },
  hidden: { type: Boolean, default: false },
  meta: {
    votes: { type: Number, default: 0 },
    favs:  [String]
  }
});

module.exports = mongoose.model('Project', ProjectSchema);