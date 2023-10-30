const Message = require("../models/messagesModel");

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

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const messageData = req.body;
    const newMessage = await Message.create(messageData);
    sendSuccessResponse(res, newMessage, "Message sent successfully.", 201);
  } catch (error) {
    sendErrorResponse(res, "Failed to send message.", 500);
  }
};

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return sendErrorResponse(res, "Message not found.", 404);
    }
    sendSuccessResponse(
      res,
      deletedMessage,
      "Message deleted successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to delete message.", 500);
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    sendSuccessResponse(res, messages, "Messages retrieved successfully.", 200);
  } catch (error) {
    sendErrorResponse(res, "Failed to get messages.", 500);
  }
};

// Get a message by ID
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return sendErrorResponse(res, "Message not found.", 404);
    }
    sendSuccessResponse(res, message, "Message retrieved successfully.", 200);
  } catch (error) {
    sendErrorResponse(res, "Failed to get message.", 500);
  }
};
