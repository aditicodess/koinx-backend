const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    userAddress: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
      // required: true,
    },
    hash: {
      type: String,
      // required: true,
    },
    blockHash: {
      type: String,
      // required: true,
    },
    from: {
      type: String,
      // required: true,
    },
    to: {
      type: String,
      // required: true,
    },
    value: {
      type: Number,
      // required: true,
    },
    gasUsed: {
      type: Number,
      // required: true,
    },
    gasPrice: {
      type: Number,
      // required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = Transaction;
