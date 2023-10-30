const Transaction = require("../models/transactionModel");

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

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const transactionData = req.body;
    const newTransaction = await Transaction.create(transactionData);
    sendSuccessResponse(
      res,
      newTransaction,
      "Transaction created successfully.",
      201
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to create transaction.", 500);
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return sendErrorResponse(res, "Transaction not found.", 404);
    }
    sendSuccessResponse(
      res,
      deletedTransaction,
      "Transaction deleted successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to delete transaction.", 500);
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    sendSuccessResponse(
      res,
      transactions,
      "Transactions retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get transactions.", 500);
  }
};

// Get a transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return sendErrorResponse(res, "Transaction not found.", 404);
    }
    sendSuccessResponse(
      res,
      transaction,
      "Transaction retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get transaction.", 500);
  }
};
