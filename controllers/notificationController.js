const Notification = require("../models/notificationModel");

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

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    const newNotification = await Notification.create(notificationData);
    sendSuccessResponse(
      res,
      newNotification,
      "Notification created successfully.",
      201
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to create notification.", 500);
  }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return sendErrorResponse(res, "Notification not found.", 404);
    }
    sendSuccessResponse(
      res,
      deletedNotification,
      "Notification deleted successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to delete notification.", 500);
  }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    sendSuccessResponse(
      res,
      notifications,
      "Notifications retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get notifications.", 500);
  }
};

// Get a notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return sendErrorResponse(res, "Notification not found.", 404);
    }
    sendSuccessResponse(
      res,
      notification,
      "Notification retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get notification.", 500);
  }
};
