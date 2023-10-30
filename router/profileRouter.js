const express = require("express");
const router = express.Router();
const { createOrUpdateProfile } = require("../controllers/profileController");

// POST route to create a new profile or update an existing profile
router.post("/", createOrUpdateProfile);

module.exports = router;
