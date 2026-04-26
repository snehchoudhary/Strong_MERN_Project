// import {useState, useContext} from "react";
// import { useNavigate } from "react-router-dom";

// import api from "../services/api";
// import {AuthContext} from "../context/AuthContext";

// function Login() {
    
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const {login} = useContext(AuthContext);

//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {

//             const res = await api.post(
//                 "/auth/login",
//                 {
//                     email,
//                     password
//                 }
//             );

//             login(res.data.token);

//             navigate("/dashboard");
//         } catch (error) {
//             alert ("Login Failed");
//         }
//     };

//     // return (

//     //     <div>
//     //         <h2>Login</h2>

//     //         <form onSubmit={handleSubmit}>
//     //             <input type="email"
//     //             placeholder="Email"
//     //             onChange={(e) => 
//     //                 setEmail(e.target.value)
//     //             } />

//     //             <input type="password"
//     //             placeholder="Password"
//     //             onChange={(e) => 
//     //                 setPassword(e.target.value)
//     //             }  />

//     //             <button type="submit">Login</button>
//     //         </form>
//     //     </div>
//     // )

//     return (

//   <div className="flex justify-center items-center h-screen bg-gray-100">

//     <div className="bg-white p-8 rounded shadow w-96">

//       <h2 className="text-2xl font-bold mb-6 text-center">
//         Login
//       </h2>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4"
//       >

//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 rounded"
//           onChange={(e) =>
//             setEmail(e.target.value)
//           }
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 rounded"
//           onChange={(e) =>
//             setPassword(e.target.value)
//           }
//         />

//         <button
//           type="submit"
//           className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
//         >
//           Login
//         </button>

//       </form>

//     </div>

//   </div>

// );
// }

// export default Login;

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const { login } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res =
        await api.post(
          "/auth/login",
          {
            email,
            password
          }
        );

      const token = res.data.token;
      const role = res.data.role;

      // Save token + role

      login(token);

      localStorage.setItem(
        "role",
        role
      );

      // Role-Based Redirect

      if (role === "lead") {

        navigate(
          "/lead-dashboard"
        );

      } else {

        navigate(
          "/dashboard"
        );

      }

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">

          ProjectPulse Login

        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            type="email"
            placeholder="Email"
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* Register Link */}

        <p className="text-sm text-center mt-4 text-gray-500">

          Don't have an account?

          <span
            onClick={() =>
              navigate("/register")
            }
            className="text-blue-600 cursor-pointer ml-1 hover:underline"
          >
            Register
          </span>

        </p>


        <p
  className="
    text-sm
    text-blue-500
    cursor-pointer
    mt-2
  "
  onClick={() =>
    navigate(
      "/forgot-password"
    )
  }
>

  Forgot Password?

</p>

      </div>

    </div>

  );

}

export default Login;