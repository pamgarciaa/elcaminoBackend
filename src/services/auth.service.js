import crypto from "crypto";
import User from "../models/user.model.js";
import fs from "fs-extra";
import path from "path";
import AppError from "../utils/appError.util.js";

// REGISTER
const registerUser = async (userData) => {
  const { username, email } = userData;
  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) throw new AppError("User or Email already exists", 409);

  return await User.create(userData);
};

// LOGIN
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid credentials", 401);
  }
  return user;
};

// UPDATE PROFILE
const updateProfile = async (userId, updateData, newFile) => {
  const user = await User.findById(userId);
  AppError.try(user, "User not found"); // Helper

  if (newFile) {
    updateData.profilePicture = newFile.filename;
    // Lógica de borrado de imagen antigua...
    if (
      user.profilePicture &&
      !user.profilePicture.includes("default") &&
      !user.profilePicture.startsWith("http")
    ) {
      const oldPath = path.join(
        import.meta.dirname,
        "../../uploads/users",
        user.profilePicture
      );
      if (await fs.pathExists(oldPath)) await fs.remove(oldPath);
    }
  }

  Object.assign(user, updateData);
  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;
  return updatedUser;
};

// DELETE USER
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  return AppError.try(user, "User not found");
};

// GET ALL
const getAllUsers = async () => {
  return await User.find().select("-password");
};

// GET ONE
const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  return AppError.try(user, "User not found");
};

// UPDATE PASSWORD
const updatePassword = async (userId, password) => {
  const user = await User.findById(userId);
  AppError.try(user, "User not found");

  user.password = password;
  await user.save();
  return user;
};

// FORGOT PASSWORD
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  AppError.try(user, "User not found");

  const resetToken = crypto.randomInt(100000, 999999).toString();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();
  return resetToken;
};

// RESET PASSWORD
const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  AppError.try(user, "Invalid or expired PIN", 400);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return true;
};

export default {
  registerUser,
  loginUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
};
