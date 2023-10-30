const RentRecord = require("../models/rentModel");

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

// Create a new rent record
exports.createRentRecord = async (req, res) => {
  try {
    const rentData = req.body;
    const newRentRecord = await RentRecord.create(rentData);
    sendSuccessResponse(
      res,
      newRentRecord,
      "Rent record created successfully.",
      201
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to create rent record.", 500);
  }
};

// Delete a rent record by ID
exports.deleteRentRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRentRecord = await RentRecord.findByIdAndDelete(id);
    if (!deletedRentRecord) {
      return sendErrorResponse(res, "Rent record not found.", 404);
    }
    sendSuccessResponse(
      res,
      deletedRentRecord,
      "Rent record deleted successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to delete rent record.", 500);
  }
};

// Get all rent records
exports.getAllRentRecords = async (req, res) => {
  try {
    const rentRecords = await RentRecord.find();
    sendSuccessResponse(
      res,
      rentRecords,
      "Rent records retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get rent records.", 500);
  }
};

// Get a rent record by ID
exports.getRentRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const rentRecord = await RentRecord.findById(id);
    if (!rentRecord) {
      return sendErrorResponse(res, "Rent record not found.", 404);
    }
    sendSuccessResponse(
      res,
      rentRecord,
      "Rent record retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get rent record.", 500);
  }
};

// Update a rent record by ID
exports.updateRentRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const rentData = req.body;
    const updatedRentRecord = await RentRecord.findByIdAndUpdate(id, rentData, {
      new: true,
    });
    if (!updatedRentRecord) {
      return sendErrorResponse(res, "Rent record not found.", 404);
    }
    sendSuccessResponse(
      res,
      updatedRentRecord,
      "Rent record updated successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to update rent record.", 500);
  }
};
