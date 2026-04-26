const express = require("express");
const { register, login, forgotPassword, verifyOtp, resetPassword } = require("../controllers/authController");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

/* FORGOT PASSWORD */

router.post(
  "/forgot-password",
  forgotPassword
);

/* VERIFY OTP */

router.post(
  "/verify-otp",
  verifyOtp
);

/* RESET PASSWORD */

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;