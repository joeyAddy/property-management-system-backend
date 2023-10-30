const Property = require("../models/propertyModel");

// Function to handle success responses
const sendSuccessResponse = (res, data, message, statusCode) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Function to handle error responses
const sendErrorResponse = (res, errorMessage, statusCode, error) => {
  if (error) {
    res.status(statusCode).json({
      success: "false",
      status: statusCode,
      errorMessage: errorMessage,
      error: error,
    });
  } else {
    res.status(statusCode).json({
      success: "false",
      status: statusCode,
      errorMessage: errorMessage,
    });
  }
};
// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    const newProperty = await Property.create(propertyData);
    sendSuccessResponse(
      res,
      newProperty,
      "Property created successfully.",
      201
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to create property.", 500, error);
  }
};

// Delete a property by ID
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return sendErrorResponse(res, "Property not found.", 404);
    }
    sendSuccessResponse(
      res,
      deletedProperty,
      "Property deleted successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to delete property.", 500);
  }
};

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    sendSuccessResponse(
      res,
      properties,
      "Properties retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get properties.", 500);
  }
};

// Get all properties that belongs to an agent
exports.getAllPropertiesForAgent = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(req.query);
    const properties = await Property.find({ agent: id });
    sendSuccessResponse(
      res,
      properties,
      "Properties retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to get properties.", 500);
  }
};

// Get favorite properties for a specific agent
exports.getFavoritePropertiesForAgent = async (req, res) => {
  try {
    const { id } = req.query;

    const favoriteProperties = await Property.find({
      agent: id,
      favorite: true,
    });

    sendSuccessResponse(
      res,
      favoriteProperties,
      "Favorite properties retrieved successfully.",
      200
    );
  } catch (error) {
    console.error("Error retrieving favorite properties:", error);
    sendErrorResponse(res, "Failed to get favorite properties.", 500);
  }
};

// Update the favorite field of a property
exports.updatePropertyFavorite = async (req, res) => {
  try {
    const { id, favorite } = req.query;

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { favorite: favorite },
      { new: true }
    );

    if (!updatedProperty) {
      sendErrorResponse(res, "Property not found.", 404);
      return;
    }

    sendSuccessResponse(
      res,
      updatedProperty,
      "Property favorite updated successfully.",
      200
    );
  } catch (error) {
    console.error("Error updating property favorite:", error);
    sendErrorResponse(res, "Failed to update property favorite.", 500);
  }
};

// Get a property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      return sendErrorResponse(res, "Property not found.", 404);
    }
    sendSuccessResponse(res, property, "Property retrieved successfully.", 200);
  } catch (error) {
    sendErrorResponse(res, "Failed to get property.", 500);
  }
};

// Update a property by ID
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyData = req.body;
    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData, {
      new: true,
    });
    if (!updatedProperty) {
      return sendErrorResponse(res, "Property not found.", 404);
    }
    sendSuccessResponse(
      res,
      updatedProperty,
      "Property updated successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to update property.", 500);
  }
};

// Search properties based on query parameters
exports.searchProperties = async (req, res) => {
  try {
    const query = req.query;
    const properties = await Property.find(query);
    sendSuccessResponse(
      res,
      properties,
      "Properties retrieved successfully.",
      200
    );
  } catch (error) {
    sendErrorResponse(res, "Failed to search properties.", 500);
  }
};
