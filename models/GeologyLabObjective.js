const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const geologyLabObjectiveSchema = new Schema({
  objective: {
    type: mongoose.Types.ObjectId,
    ref: 'objectives'
  },
  unit: {
    type: mongoose.Types.ObjectId,
    ref: 'units'
  }
});

module.exports = GeologyLabObjective = mongoose.model("geology_lab_objectives", geologyLabObjectiveSchema);
