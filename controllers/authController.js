const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../util/catchAsync");
const AppError = require("./../util/appError");
const sendEmail = require("./../util/email");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Profile = require("../models/profileModel");

// Make JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const myToken = createToken(user._id);
  res.status(statusCode).json({
    success: "true",
    status: statusCode,
    token: myToken,
    data: {
      user,
    },
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

exports.signUp = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (user) {
    sendErrorResponse(
      res,
      "Email already has an account. Either log in or use another email",
      400
    );
    return;
  }
  let createUser = null;
  try {
    createUser = await User.create({
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone: req.body.phone,
      role: req.body?.role,
      fullName: req.body.fullName,
    });
  } catch (error) {
    console.log(error, "error from sign up");
    sendErrorResponse(res, "Internal Server error", 500, error);
  }

  try {
    if (!createUser) return;

    // Email data pass to email.js
    await sendEmail({
      email: createUser.email,
      subject: "Sign-Up Notification",
      message: `Welcome to join us, ${createUser.username}!!!`,
    });

    // response data
    createUser.password = undefined; // hide pass from response
    createSendToken(createUser, 201, res);
  } catch (error) {
    // sendErrorResponse(res, "Error sending email confirmation", 500, error);
    return next(new AppError("Somthing problem here!!!", 500));
  }
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email exist
  if (!email) {
    sendErrorResponse(res, "You cannot log in without an email", 401);
    return next(new AppError("provide email", 400));
  }

  // Check if email exist
  if (!password) {
    sendErrorResponse(res, "Please provide password", 401);
    return next(new AppError("provide password", 400));
  }

  // Check if user exists & password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    sendErrorResponse(res, "Incorrect Email or Password", 401);
    return next(new AppError("Incorrect email or password", 401));
  }

  try {
    // Email data pass to email.js
    await sendEmail({
      email: user.email,
      subject: "LogIn Notification",
      message: `Login successful, ${user.fullName}!!!`,
    });

    let data = null;
    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      data = {
        ...user,
      };
    } else {
      data = {
        _id: user._id,
        role: user.role,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        title: profile.title,
        photo: profile.photo,
        about: profile.about,
      };
    }

    // response data
    user.password = undefined; // hide pass from response
    if (data === null) return;
    console.log(user, "login response");
    createSendToken(data, 200, res);
  } catch (error) {
    // sendErrorResponse(res, "Error sending email confirmation", 500, error);
    return next(new AppError("Somthing problem here!!!", 500));
  }
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: "ok",
    length: users.length,
    data: {
      users,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const clientUrl = req.rawHeaders[req.rawHeaders.length - 5];
  console.log(req.rawHeaders[req.rawHeaders.length - 5], "this is the email");
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    sendErrorResponse(res, "There is no user with this email", 404);
    return next(new AppError("There is no user with this email address", 404));
  }
  let resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  let resetURL = `${clientUrl}reset-password/${resetToken}`;

  let message = `Forget your password ? click the link below to reset it. \n${resetURL}.\nIf you didn't forget your password, please ignore this email !!!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });
    res.status(200).json({
      status: "ok",
      message: "Token send to your email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // sendErrorResponse(res, "Internal Server error", 500, error);
    return next(
      new AppError(
        "There was an error sending the email. Try again later !!!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  try {
    let hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    let user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      sendErrorResponse(res, "Token is invalid or has expired", 400);
      return next(new AppError("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
  } catch (error) {
    sendErrorResponse(res, "Internal Server error", 500, error);
    return next(new AppError("Internal server error", 500));
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id).select("+password");
    console.log(user);

    if (
      !(await user.comparePassword(req.body.passwordCurrent, user.password))
    ) {
      sendErrorResponse(res, "Your current password is wrong", 400);
      return next(new AppError("Your current password is wrong", 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    user.password = undefined;
    createSendToken(user, 200, res);
  } catch (error) {
    sendErrorResponse(res, "Internal Server error", 500, error);
    return next(new AppError("Internal server error", 500));
  }
});

// Restrict user route
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// Get current user Info from JWT token
exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token,
    reqHeader = req.headers.authorization;

  if (reqHeader && reqHeader.startsWith("Bearer")) {
    token = reqHeader.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    next(
      new AppError("User recently changed password! Please login again", 401)
    );
  }
  // assign current user data on (req.user)
  req.user = currentUser;
  next();
});
