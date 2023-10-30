const BuyOut = require("../models/buyOutModel");

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

// Create a new buyout record
exports.createBuyOut = async (req, res) => {
  try {
    const buyoutData = req.body;
    const newBuyOut = await BuyOut.create(buyoutData);
    sendSuccessResponse(
      res,
      newBuyOut,
      "Buyout record created successfully.",
      201
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to create buyout record.", 500);
  }
};

// Delete a buyout record by ID
exports.deleteBuyOut = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBuyOut = await BuyOut.findByIdAndDelete(id);
    if (!deletedBuyOut) {
      return sendErrorResponse(res, "Buyout record not found.", 404);
    }
    sendSuccessResponse(
      res,
      deletedBuyOut,
      "Buyout record deleted successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to delete buyout record.", 500);
  }
};

// Get all buyout records
exports.getAllBuyOuts = async (req, res) => {
  try {
    const buyOuts = await BuyOut.find();
    sendSuccessResponse(
      res,
      buyOuts,
      "Buyout records retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get buyout records.", 500);
  }
};

// Get a buyout record by ID
exports.getBuyOutById = async (req, res) => {
  try {
    const { id } = req.params;
    const buyOut = await BuyOut.findById(id);
    if (!buyOut) {
      return sendErrorResponse(res, "Buyout record not found.", 404);
    }
    sendSuccessResponse(
      res,
      buyOut,
      "Buyout record retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get buyout record.", 500);
  }
};
