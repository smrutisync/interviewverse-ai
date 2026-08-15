const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "InterviewVerse AI Backend Running",
    });
});


// =====================================================
// AUTH ROUTES
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);


// =====================================================
// INTERVIEW ROUTES
// =====================================================

app.use(
    "/api/interviews",
    interviewRoutes
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl,
    });
});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    res.status(500).json({
        message: "Internal server error",
        error: err.message,
    });
});


module.exports = app;