const axios = require("axios");
const Payment = require("../models/paymentModel");

// Function to handle success responses
const sendSuccessResponse = (res, data, message, statusCode) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Function to handle error responses
const sendErrorResponse = (res, errorMessage, statusCode) => {
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
};

// Function to initiate payment with Paystack
exports.initiatePayment = async (req, res) => {
  try {
    const { user, property, amount } = req.body;
    const paymentMethod = "card"; // You can customize the payment method

    // Make an API request to Paystack to initialize the payment
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: amount * 100, // Paystack expects the amount in kobo (1 naira = 100 kobo)
        callback_url: "https://your-callback-url.com", // Replace with your callback URL
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Replace with your Paystack secret key
        },
      }
    );

    // Save the payment details in your database
    const newPayment = new Payment({
      user: user._id,
      property: property._id,
      amount,
      status: "pending",
      paymentMethod,
      transactionId: response.data.data.reference,
    });
    await newPayment.save();

    // Return the payment authorization URL to the frontend
    sendSuccessResponse(
      res,
      { authorization_url: response.data.data.authorization_url },
      "Payment initiated.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to initiate payment.", 500);
  }
};

// Function to handle payment callback from Paystack
exports.handlePaymentCallback = async (req, res) => {
  try {
    const { reference } = req.query;

    // Make an API request to Paystack to verify the payment status
    const verifyResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Replace with your Paystack secret key
        },
      }
    );

    const paymentData = verifyResponse.data.data;
    if (paymentData.status === "success") {
      // Payment was successful, update payment status in your database
      const updatedPayment = await Payment.findOneAndUpdate(
        { transactionId: reference },
        { status: "success", paymentData: verifyResponse.data },
        { new: true }
      );

      // You can perform additional actions here, e.g., send a confirmation email or update property status

      sendSuccessResponse(res, updatedPayment, "Payment successful.", 200);
    } else {
      // Payment failed, update payment status in your database
      const updatedPayment = await Payment.findOneAndUpdate(
        { transactionId: reference },
        { status: "failed", paymentData: verifyResponse.data },
        { new: true }
      );

      sendErrorResponse(res, "Payment failed.", 400);
    }
  } catch (error) {
    sendErrorResponse(res, "Failed to handle payment callback.", 500);
  }
};
