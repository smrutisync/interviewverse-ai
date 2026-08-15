const express = require("express");

const router = express.Router();

const interviewController = require("../controllers/interviewController");

const {
    protect,
} = require("../middleware/authMiddleware");


// ============================================================
// CREATE INTERVIEW
// POST /api/interviews
// ============================================================

router.post(
    "/",
    protect,
    interviewController.createInterview
);


// ============================================================
// GET ALL INTERVIEWS
// GET /api/interviews
// ============================================================

router.get(
    "/",
    protect,
    interviewController.getInterviews
);


// ============================================================
// GET SINGLE INTERVIEW
// GET /api/interviews/:id
// ============================================================

router.get(
    "/:id",
    protect,
    interviewController.getInterviewById
);


// ============================================================
// SUBMIT ANSWER
// POST /api/interviews/:id/answer
// ============================================================

router.post(
    "/:id/answer",
    protect,
    interviewController.submitAnswer
);


// ============================================================
// COMPLETE INTERVIEW
// PUT /api/interviews/:id/complete
// ============================================================

router.put(
    "/:id/complete",
    protect,
    interviewController.completeInterview
);


// ============================================================
// DELETE INTERVIEW
// DELETE /api/interviews/:id
// ============================================================

router.delete(
    "/:id",
    protect,
    interviewController.deleteInterview
);


module.exports = router;