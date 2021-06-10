const mongoose = require("mongoose");

const requiredString = {
  type: String,
  required: true,
};

const weightSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Weight = mongoose.model("weight", weightSchema);

module.exports = { Weight };
