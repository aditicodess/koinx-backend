const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ethereumSchema = new Schema(
  {
    ethereumPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Ethereum = mongoose.model("ethereum", ethereumSchema);
module.exports = Ethereum;
