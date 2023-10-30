const express = require("express");
const {
  signUp,
  logIn,
  getAllUser,
  restrictTo,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", protect, updatePassword);

// Protect all routes after this (Only-Admin) middleware
router.use(protect);
router.use(restrictTo("admin"));
router.route("/").get(getAllUser);

module.exports = router;
