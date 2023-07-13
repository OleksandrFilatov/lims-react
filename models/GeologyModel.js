const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const geologySchema = new Schema({
  geology_id: {
    type: Number,
    default: -1
  },
  general: {
    type: mongoose.Types.ObjectId,
    ref: 'geogenerals',
    default: null
  },
  markscheiderei: {
    type: mongoose.Types.ObjectId,
    ref: 'geomarkscheidereis',
    default: null
  },
  laboratory: {
    type: mongoose.Types.ObjectId,
    ref: 'geolaboratories',
    default: null
  },
  geology: {
    type: mongoose.Types.ObjectId,
    ref: 'geogeologies',
    default: null
  },
  check_status: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Geology = mongoose.model("geologies", geologySchema);
