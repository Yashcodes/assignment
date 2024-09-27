import { validationResult } from "express-validator";
import {
  hashPassword,
  jwtAuth,
  comparePassword,
} from "../helpers/authHelper.js";
import User from "../models/User.js";

export const registerController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: "Provide necessary credentials",
      });
    }

    //* Destructuring data from request body
    const { name, email, password } = req.body;

    //* Validating if the requested user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Sorry, a user with this email already exists",
      });
    }

    //* Hashing password using bcryptjs
    const securedPassword = await hashPassword(password);

    //* Creating user
    user = await User.create({
      name,
      email,
      password: securedPassword,
    });

    //* User authentication by "authentication token" using "JSONWebToken (JWT)" :::: Using authToken here to send the response to user
    const authToken = await jwtAuth(user);

    res.status(201).json({
      authToken,
      success: true,
      message: "User Registered Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Provide necessary credentials",
      });
    }

    //* Destructuring data from request body
    const { email, password } = req.body;

    //* Checking if the user with provided email exists or not in database
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please try to login with correct credentials",
      });
    }

    //* Comparing the current password and saved password
    const comparedPassword = await comparePassword(password, user.password);

    if (!comparedPassword) {
      return res.status(400).json({
        success: false,
        message: "Please try to login with correct credentials",
      });
    }

    //* User authentication by "authentication token" using "JSONWebToken (JWT)" :::: Using authToken here to send the response to user
    const authToken = await jwtAuth(user);

    res.status(200).json({
      authToken,
      success: true,
      message: "User Logged in Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getUserController = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById({ _id: userId });

    res.status(200).json({
      success: true,
      message: "User found",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
