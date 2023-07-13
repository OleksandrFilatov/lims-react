const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const geologyHistorySchema = new Schema({
  sample: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  from: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  to: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  oreType: {
    value: { type: mongoose.Types.ObjectId, ref: 'oreTypes', default: null },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  thk: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  rxqual: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  fest: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  locker: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  sanding: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  drills: {
    value: { type: String, default: '' },
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

module.exports = GeoGeology = mongoose.model("geogeologies", geologyHistorySchema);
