const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true, default: "Nigeria" },
  postalCode: { type: String },
  views: { type: Number, default: 0 },
  favorite: { type: Boolean, default: false },
  type: { type: String, required: true }, // e.g., apartment, house, commercial, etc.
  status: {
    type: String,
    enum: ["for rent", "for sale", "sold", "rented"],
    default: "for sale",
  },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true }, // in square feet or square meters
  features: {
    airconditioning: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    laundryRoom: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    windowCovering: { type: Boolean, default: false },
    alarm: { type: Boolean, default: false },
    centralHeating: { type: Boolean, default: false },
  }, // an array of property features
  images: { type: Array || String }, // an array of image URLs for the property
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
