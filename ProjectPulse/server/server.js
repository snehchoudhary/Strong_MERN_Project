const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");


const connectDB =
  require("./config/db");

dotenv.config();

/* CONNECT DATABASE */

connectDB();

const app = express();

/* ROUTES */

const authRoutes =
  require("./routes/authRoutes");

const testRoutes =
  require("./routes/testRoutes");

const projectRoutes =
  require("./routes/projectRoutes");

const taskRoutes =
  require("./routes/taskRoutes");

const analyticsRoutes =
  require("./routes/analyticsRoutes");

const notificationRoutes =
  require("./routes/notificationRoutes");

const userRoutes = require("./routes/userRoutes");

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());


/* API ROUTES */

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/users",
  userRoutes
);

/* TEST ROUTE */

app.get("/", (req, res) => {

  res.send(
    "ProjectPulse API Running"
  );

});

/* =========================
   SOCKET.IO SETUP
========================= */

/* Create HTTP server */

const server =
  http.createServer(app);

/* Setup Socket.io */

const io =
  new Server(server, {

    cors: {

      origin:
        "http://localhost:5173",

      methods:
        ["GET", "POST"]

    }

  });

/* Store Online Users */

global.onlineUsers =
  new Map();

/* Socket Connection */

io.on(
  "connection",
  (socket) => {

    console.log(
      "⚡ User connected:",
      socket.id
    );

    /* Register User */

    socket.on(
      "registerUser",
      (userId) => {

        global.onlineUsers.set(
          userId,
          socket.id
        );

        console.log(
          "User registered:",
          userId
        );

      }
    );

    /* Disconnect */

    socket.on(
      "disconnect",
      () => {

        console.log(
          "❌ User disconnected"
        );

      }
    );

  }
);

/* Export IO */

module.exports.io = io;

/* START SERVER */

const PORT =
  process.env.PORT || 5000;

server.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server running on ${PORT}`
    );

  }
);