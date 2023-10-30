const Profile = require("../models/profileModel");
const User = require("../models/userModel");

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
      success: false,
      status: statusCode,
      errorMessage: errorMessage,
      error: error,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      errorMessage: errorMessage,
    });
  }
};

// Controller function to create or update a profile
exports.createOrUpdateProfile = async (req, res) => {
  const { userId, title, about, photo } = req.body;
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      sendErrorResponse(res, "User not found.", 404);
      return;
    }

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      // If profile does not exist, create a new profile with the uploaded photo
      profile = new Profile({
        user: userId,
        title,
        about,
        photo,
      });

      await profile.save();
      sendSuccessResponse(res, profile, "Profile created successfully.", 200);
    } else {
      // If profile already exists, update the profile fields, including photo if provided
      if (photo) {
        profile.photo = photo;
        profile.title = title;
        profile.about = about;
        profile.save();

        sendSuccessResponse(res, profile, "Profile updated successfully.", 200);
      } else {
        // If no new photo is provided, only update the title
        profile.title = title;
        profile.about = about;
        await profile.save();
        sendSuccessResponse(res, profile, "Profile updated successfully.", 200);
      }
    }
  } catch (err) {
    console.log(err);
    sendErrorResponse(res, "Failed to create or update profile.", 500, err);
  }
};
