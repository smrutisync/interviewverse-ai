const mongoose = require("mongoose");

// ============================================================
// QUESTION SCHEMA
// ============================================================

const questionSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
        },

        question: {
            type: String,
            required: true,
        },

        topic: {
            type: String,
            default: "Technical",
        },

        difficulty: {
            type: String,
            default: "Medium",
        },

        answer: {
            type: String,
            default: "",
        },

        score: {
            type: Number,
            default: 0,
        },

        feedback: {
            type: String,
            default: "",
        },

        correctness: {
            type: String,
            default: "",
        },

        relevance: {
            type: String,
            default: "",
        },

        clarity: {
            type: String,
            default: "",
        },

        strengths: {
            type: String,
            default: "",
        },

        improvements: {
            type: String,
            default: "",
        },

        submittedAt: {
            type: Date,
        },
    },
    {
        _id: false,
    }
);


// ============================================================
// INTERVIEW SCHEMA
// ============================================================

const interviewSchema = new mongoose.Schema(
    {
        // ----------------------------------------------------
        // USER
        // ----------------------------------------------------

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        // ----------------------------------------------------
        // INTERVIEW DETAILS
        // ----------------------------------------------------

        role: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: Number,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },


        // ----------------------------------------------------
        // QUESTIONS
        // ----------------------------------------------------

        questions: {
            type: [questionSchema],
            default: [],
        },


        // ----------------------------------------------------
        // FINAL SCORE
        // ----------------------------------------------------

        overallScore: {
            type: Number,
            default: null,
        },

        rating: {
            type: String,
            default: "",
        },


        // ----------------------------------------------------
        // FINAL REPORT
        // ----------------------------------------------------

        summary: {
            type: String,
            default: "",
        },

        strengths: {
            type: [String],
            default: [],
        },

        improvements: {
            type: [String],
            default: [],
        },

        recommendations: {
            type: [String],
            default: [],
        },

        finalFeedback: {
            type: String,
            default: "",
        },


        // ----------------------------------------------------
        // COMPLETION DATE
        // ----------------------------------------------------

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model(
    "Interview",
    interviewSchema
);