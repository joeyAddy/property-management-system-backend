const mongoose = require("mongoose");

const buyoutRecordSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  buyoutDate: { type: Date, required: true },
  buyoutAmount: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false }, // Indicates whether the buyout is completed or not
  createdAt: { type: Date, default: Date.now },
});

const BuyoutRecord = mongoose.model("BuyoutRecord", buyoutRecordSchema);
module.exports = BuyoutRecord;
