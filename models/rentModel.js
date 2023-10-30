const mongoose = require("mongoose");

const rentRecordSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rentStartDate: { type: Date, required: true },
  rentEndDate: { type: Date, required: true },
  monthlyRentAmount: {
    type: Number,
    required: true,
    default: function () {
      // Calculate the monthly rent amount based on property price divided by 12
      return this.property.price / 12;
    },
  },
  securityDeposit: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const RentRecord = mongoose.model("RentRecord", rentRecordSchema);
module.exports = RentRecord;
