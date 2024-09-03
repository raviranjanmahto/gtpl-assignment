const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendCookieToken = require("../utils/cookieToken");
const sendResponse = require("../utils/sendResponse");

// Register user, password encryption done in middleware
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, profession } = req.body;
  if (!name || !email || !password || !phone || !profession)
    return next(new AppError("All fields are required", 400));

  // Create a new user instance
  const user = new User({ name, email, password, phone, profession });

  // Save the new user to the database
  await user.save();

  sendCookieToken(user, 201, res, "User created successfully");
});

// Login user
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Email and password are required", 400));

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError("Invalid email or password", 401));

  await user.save();

  sendCookieToken(user, 200, res, "Logged in successfully");
});

// Get all users
exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  sendResponse(users, 200, res, "Users fetched successfully");
});

// Get current user
exports.getCurrentUser = catchAsync(async (req, res) => {
  sendResponse(req.user, 200, res, "User fetched successfully");
});

// Update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, phone } = req.body;

  if (!name || !phone)
    return next(new AppError("Name and phone cannot be empty", 400));

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, phone },
    { new: true }
  );
  if (!user) return next(new AppError("User not found", 400));

  sendResponse(user, 200, res, "User updated successfully");
});

// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("User not found", 400));

  sendResponse(null, 200, res, "User deleted successfully");
});

// Logout user
exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Make sure this matches how the cookie was set
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Match this with how the cookie was set
  });

  sendResponse(null, 200, res, "Logged out successfully");
});
