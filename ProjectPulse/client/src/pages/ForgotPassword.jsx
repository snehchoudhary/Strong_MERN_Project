import { useState } from "react";
import { forgotPassword }
from "../services/authService";

import { useNavigate }
from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      console.log(
        "Sending email:",
        email
      );

      try {

        const res =
          await forgotPassword(
            email
          );

        alert(
          res.data.message ||
          "OTP sent successfully"
        );

        navigate(
          "/verify-otp",
          { state: { email } }
        );

      }

      catch (error) {

        console.error(error);

        alert(
          error.response?.data?.message ||
          error.message ||
          "Failed to send OTP"
        );

      }

    };

  return (

    <div className="
      flex
      items-center
      justify-center
      h-screen
    ">

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

        <h2 className="
          text-xl
          font-bold
          mb-4
        ">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter email"

          value={email}

          onChange={(e) =>
            setEmail(
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
            bg-blue-500
            text-white
            p-2
          "
        >
          Send OTP
        </button>

      </form>

    </div>

  );

}

export default ForgotPassword;