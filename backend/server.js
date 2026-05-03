const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// CORS — allow frontend URL in production, localhost in development
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/jobs",         require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/users",        require("./routes/userRoutes"));
app.use("/api/chat",         require("./routes/chatRoutes"));

// Health check
app.get("/", (req, res) => res.json({ message: "SmartHire AI Job Portal API is running!" }));

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
