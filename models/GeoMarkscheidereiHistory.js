const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const markscheidereiHistorySchema = new Schema({
  east: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  north: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  elev: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  length: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  category: {
    value: { type: String, default: '' },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  to: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  azimut: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  dip: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  geology: {
    type: mongoose.Types.ObjectId,
    ref: 'geologies'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  reg_date: {
    type: Date,
    default: Date.now()
  },
  comment: {
    type: String,
    default: ''
  }
});

module.exports = GeoMarkscheiderei = mongoose.model("geomarkscheidereis", markscheidereiHistorySchema);
