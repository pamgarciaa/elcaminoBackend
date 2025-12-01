import authService from "../services/auth.service.js";
import generateToken from "../utils/generateJwt.util.js";
import AppError from "../utils/appError.util.js";

// --- REGISTER ---
const registerController = async (req, res, next) => {
  try {
    const { username, name, lastName, email, password } = req.body;

    if (!username || !name || !lastName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const userData = {
      username,
      name,
      lastName,
      email,
      password,
      profilePicture: req.file ? req.file.filename : undefined,
    };

    const user = await authService.registerUser(userData);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// --- LOGIN ---
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await authService.loginUser({ email, password });

    user.password = undefined;
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// --- LOGOUT ---
const logoutController = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

// --- DELETE USER ---
const removeUserController = async (req, res, next) => {
  try {
    await authService.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// --- GET ALL USERS ---
const getAllUsersController = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// --- GET ONE USER ---
const getUserController = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// --- UPDATE USER ---
const updateUserController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { name, address, lastName, phone, username } = req.body;
    const updates = { name, address, lastName, phone, username };

    // Limpiamos undefined
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const updatedUser = await authService.updateProfile(
      userId,
      updates,
      req.file
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// --- UPDATE PASSWORD ---
const updatePasswordController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      return next(new AppError("Password is required", 400));
    }

    await authService.updatePassword(userId, password);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// --- FORGOT PASSWORD ---
const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const pin = await authService.forgotPassword(email);

    // TODO: Enviar email real
    res.json({ message: "Email sent successfully", pin });
  } catch (error) {
    next(error);
  }
};

// --- RESET PASSWORD ---
const resetPasswordController = async (req, res, next) => {
  try {
    const { pin, password } = req.body;

    if (!pin) {
      return next(new AppError("El PIN es obligatorio", 400));
    }

    const cleanPin = String(pin).trim();
    await authService.resetPassword(cleanPin, password);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

// --- HELPER (Send Token) ---
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user);
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res
    .status(statusCode)
    .cookie("jwt", token, options)
    .json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
};

export {
  registerController,
  loginController,
  logoutController,
  removeUserController,
  getAllUsersController,
  getUserController,
  forgotPasswordController,
  resetPasswordController,
  updateUserController,
  updatePasswordController,
};
