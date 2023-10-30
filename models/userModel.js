const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let crypto = require("crypto");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "please provide your name"],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide your password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same!!!",
    },
  },
  phone: {
    type: String,
    required: [true, "please provide your phone number"],
  },
  role: {
    type: String,
    enum: ["agent", "admin", "client"],
    default: "client",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

/*****Document middleware*****/

// hash passsword
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    let changedTimesTamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimesTamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  let resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
