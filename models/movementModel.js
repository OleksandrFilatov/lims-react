const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movementSchema = new Schema({
  geology_id: { type: mongoose.Types.ObjectId, ref: 'geologies' },
  from: { type: String, default: 'Input Required' },
  to: { type: String, default: 'Check' },
  reason: { type: String, default: '' },
  user: { type: mongoose.Types.ObjectId, ref: 'users' },
  date: { type: Date, default: Date.now() }
});

module.exports = MovementHistory = mongoose.model("movementHistories", movementSchema);
