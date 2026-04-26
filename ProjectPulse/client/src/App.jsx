import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

/* Pages */

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Upload from "./pages/Upload";
import Analytics from "./pages/Analytics";
import LeadDashboard from "./pages/LeadDashboard";
import KanbanBoard from "./pages/KanbanBoard";
import CreateProject from "./pages/CreateProject";

/* Components */

import ProtectedRoute from "./components/protectedRoute";
import UploadSheet from "./components/UploadSheet";

/* Socket */

import socket from "./socket";

/* Auth Pages */

import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function App() {

  /* ===========================
     SOCKET USER REGISTER
  =========================== */

  useEffect(() => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (user) {

      socket.emit(
        "registerUser",
        user._id
      );

    }

  }, []);

  return (

    <BrowserRouter>

      <Routes>

        {/* ===========================
           AUTH ROUTES
        =========================== */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* ✅ Added login route */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ===========================
           MAIN ROUTES
        =========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lead-dashboard"
          element={
            <ProtectedRoute>
              <LeadDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
  path="/create-project"
  element={
    <ProtectedRoute>
      <CreateProject />
    </ProtectedRoute>
  }
/>

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload/:id"
          element={
            <ProtectedRoute>
              <UploadSheet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <KanbanBoard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;