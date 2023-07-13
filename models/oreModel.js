const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const oreSchema = new Schema({
  oreType_id: { type: String },
  oreType: { type: String },
  remark: { type: String },
});

module.exports = OreType = mongoose.model("oreTypes", oreSchema);
