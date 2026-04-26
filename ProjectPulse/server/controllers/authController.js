const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendEmail =
  require("../utils/sendEmail");

/* ===========================
   REGISTER USER
=========================== */

exports.register = async (req, res) => {

  const {
    name,
    email,
    password,
    role
  } = req.body;

  try {

    /* Check existing user */

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    /* Hash password */

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    /* Create user */

    const user =
      new User({

        name,
        email,
        password: hashedPassword,
        role

      });

    await user.save();

    res.status(201).json({

      message:
        "User registered successfully"

    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


/* ===========================
   LOGIN USER
=========================== */

exports.login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    /* Find user */

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message:
          "Invalid credentials"
      });

    }

    /* Compare password */

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid credentials"
      });

    }

    /* Generate JWT */

    const token =
      jwt.sign(

        {
          id: user._id,
          role: user.role
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d"
        }

      );

    /* Send response */

    res.json({

      token,

      user: {

        _id: user._id,  // ✅ FIXED
        name: user.name,
        email: user.email,
        role: user.role

      }

    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


/* ===========================
   FORGOT PASSWORD
=========================== */

exports.forgotPassword =
  async (req, res) => {

  try {

    const { email } =
      req.body;

    /* Find user */

    const user =
      await User.findOne({
        email
      });

    if (!user) {

      return res.status(404).json({

        message:
          "User not found"

      });

    }

    /* Generate OTP */

    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();

    /* Save OTP */

    user.otp = otp;

    user.otpExpire =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    /* Send email */

    await sendEmail(

      email,

      "Password Reset OTP",

      `Your OTP is: ${otp}`

    );

    res.json({

      message:
        "OTP sent to email"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "OTP send failed"

    });

  }

};


/* ===========================
   VERIFY OTP
=========================== */

exports.verifyOtp =
  async (req, res) => {

  try {

    const {
      email,
      otp
    } = req.body;

    /* Find user */

    const user =
      await User.findOne({
        email
      });

    /* Validate OTP */

    if (

      !user ||

      user.otp !== otp ||

      !user.otpExpire ||

      user.otpExpire < Date.now()

    ) {

      return res.status(400).json({

        message:
          "Invalid or expired OTP"

      });

    }

    res.json({

      message:
        "OTP verified successfully"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "OTP verification failed"

    });

  }

};


/* ===========================
   RESET PASSWORD
=========================== */

exports.resetPassword =
  async (req, res) => {

  try {

    const {
      email,
      newPassword
    } = req.body;

    /* Find user */

    const user =
      await User.findOne({
        email
      });

    if (!user) {

      return res.status(400).json({

        message:
          "User not found"

      });

    }

    /* Hash new password */

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    /* Save password */

    user.password =
      hashedPassword;

    /* Clear OTP */

    user.otp = null;

    user.otpExpire = null;

    await user.save();

    res.status(200).json({

      message:
        "Password reset successful"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"

    });

  }

};

