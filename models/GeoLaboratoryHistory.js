const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const laboratoryHistorySchema = new Schema({
  date: {
    value: { type: Date, default: Date.now() },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  level: {
    value: { type: String, default: '' },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  subset: {
    value: { type: String, default: '' },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  thickness: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  distance: {
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  objective_values: [{
    obj: { type: mongoose.Types.ObjectId, ref: 'geology_lab_objectives', default: null },
    analysisType: { type: mongoose.Types.ObjectId, ref: 'analysisTypes', default: null },
    value: { type: Number, default: 0 },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  }],
  weight: {
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
    type: String, default: ''
  }
});

module.exports = GeoLaboratory = mongoose.model("geolaboratories", laboratoryHistorySchema);
