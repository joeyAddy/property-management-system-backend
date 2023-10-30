// models/profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: "NIL",
  },
  photo: {
    type: String,
  },
  // Add any other fields relevant to the user's profile
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
