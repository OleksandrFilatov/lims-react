const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const generalHistorySchema = new Schema({
  hole_id: {
    value: { type: String, default: '' },
    reason: { type: mongoose.Types.ObjectId, ref: 'reasons', default: null }
  },
  materialType: {
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

module.exports = GeoGeneral = mongoose.model("geogenerals", generalHistorySchema);
