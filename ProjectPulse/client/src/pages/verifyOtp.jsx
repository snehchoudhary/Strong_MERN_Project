import { useState }
from "react";

import {
  verifyOtp
}
from "../services/authService";

import {
  useNavigate,
  useLocation
}
from "react-router-dom";

function VerifyOtp() {

  const [otp,
    setOtp] =
    useState("");

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const email =
    location.state?.email;

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      await verifyOtp({

        email,
        otp

      });

      alert(
        "OTP verified"
      );

      navigate(
        "/reset-password",
        { state: { email, otp } }
      );

    }

    catch (error) {

      alert(
        "Invalid OTP"
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
        onSubmit={
          handleSubmit
        }
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

          Verify OTP

        </h2>

        <input

          type="text"

          placeholder="Enter OTP"

          value={otp}

          onChange={(e) =>
            setOtp(
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
            bg-green-500
            text-white
            p-2
          "

        >

          Verify OTP

        </button>

      </form>

    </div>

  );

}

export default VerifyOtp;