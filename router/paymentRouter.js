const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController");

// Route to initiate payment
router.post("/initiate", PaymentController.initiatePayment);

// Route to handle payment callback
router.get("/callback", PaymentController.handlePaymentCallback);

module.exports = router;
