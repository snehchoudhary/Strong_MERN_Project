// import {useState} from "react";
// import { useNavigate } from "react-router-dom";

// import api from "../services/api";

// function Register() {
    
//     const [name, setName] = useState("");
//     const [email, setEmail]= useState("");
//     const [password, setPassword] = useState("");

//     const navigate = useNavigate();
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             await api.post(
//                 "/auth/register",
//                 {name, email, password}
//             );

//             navigate("/");
//         } catch (error) {
//             alert ("Register Failed");
//         }
//     };

//     // return (
//     //     <div>
//     //         <h2>Register</h2>

//     //         <form onSubmit={handleSubmit}>

//     //             <input type="text"
//     //             placeholder="Name"
//     //             onChange={(e) => 
//     //                 setName(e.target.value)
//     //             } />

//     //             <input type="email"
//     //             placeholder="Email"
//     //             onChange={(e) => 
//     //                 setEmail(e.target.value)
//     //             } />

//     //             <input type="password"
//     //             placeholder="Password"
//     //             onChange={(e) => 
//     //                 setPassword(e.target.value)
//     //             } />

//     //             <button type="submit">Register</button>
//     //         </form>
//     //     </div>
//     // )

//     return (

//   <div className="flex justify-center items-center h-screen bg-gray-100">

//     <div className="bg-white p-8 rounded shadow w-96">

//       <h2 className="text-2xl font-bold mb-6 text-center">
//         Register
//       </h2>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4"
//       >

//         <input
//           type="text"
//           placeholder="Name"
//           className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={(e) =>
//             setName(e.target.value)
//           }
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={(e) =>
//             setEmail(e.target.value)
//           }
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={(e) =>
//             setPassword(e.target.value)
//           }
//         />

//         <button
//           type="submit"
//           className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition duration-200"
//         >
//           Register
//         </button>

//       </form>

//       {/* Login Redirect */}

//       <p className="text-sm text-center mt-4 text-gray-500">

//         Already have an account?

//         <span
//           onClick={() => navigate("/")}
//           className="text-blue-600 cursor-pointer ml-1 hover:underline"
//         >
//           Login
//         </span>

//       </p>

//     </div>

//   </div>

// );

// }

// export default Register;


import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .reg-root {
    min-height: 100vh;
    background: #080a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 2rem 1rem;
  }

  .reg-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 40% at 80% 10%, rgba(20, 180, 130, 0.1) 0%, transparent 65%),
      radial-gradient(ellipse 50% 35% at 15% 85%, rgba(99, 66, 255, 0.09) 0%, transparent 60%);
    pointer-events: none;
  }

  .reg-root::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .reg-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    background: rgba(13, 15, 22, 0.85);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 2.5rem;
    backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 32px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .reg-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 2rem;
  }

  .reg-logo-mark {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #14b896 0%, #6342ff 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.5px;
    flex-shrink: 0;
  }

  .reg-logo-name {
    font-size: 15px;
    font-weight: 500;
    color: rgba(255,255,255,0.9);
    letter-spacing: -0.2px;
  }

  .reg-heading {
    font-family: 'Instrument Serif', serif;
    font-size: 2rem;
    font-weight: 400;
    color: #fff;
    margin: 0 0 0.35rem;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  .reg-heading em {
    font-style: italic;
    background: linear-gradient(90deg, #34d9a5, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .reg-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.38);
    margin: 0 0 1.75rem;
    font-weight: 300;
    letter-spacing: 0.1px;
  }

  /* Progress steps */
  .reg-steps {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 1.75rem;
  }

  .reg-step {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  .reg-step-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 500;
    flex-shrink: 0;
    transition: all 0.3s;
  }

  .reg-step-dot.active {
    background: linear-gradient(135deg, #14b896, #6342ff);
    color: #fff;
    box-shadow: 0 0 12px rgba(20, 184, 150, 0.4);
  }

  .reg-step-dot.done {
    background: rgba(20, 184, 150, 0.15);
    color: #14b896;
    border: 1px solid rgba(20, 184, 150, 0.3);
  }

  .reg-step-dot.pending {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.25);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .reg-step-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3px;
    transition: color 0.3s;
  }

  .reg-step-label.active { color: rgba(255,255,255,0.8); }
  .reg-step-label.done   { color: #14b896; }
  .reg-step-label.pending { color: rgba(255,255,255,0.2); }

  .reg-step-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 0 8px;
    position: relative;
    overflow: hidden;
  }

  .reg-step-line.done::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #14b896, #6342ff);
    animation: fillLine 0.4s ease forwards;
  }

  @keyframes fillLine {
    from { transform: scaleX(0); transform-origin: left; }
    to   { transform: scaleX(1); transform-origin: left; }
  }

  /* Fields */
  .reg-field {
    margin-bottom: 1rem;
  }

  .reg-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .reg-label-hint {
    font-size: 11px;
    color: rgba(255,255,255,0.2);
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
  }

  .reg-input-wrap {
    position: relative;
  }

  .reg-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.25);
    display: flex;
    align-items: center;
    pointer-events: none;
    transition: color 0.2s;
  }

  .reg-input-wrap:focus-within .reg-input-icon {
    color: rgba(20, 184, 150, 0.7);
  }

  .reg-input {
    width: 100%;
    padding: 11px 14px 11px 42px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    color: rgba(255,255,255,0.92);
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
  }

  .reg-input::placeholder { color: rgba(255,255,255,0.2); }

  .reg-input:hover {
    border-color: rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.055);
  }

  .reg-input:focus {
    border-color: rgba(20, 184, 150, 0.5);
    background: rgba(20, 184, 150, 0.04);
    box-shadow: 0 0 0 3px rgba(20, 184, 150, 0.1);
  }

  .reg-input.error {
    border-color: rgba(220, 60, 60, 0.5);
    background: rgba(220, 60, 60, 0.04);
    box-shadow: 0 0 0 3px rgba(220, 60, 60, 0.08);
  }

  .reg-pw-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.25);
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s;
  }

  .reg-pw-toggle:hover { color: rgba(255,255,255,0.55); }

  /* Password strength */
  .reg-strength {
    margin-top: 8px;
  }

  .reg-strength-bars {
    display: flex;
    gap: 4px;
    margin-bottom: 5px;
  }

  .reg-strength-bar {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.07);
    transition: background 0.3s;
  }

  .reg-strength-bar.weak   { background: #ef4444; }
  .reg-strength-bar.fair   { background: #f59e0b; }
  .reg-strength-bar.good   { background: #3b82f6; }
  .reg-strength-bar.strong { background: #14b896; }

  .reg-strength-label {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    transition: color 0.3s;
  }

  .reg-strength-label.weak   { color: #ef4444; }
  .reg-strength-label.fair   { color: #f59e0b; }
  .reg-strength-label.good   { color: #3b82f6; }
  .reg-strength-label.strong { color: #14b896; }

  /* Error */
  .reg-error {
    background: rgba(220, 60, 60, 0.1);
    border: 1px solid rgba(220, 60, 60, 0.25);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #f87171;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: shake 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-5px); }
    40%       { transform: translateX(5px); }
    60%       { transform: translateX(-3px); }
    80%       { transform: translateX(3px); }
  }

  /* Terms */
  .reg-terms {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 1.25rem;
    cursor: pointer;
    user-select: none;
  }

  .reg-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.04);
    flex-shrink: 0;
    margin-top: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    cursor: pointer;
  }

  .reg-checkbox.checked {
    background: linear-gradient(135deg, #14b896, #6342ff);
    border-color: transparent;
  }

  .reg-terms-text {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    line-height: 1.6;
  }

  .reg-terms-text a {
    color: rgba(20, 184, 150, 0.8);
    text-decoration: none;
  }

  .reg-terms-text a:hover { color: #14b896; }

  /* Button */
  .reg-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #14b896 0%, #0d9a7c 100%);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.1px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(20, 184, 150, 0.28);
    position: relative;
    overflow: hidden;
  }

  .reg-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .reg-btn:hover::before { opacity: 1; }

  .reg-btn:hover {
    box-shadow: 0 6px 32px rgba(20, 184, 150, 0.4);
    transform: translateY(-1px);
  }

  .reg-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 12px rgba(20, 184, 150, 0.28);
  }

  .reg-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .reg-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Perks row */
  .reg-perks {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .reg-perk {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    font-weight: 400;
  }

  .reg-perk-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(20, 184, 150, 0.5);
    flex-shrink: 0;
  }

  .reg-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 13px;
    color: rgba(255,255,255,0.3);
  }

  .reg-footer a {
    color: rgba(99, 66, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
  }

  .reg-footer a:hover { color: rgba(130, 100, 255, 1); }
`;

/* ---------- SVG Icons ---------- */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = ({ off }) => off ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconCheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ---------- Password strength ---------- */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", key: "" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = ["", "weak", "fair", "good", "strong"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score], key: map[score] };
}

/* ---------- Component ---------- */
export default function Register() {
  const { login } = useContext(AuthContext);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const [role, setRole] = useState("manager");

  const navigate  = useNavigate();
  const strength  = getStrength(password);

  /* Steps indicator derived from state */
  const step = name ? (email ? (password ? 3 : 2) : 2) : 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError("Please accept the terms to continue."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      // Backend doesn&#39;t return token; redirect to login
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const stepState = (n) =>
    step > n ? "done" : step === n ? "active" : "pending";

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        <div className="reg-card">

          {/* Logo */}
          {/* <div className="reg-logo">
            <div className="reg-logo-mark">A</div>
            <span className="reg-logo-name">Acme</span>
          </div> */}

          {/* Heading */}
          <h1 className="reg-heading">Create your <em>account</em></h1>
          {/* <p className="reg-sub">Join thousands of teams shipping faster</p> */}

          {/* Steps */}
          <div className="reg-steps">
            <div className="reg-step">
              <div className={`reg-step-dot ${stepState(1)}`}>
                {step > 1 ? <IconCheck /> : "1"}
              </div>
              <span className={`reg-step-label ${stepState(1)}`}>Profile</span>
            </div>
            <div className={`reg-step-line ${step > 1 ? "done" : ""}`} />
            <div className="reg-step">
              <div className={`reg-step-dot ${stepState(2)}`}>
                {step > 2 ? <IconCheck /> : "2"}
              </div>
              <span className={`reg-step-label ${stepState(2)}`}>Contact</span>
            </div>
            <div className={`reg-step-line ${step > 2 ? "done" : ""}`} />
            <div className="reg-step">
              <div className={`reg-step-dot ${stepState(3)}`}>3</div>
              <span className={`reg-step-label ${stepState(3)}`}>Security</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="reg-error">
              <IconAlert /> {error}
            </div>
          )}

          {/* Form */}
<form onSubmit={handleSubmit} noValidate>
            {/* Role Select */}
            <select
              className="reg-input"
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value="manager">Manager</option>
              <option value="lead">Lead</option>
            </select>
          

            {/* Name */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="reg-name">
                Full name
              </label>
              <div className="reg-input-wrap">
                <input
                  id="reg-name"
                  className="reg-input"
                  type="text"
                  placeholder="Jane Smith"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <span className="reg-input-icon"><IconUser /></span>
              </div>
            </div>

            {/* Email */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="reg-email">
                Work email
              </label>
              <div className="reg-input-wrap">
                <input
                  id="reg-email"
                  className="reg-input"
                  type="email"
                  placeholder="jane@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="reg-input-icon"><IconMail /></span>
              </div>
            </div>

            {/* Password */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="reg-password">
                Password
                {password && (
                  <span className="reg-label-hint">
                    {strength.score}/4 strength
                  </span>
                )}
              </label>
              <div className="reg-input-wrap">
                <input
                  id="reg-password"
                  className="reg-input"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="reg-input-icon"><IconLock /></span>
                <button
                  type="button"
                  className="reg-pw-toggle"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <IconEye off={showPw} />
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="reg-strength">
                  <div className="reg-strength-bars">
                    {[1,2,3,4].map((n) => (
                      <div
                        key={n}
                        className={`reg-strength-bar ${strength.score >= n ? strength.key : ""}`}
                      />
                    ))}
                  </div>
                  <span className={`reg-strength-label ${strength.key}`}>
                    {strength.label} password
                  </span>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="reg-terms" onClick={() => setAgreed((a) => !a)}>
              <div className={`reg-checkbox ${agreed ? "checked" : ""}`}>
                {agreed && <IconCheck />}
              </div>
              <p className="reg-terms-text">
                I agree to the <a href="/terms" onClick={(e) => e.stopPropagation()}>Terms of Service</a> and <a href="/privacy" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>
              </p>
            </div>

            <button
              type="submit"
              className="reg-btn"
              disabled={loading || !agreed}
            >
              {loading ? (
                <><div className="reg-spinner" /> Creating account…</>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Trust perks */}
          <div className="reg-perks">
            {["Free 14-day trial", "No credit card", "Cancel anytime"].map((p) => (
              <div key={p} className="reg-perk">
                <div className="reg-perk-dot" />
                {p}
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="reg-footer">
            Already have an account?{" "}
            <a onClick={() => navigate("/")}>Sign in</a>
          </p>

        </div>
      </div>
    </>
  );
}