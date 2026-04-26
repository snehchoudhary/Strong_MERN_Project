import { useState } from "react";

import { resetPassword }
from "../services/authService";

import {
  useNavigate,
  useLocation
}
from "react-router-dom";

function ResetPassword() {

  const [password,
    setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const email =
    location.state?.email;

  const otp =
    location.state?.otp;

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      await resetPassword({

        email,
        otp,
        newPassword:
          password

      });

      alert(
        "Password reset successful"
      );

      navigate(
        "/login"
      );

    }

    catch (error) {

      alert(
        "Reset failed"
      );

    }

  };

  return (

    <div
      className="
        flex
        items-center
        justify-center
        h-screen
      "
    >

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          p-6
          rounded
          shadow
          w-80
        "
      >

        <h2
          className="
            text-xl
            font-bold
            mb-4
          "
        >
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          className="
            w-full
            p-2
            border
            mb-4
          "

          required
        />

        <button
          type="submit"
          className="
            w-full
            bg-purple-500
            text-white
            p-2
          "
        >
          Reset Password
        </button>

      </form>

    </div>

  );

}

export default ResetPassword;