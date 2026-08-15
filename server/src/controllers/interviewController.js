const Interview = require("../models/Interview");
const {
    generateQuestions,
    evaluateAnswer,
} = require("../services/aiService");


// ============================================================
// CREATE INTERVIEW
// ============================================================

const createInterview = async (req, res) => {
    try {

        const {
            role,
            experience,
            difficulty,
        } = req.body;


        console.log("=================================");
        console.log("CREATE INTERVIEW");
        console.log("Body:", req.body);
        console.log("User:", req.user);
        console.log("=================================");


        // ----------------------------------------------------
        // VALIDATE ROLE
        // ----------------------------------------------------

        if (!role || role.trim() === "") {

            return res.status(400).json({
                message: "Please select a job role",
            });
        }


        // ----------------------------------------------------
        // VALIDATE EXPERIENCE
        // ----------------------------------------------------

        if (
            experience === undefined ||
            experience === null ||
            experience === ""
        ) {

            return res.status(400).json({
                message: "Please select experience",
            });
        }


        const experienceYears =
            Number(experience);


        if (
            Number.isNaN(
                experienceYears
            )
        ) {

            return res.status(400).json({
                message:
                    "Experience must be a valid number",
            });
        }


        // ----------------------------------------------------
        // GET USER
        // ----------------------------------------------------

        const userId =
            req.user?._id ||
            req.user?.id;


        if (!userId) {

            return res.status(401).json({
                message:
                    "Not authorized, user not found",
            });
        }


        // ----------------------------------------------------
        // GENERATE QUESTIONS
        // ----------------------------------------------------

        console.log(
            "Generating interview questions..."
        );


        const questions =
            generateQuestions(
                role.trim(),
                experienceYears === 0
                    ? "Fresher"
                    : `${experienceYears} Years`,
                difficulty || "Medium"
            );


        console.log(
            "Questions generated:",
            questions.length
        );


        if (
            !questions ||
            questions.length === 0
        ) {

            return res.status(500).json({
                message:
                    "Unable to generate interview questions",
            });
        }


        // ----------------------------------------------------
        // CREATE INTERVIEW
        // ----------------------------------------------------

        const interview =
            await Interview.create({

                user: userId,

                role: role.trim(),

                experience:
                    experienceYears,

                difficulty:
                    difficulty || "Medium",

                status:
                    "Pending",

                questions:
                    questions.map(
                        (question) => ({

                            id:
                                question.id,

                            question:
                                question.question,

                            topic:
                                question.topic ||
                                "Technical",

                            difficulty:
                                question.difficulty ||
                                difficulty ||
                                "Medium",

                            answer:
                                "",

                            score:
                                0,

                            feedback:
                                "",

                            correctness:
                                "",

                            relevance:
                                "",

                            clarity:
                                "",

                            strengths:
                                "",

                            improvements:
                                "",

                        })
                    ),
            });


        console.log(
            "Interview created:",
            interview._id
        );


        // ----------------------------------------------------
        // RESPONSE
        // ----------------------------------------------------

        return res.status(201).json({

            message:
                "Interview created successfully",

            interview,

        });


    } catch (error) {

        console.error(
            "CREATE INTERVIEW ERROR:",
            error
        );


        return res.status(500).json({

            message:
                error.message ||
                "Server error",

        });
    }
};



// ============================================================
// GET ALL INTERVIEWS
// ============================================================

const getInterviews = async (req, res) => {

    try {

        const userId =
            req.user?._id ||
            req.user?.id;


        if (!userId) {

            return res.status(401).json({
                message:
                    "Not authorized",
            });
        }


        const interviews =
            await Interview.find({
                user: userId,
            })
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({

            message:
                "Interviews fetched successfully",

            interviews,

        });


    } catch (error) {

        console.error(
            "GET INTERVIEWS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                error.message ||
                "Server error",

        });
    }
};



// ============================================================
// GET SINGLE INTERVIEW
// ============================================================

const getInterviewById = async (req, res) => {

    try {

        const {
            id,
        } = req.params;


        const userId =
            req.user?._id ||
            req.user?.id;


        if (!userId) {

            return res.status(401).json({
                message:
                    "Not authorized",
            });
        }


        const interview =
            await Interview.findOne({

                _id: id,

                user: userId,

            });


        if (!interview) {

            return res.status(404).json({
                message:
                    "Interview not found",
            });
        }


        return res.status(200).json({

            message:
                "Interview fetched successfully",

            interview,

            // Explicitly return questions too
            questions:
                interview.questions,

        });


    } catch (error) {

        console.error(
            "GET INTERVIEW ERROR:",
            error
        );


        return res.status(500).json({

            message:
                error.message ||
                "Server error",

        });
    }
};



// ============================================================
// SUBMIT ANSWER
// ============================================================

const submitAnswer = async (req, res) => {

    try {

        const {
            id,
        } = req.params;


        const {
            questionId,
            question,
            answer,
        } = req.body;


        const userId =
            req.user?._id ||
            req.user?.id;


        if (!userId) {

            return res.status(401).json({
                message:
                    "Not authorized",
            });
        }


        // ----------------------------------------------------
        // VALIDATE ANSWER
        // ----------------------------------------------------

        if (
            !answer ||
            answer.trim() === ""
        ) {

            return res.status(400).json({
                message:
                    "Answer is required",
            });
        }


        // ----------------------------------------------------
        // FIND INTERVIEW
        // ----------------------------------------------------

        const interview =
            await Interview.findOne({

                _id: id,

                user: userId,

            });


        if (!interview) {

            return res.status(404).json({
                message:
                    "Interview not found",
            });
        }


        // ----------------------------------------------------
        // FIND QUESTION
        // ----------------------------------------------------

        let questionIndex = -1;


        if (
            questionId !== undefined &&
            questionId !== null
        ) {

            questionIndex =
                interview.questions.findIndex(
                    (item) =>
                        String(item.id) ===
                        String(questionId)
                );
        }


        // Fallback: find by question text

        if (
            questionIndex === -1 &&
            question
        ) {

            questionIndex =
                interview.questions.findIndex(
                    (item) =>
                        item.question ===
                        question
                );
        }


        // ----------------------------------------------------
        // QUESTION NOT FOUND
        // ----------------------------------------------------

        if (
            questionIndex === -1
        ) {

            return res.status(404).json({
                message:
                    "Question not found in this interview",
            });
        }


        const storedQuestion =
            interview.questions[
                questionIndex
            ];


        // ----------------------------------------------------
        // GEMINI EVALUATION
        // ----------------------------------------------------

        console.log(
            "Evaluating answer with Gemini..."
        );


        let evaluation;


        try {

            evaluation =
                await evaluateAnswer(

                    storedQuestion.question,

                    answer.trim(),

                    interview.role,

                    interview.difficulty

                );

        } catch (aiError) {

            console.error(
                "AI EVALUATION ERROR:",
                aiError
            );


            return res.status(503).json({

                message:
                    aiError.message ||
                    "AI evaluation failed. Please try again.",

            });
        }


        // ----------------------------------------------------
        // SAVE ANSWER
        // ----------------------------------------------------

        storedQuestion.answer =
            answer.trim();


        // ----------------------------------------------------
        // SAVE SCORE
        // ----------------------------------------------------

        storedQuestion.score =
            Number(evaluation.score) || 0;


        // ----------------------------------------------------
        // SAVE FEEDBACK
        // ----------------------------------------------------

        storedQuestion.feedback =
            evaluation.feedback || "";


        // ----------------------------------------------------
        // SAVE STRENGTHS
        // ----------------------------------------------------

        storedQuestion.strengths =
            Array.isArray(
                evaluation.strengths
            )
                ? evaluation.strengths.join(
                    " • "
                )
                : String(
                    evaluation.strengths || ""
                );


        // ----------------------------------------------------
        // SAVE IMPROVEMENTS
        // ----------------------------------------------------

        storedQuestion.improvements =
            Array.isArray(
                evaluation.improvements
            )
                ? evaluation.improvements.join(
                    " • "
                )
                : String(
                    evaluation.improvements || ""
                );


        // ----------------------------------------------------
        // SAVE DATE
        // ----------------------------------------------------

        storedQuestion.submittedAt =
            new Date();


        // ----------------------------------------------------
        // SAVE INTERVIEW
        // ----------------------------------------------------

        await interview.save();


        console.log(
            "Answer and evaluation saved."
        );


        // ----------------------------------------------------
        // RESPONSE
        // ----------------------------------------------------

        return res.status(200).json({

            message:
                "Answer evaluated successfully",

            evaluation,

            interview,

        });


    } catch (error) {

        console.error(
            "SUBMIT ANSWER ERROR:",
            error
        );


        return res.status(500).json({

            message:
                error.message ||
                "Server error",

        });
    }
};



// ============================================================
// COMPLETE INTERVIEW
// ============================================================

const completeInterview = async (req, res) => {

    try {

        const {
            id,
        } = req.params;


        const userId =
            req.user?._id ||
            req.user?.id;


        if (!userId) {

            return res.status(401).json({
                message:
                    "Not authorized",
            });
        }


        // ----------------------------------------------------
        // FIND INTERVIEW
        // ----------------------------------------------------

        const interview =
            await Interview.findOne({

                _id: id,

                user: userId,

            });


        if (!interview) {

            return res.status(404).json({
                message:
                    "Interview not found",
            });
        }


        // ----------------------------------------------------
        // GET ANSWERED QUESTIONS
        // ----------------------------------------------------

        const answeredQuestions =
            interview.questions.filter(
                (question) =>
                    question.answer &&
                    question.answer.trim() !== ""
            );


        // ----------------------------------------------------
        // CALCULATE SCORE
        // ----------------------------------------------------

        const scores =
            answeredQuestions
                .map(
                    (question) =>
                        Number(
                            question.score
                        )
                )
                .filter(
                    (score) =>
                        Number.isFinite(
                            score
                        )
                );


        let overallScore = null;


        if (scores.length > 0) {

            const total =
                scores.reduce(
                    (sum, score) =>
                        sum + score,
                    0
                );


            const average =
                total / scores.length;


            // Convert 0-10 to 0-100

            overallScore =
                Math.round(
                    average * 10
                );
        }


        // ----------------------------------------------------
        // RATING
        // ----------------------------------------------------

        let rating =
            "Needs Improvement";


        if (
            overallScore !== null
        ) {

            if (
                overallScore >= 90
            ) {

                rating =
                    "Excellent";

            } else if (
                overallScore >= 75
            ) {

                rating =
                    "Very Good";

            } else if (
                overallScore >= 60
            ) {

                rating =
                    "Good";

            } else if (
                overallScore >= 40
            ) {

                rating =
                    "Average";

            } else {

                rating =
                    "Needs Improvement";
            }
        }


        // ----------------------------------------------------
        // COLLECT STRENGTHS
        // ----------------------------------------------------

        const strengths = [];


        answeredQuestions.forEach(
            (question) => {

                if (
                    question.strengths
                ) {

                    strengths.push(
                        question.strengths
                    );
                }

            }
        );


        // ----------------------------------------------------
        // COLLECT IMPROVEMENTS
        // ----------------------------------------------------

        const improvements = [];


        answeredQuestions.forEach(
            (question) => {

                if (
                    question.improvements
                ) {

                    improvements.push(
                        question.improvements
                    );
                }

            }
        );


        // ----------------------------------------------------
        // RECOMMENDATIONS
        // ----------------------------------------------------

        const recommendations = [];


        if (
            overallScore === null
        ) {

            recommendations.push(
                "Complete the interview questions to receive a performance score."
            );

        } else if (
            overallScore >= 80
        ) {

            recommendations.push(
                "Continue practicing advanced technical interview questions."
            );

            recommendations.push(
                "Focus on explaining your solutions clearly and confidently."
            );

        } else if (
            overallScore >= 60
        ) {

            recommendations.push(
                "Strengthen your core technical concepts."
            );

            recommendations.push(
                "Practice answering interview questions with more structure."
            );

        } else {

            recommendations.push(
                "Revise fundamental technical concepts."
            );

            recommendations.push(
                "Practice more mock interviews before attending real interviews."
            );
        }


        recommendations.push(
            "Review the AI feedback provided for each question."
        );


        // ----------------------------------------------------
        // SUMMARY
        // ----------------------------------------------------

        let summary =
            "You completed the AI-powered interview.";


        if (
            overallScore !== null
        ) {

            summary =
                `You completed ${answeredQuestions.length} of ${interview.questions.length} interview questions with an overall score of ${overallScore}/100. Your performance was rated ${rating}.`;
        }


        // ----------------------------------------------------
        // FINAL FEEDBACK
        // ----------------------------------------------------

        let finalFeedback =
            "Great job completing the interview! Review the feedback and continue practicing.";


        if (
            overallScore !== null
        ) {

            if (
                overallScore >= 80
            ) {

                finalFeedback =
                    "Excellent performance! You demonstrated strong understanding and communication. Keep practicing advanced concepts to become even more interview-ready.";

            } else if (
                overallScore >= 60
            ) {

                finalFeedback =
                    "Good performance! You have a solid foundation. Focus on the improvement areas identified by the AI to strengthen your interview performance.";

            } else {

                finalFeedback =
                    "You completed the interview successfully. Use the AI feedback to identify weak areas and practice those concepts before your next interview.";
            }
        }


        // ----------------------------------------------------
        // MARK COMPLETED
        // ----------------------------------------------------

        interview.status =
            "Completed";


        interview.overallScore =
            overallScore;


        interview.rating =
            rating;


        interview.summary =
            summary;


        interview.strengths =
            strengths;


        interview.improvements =
            improvements;


        interview.recommendations =
            recommendations;


        interview.finalFeedback =
            finalFeedback;


        interview.completedAt =
            new Date();


        // ----------------------------------------------------
        // SAVE
        // ----------------------------------------------------

        await interview.save();


        console.log(
            "Interview completed:",
            interview._id
        );


        // ----------------------------------------------------
        // RESPONSE
        // ----------------------------------------------------

        return res.status(200).json({

            message:
                "Interview completed successfully",

            interview,

            finalEvaluation: {

                overallScore,

                rating,

                summary,

                strengths,

                weaknesses:
                    improvements,

                recommendations,

                finalFeedback,

            },

        });


    } catch (error) {

        console.error(
            "COMPLETE INTERVIEW ERROR:",
            error
        );


        return res.status(500).json({

            message:
                error.message ||
                "Server error",

        });
    }
};



// ============================================================
// DELETE INTERVIEW
// ============================================================

const deleteInterview = async (req, res) => {

    try {

        const {
            id,
        } = req.params;


        const userId =
            req.user?._id ||
            req.user?.id;


        if (!userId) {

            return res.status(401).json({
                message:
                    "Not authorized",
            });
        }


        const interview =
            await Interview.findOne({

                _id: id,

                user: userId,

            });


        if (!interview) {

            return res.status(404).json({
                message:
                    "Interview not found",
            });
        }


        await Interview.findByIdAndDelete(
            id
        );


        return res.status(200).json({

            message:
                "Interview deleted successfully",

        });


    } catch (error) {

        console.error(
            "DELETE INTERVIEW ERROR:",
            error
        );


        return res.status(500).json({

            message:
                error.message ||
                "Server error",

        });
    }
};



// ============================================================
// EXPORT
// ============================================================

module.exports = {

    createInterview,

    getInterviews,

    getInterviewById,

    submitAnswer,

    completeInterview,

    deleteInterview,

};