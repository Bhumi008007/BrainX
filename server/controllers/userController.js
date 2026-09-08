import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const userExist =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (userExist) {
      return res.json({
        success: false,
        message:
          "User already exists",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({
        name,
        email:
          email.toLowerCase(),
        password:
          hashedPassword,
      });

    const token =
      generateToken(user._id);

    res.json({
      success: true,

      token,

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        credits:
          user.credits,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (!user) {
      return res.json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const token =
      generateToken(
        user._id
      );

    res.json({
      success: true,

      token,

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        credits:
          user.credits,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==========================================
// GET USER DATA
// ==========================================

export const getUser = async (req, res) => {
  try {
    res.json({
      success: true,

      user: {
        id:
          req.user._id,

        name:
          req.user.name,

        email:
          req.user.email,

        credits:
          req.user.credits,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==========================================
// ADD DEMO CREDITS
// ==========================================

export const addCredits = async (req, res) => {
  try {
    const {
      planId,
    } = req.body;

    const plans = {
      starter: 100,
      pro: 500,
      ultimate: 1000,
    };

    const creditsToAdd =
      plans[planId];

    if (!creditsToAdd) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credit plan.",
      });
    }

    req.user.credits +=
      creditsToAdd;

    await req.user.save();

    return res.json({
      success: true,

      message:
        `${creditsToAdd} credits added successfully.`,

      creditsAdded:
        creditsToAdd,

      credits:
        req.user.credits,
    });
  } catch (error) {
    console.error(
      "Add Credits Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to add credits.",
    });
  }
};