import api from "./api";

/* ===========================
   FORGOT PASSWORD
=========================== */

export const forgotPassword =
  (email) =>
    api.post(
      "/auth/forgot-password",
      { email }
    );

/* VERIFY OTP */

export const verifyOtp =
  (data) =>
    api.post(
      "/auth/verify-otp",
      data
    );

/* RESET PASSWORD */

export const resetPassword =
  (data) =>
    api.post(
      "/auth/reset-password",
      data
    );