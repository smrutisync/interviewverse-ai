const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "InterviewVerse AI Server is running",
  });
});

// Routes
const authRoutes = require("./src/routes/authRoutes");
const interviewRoutes = require("./src/routes/interviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});