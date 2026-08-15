import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function InterviewSession() {
    const { id } = useParams();
    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [interview, setInterview] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answer, setAnswer] = useState("");

    // Current question AI evaluation
    const [evaluation, setEvaluation] = useState(null);

    // Store evaluation of EVERY question
    const [evaluations, setEvaluations] = useState([]);

    // Final report
    const [finalEvaluation, setFinalEvaluation] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const token = localStorage.getItem("token");


    // =========================================================
    // LOAD INTERVIEW
    // =========================================================

    useEffect(() => {
        const loadInterview = async () => {
            try {
                setLoading(true);
                setError("");

                if (!token) {
                    navigate("/login");
                    return;
                }

                if (!id) {
                    setError("Interview ID is missing.");
                    return;
                }

                const response = await axios.get(
                    `${API_URL}/interviews/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(
                    "INTERVIEW RESPONSE:",
                    response.data
                );

                const interviewData =
                    response.data?.interview;

                if (!interviewData) {
                    setError(
                        "Interview data not found."
                    );
                    return;
                }

                setInterview(interviewData);


                // -------------------------------------------------
                // GET QUESTIONS
                // -------------------------------------------------

                let generatedQuestions =
                    response.data?.questions ||
                    interviewData.questions ||
                    [];

                if (
                    !Array.isArray(
                        generatedQuestions
                    )
                ) {
                    generatedQuestions = [];
                }

                console.log(
                    "GENERATED QUESTIONS:",
                    generatedQuestions
                );

                if (
                    generatedQuestions.length === 0
                ) {
                    setError(
                        "No interview questions were generated."
                    );
                    return;
                }

                setQuestions(
                    generatedQuestions
                );

            } catch (err) {
                console.error(
                    "LOAD INTERVIEW ERROR:",
                    err
                );

                if (err.response) {
                    setError(
                        err.response.data?.message ||
                        "Failed to load interview."
                    );
                } else if (err.request) {
                    setError(
                        "Cannot connect to backend server."
                    );
                } else {
                    setError(
                        err.message ||
                        "Something went wrong."
                    );
                }

            } finally {
                setLoading(false);
            }
        };

        loadInterview();

    }, [id, navigate, token]);


    // =========================================================
    // SUBMIT ANSWER
    // =========================================================

    const submitAnswer = async () => {

        if (!answer.trim()) {
            alert(
                "Please enter your answer."
            );
            return;
        }

        const current =
            questions[currentQuestion];

        if (!current) {
            alert(
                "Question not found."
            );
            return;
        }

        try {

            setSubmitting(true);

            const questionText =
                current.question ||
                current.text ||
                "";

            const questionId =
                current.questionId ||
                current.id ||
                `q${currentQuestion + 1}`;


            const response = await axios.post(
                `${API_URL}/interviews/${id}/answer`,
                {
                    questionId,
                    question: questionText,
                    answer: answer.trim(),
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );


            console.log(
                "ANSWER RESPONSE:",
                response.data
            );


            // -------------------------------------------------
            // GET GEMINI EVALUATION
            // -------------------------------------------------

            const aiEvaluation =
                response.data?.evaluation ||
                response.data?.aiEvaluation ||
                null;


            if (aiEvaluation) {

                console.log(
                    "AI EVALUATION:",
                    aiEvaluation
                );

                setEvaluation(
                    aiEvaluation
                );


                // Save evaluation for final report
                setEvaluations(
                    (previous) => [
                        ...previous,
                        {
                            questionNumber:
                                currentQuestion + 1,

                            question:
                                questionText,

                            answer:
                                answer.trim(),

                            evaluation:
                                aiEvaluation,
                        },
                    ]
                );

            } else {

                console.warn(
                    "No AI evaluation returned."
                );


                const fallbackEvaluation = {
                    score: "N/A",

                    correctness:
                        "Answer submitted successfully.",

                    relevance:
                        "AI evaluation was not returned.",

                    clarity:
                        "Your answer has been recorded.",

                    strengths:
                        "Answer submitted successfully.",

                    improvements:
                        "Detailed AI improvement was not returned.",

                    feedback:
                        "You can continue to the next question.",
                };


                setEvaluation(
                    fallbackEvaluation
                );


                setEvaluations(
                    (previous) => [
                        ...previous,
                        {
                            questionNumber:
                                currentQuestion + 1,

                            question:
                                questionText,

                            answer:
                                answer.trim(),

                            evaluation:
                                fallbackEvaluation,
                        },
                    ]
                );
            }


            setAnswer("");

        } catch (err) {

            console.error(
                "SUBMIT ANSWER ERROR:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to submit answer."
            );

        } finally {

            setSubmitting(false);
        }
    };


    // =========================================================
    // NEXT QUESTION
    // =========================================================

    const nextQuestion = async () => {

        setEvaluation(null);

        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                currentQuestion + 1
            );

        } else {

            await completeInterview();
        }
    };


    // =========================================================
    // GENERATE FINAL REPORT
    // =========================================================

    const generateFinalReport = (
        allEvaluations
    ) => {

        // -----------------------------------------------------
        // Extract valid scores
        // -----------------------------------------------------

        const scores =
            allEvaluations
                .map((item) => {
                    const score =
                        Number(
                            item?.evaluation?.score
                        );

                    return Number.isFinite(
                        score
                    )
                        ? score
                        : null;
                })
                .filter(
                    (score) =>
                        score !== null
                );


        // -----------------------------------------------------
        // Overall score
        // -----------------------------------------------------

        let overallScore = "N/A";

        if (scores.length > 0) {

            const total =
                scores.reduce(
                    (sum, score) =>
                        sum + score,
                    0
                );

            const average =
                total / scores.length;

            overallScore =
                Math.round(
                    average * 10
                );
        }


        // -----------------------------------------------------
        // Rating
        // -----------------------------------------------------

        let rating =
            "Needs Improvement";

        if (
            overallScore !== "N/A"
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


        // -----------------------------------------------------
        // Strengths
        // -----------------------------------------------------

        const strengths =
            allEvaluations
                .map(
                    (item) =>
                        item?.evaluation
                            ?.strengths
                )
                .filter(
                    (item) =>
                        item &&
                        item !== "N/A"
                );


        // -----------------------------------------------------
        // Improvements
        // -----------------------------------------------------

        const improvements =
            allEvaluations
                .map(
                    (item) =>
                        item?.evaluation
                            ?.improvements
                )
                .filter(
                    (item) =>
                        item &&
                        item !== "N/A"
                );


        // -----------------------------------------------------
        // Recommendations
        // -----------------------------------------------------

        const recommendations = [];


        if (
            overallScore !== "N/A"
        ) {

            if (
                overallScore >= 80
            ) {

                recommendations.push(
                    "Continue practicing advanced Java interview questions."
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
        }


        recommendations.push(
            "Review the AI feedback provided for each question."
        );


        // -----------------------------------------------------
        // Summary
        // -----------------------------------------------------

        let summary =
            "You successfully completed the AI-powered interview.";

        if (
            overallScore !== "N/A"
        ) {

            summary =
                `You completed all ${allEvaluations.length} interview questions with an overall score of ${overallScore}/100. Your performance was rated ${rating}.`;
        }


        // -----------------------------------------------------
        // Final feedback
        // -----------------------------------------------------

        let finalFeedback =
            "Great job completing the interview! Review the feedback and continue practicing.";

        if (
            overallScore !== "N/A"
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


        return {
            overallScore,
            rating,
            summary,
            strengths,
            weaknesses:
                improvements,
            recommendations,
            finalFeedback,
        };
    };


    // =========================================================
    // COMPLETE INTERVIEW
    // =========================================================

    const completeInterview = async () => {

        try {

            setSubmitting(true);


            const response = await axios.put(
                `${API_URL}/interviews/${id}/complete`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            console.log(
                "COMPLETE RESPONSE:",
                response.data
            );


            // -------------------------------------------------
            // Use backend report if available
            // -------------------------------------------------

            const backendReport =
                response.data?.finalEvaluation ||
                response.data?.evaluation ||
                response.data?.report ||
                null;


            if (backendReport) {

                setFinalEvaluation(
                    backendReport
                );

            } else {

                // -------------------------------------------------
                // Generate report from all evaluations
                // -------------------------------------------------

                const report =
                    generateFinalReport(
                        evaluations
                    );

                setFinalEvaluation(
                    report
                );
            }


        } catch (err) {

            console.error(
                "COMPLETE INTERVIEW ERROR:",
                err
            );


            // -------------------------------------------------
            // Even if completion endpoint fails,
            // generate local report if evaluations exist.
            // -------------------------------------------------

            if (
                evaluations.length > 0
            ) {

                const report =
                    generateFinalReport(
                        evaluations
                    );

                setFinalEvaluation(
                    report
                );

            } else {

                alert(
                    err.response?.data?.message ||
                    "Failed to complete interview."
                );
            }

        } finally {

            setSubmitting(false);
        }
    };


    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {

        return (
            <div className="interview-session">

                <h1>
                    InterviewVerse AI
                </h1>

                <h2>
                    Preparing your AI interview...
                </h2>

                <p>
                    Gemini is preparing your
                    personalized questions.
                </p>

            </div>
        );
    }


    // =========================================================
    // ERROR SCREEN
    // =========================================================

    if (error) {

        return (
            <div className="interview-session">

                <h1>
                    Interview Error
                </h1>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Back to Home
                </button>

            </div>
        );
    }


    // =========================================================
    // FINAL REPORT
    // =========================================================

    if (finalEvaluation) {

        return (
            <div className="interview-session">

                {/* HEADER */}

                <div className="interview-header">

                    <h1>
                        InterviewVerse AI
                    </h1>

                    <h2>
                        🎉 Interview Complete
                    </h2>

                    <p>
                        AI-Powered Interview Report
                    </p>

                </div>


                {/* FINAL SCORE */}

                <div className="final-result">

                    <h2>
                        Overall Score
                    </h2>

                    <div className="score">

                        {finalEvaluation.overallScore}

                        {finalEvaluation.overallScore !==
                        "N/A"
                            ? "/100"
                            : ""}

                    </div>


                    {/* RATING */}

                    <h2>
                        Rating
                    </h2>

                    <p>
                        {finalEvaluation.rating}
                    </p>


                    {/* SUMMARY */}

                    <h2>
                        Summary
                    </h2>

                    <p>
                        {finalEvaluation.summary}
                    </p>


                    {/* STRENGTHS */}

                    <h2>
                        💪 Strengths
                    </h2>

                    <ul>

                        {Array.isArray(
                            finalEvaluation.strengths
                        ) &&
                            finalEvaluation.strengths.map(
                                (item, index) => (

                                    <li
                                        key={index}
                                    >
                                        {item}
                                    </li>

                                )
                            )}

                    </ul>


                    {/* IMPROVEMENTS */}

                    <h2>
                        🔧 Areas to Improve
                    </h2>

                    <ul>

                        {Array.isArray(
                            finalEvaluation.weaknesses
                        ) &&
                            finalEvaluation.weaknesses.map(
                                (item, index) => (

                                    <li
                                        key={index}
                                    >
                                        {item}
                                    </li>

                                )
                            )}

                    </ul>


                    {/* RECOMMENDATIONS */}

                    <h2>
                        🎯 Recommendations
                    </h2>

                    <ul>

                        {Array.isArray(
                            finalEvaluation.recommendations
                        ) &&
                            finalEvaluation.recommendations.map(
                                (item, index) => (

                                    <li
                                        key={index}
                                    >
                                        {item}
                                    </li>

                                )
                            )}

                    </ul>


                    {/* FINAL FEEDBACK */}

                    <h2>
                        🤖 Final AI Feedback
                    </h2>

                    <p>
                        {finalEvaluation.finalFeedback}
                    </p>


                    {/* QUESTION SUMMARY */}

                    <h2>
                        📋 Question Summary
                    </h2>

                    {evaluations.map(
                        (item, index) => (

                            <div
                                key={index}
                                className="question-summary"
                            >

                                <h3>
                                    Question{" "}
                                    {item.questionNumber}
                                </h3>

                                <p>
                                    <strong>
                                        Question:
                                    </strong>{" "}
                                    {item.question}
                                </p>

                                <p>
                                    <strong>
                                        Score:
                                    </strong>{" "}
                                    {
                                        item.evaluation
                                            ?.score
                                    }/10
                                </p>

                            </div>

                        )
                    )}


                    {/* BUTTONS */}

                    <div
                        className="final-buttons"
                    >

                        <button
                            onClick={() =>
                                navigate(
                                    "/interview"
                                )
                            }
                        >
                            🔄 Take Another Interview
                        </button>


                        <button
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            🏠 Back to Dashboard
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =========================================================
    // NO QUESTIONS
    // =========================================================

    if (
        !questions ||
        questions.length === 0
    ) {

        return (
            <div className="interview-session">

                <h1>
                    No Questions Available
                </h1>

                <p>
                    Gemini could not generate
                    interview questions.
                </p>

                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Back to Home
                </button>

            </div>
        );
    }


    // =========================================================
    // CURRENT QUESTION
    // =========================================================

    const current =
        questions[currentQuestion];


    const questionText =
        current?.question ||
        current?.text ||
        "Question unavailable";


    const progress =
        (
            (currentQuestion + 1) /
            questions.length
        ) * 100;


    // =========================================================
    // MAIN INTERVIEW SCREEN
    // =========================================================

    return (
        <div className="interview-session">

            {/* HEADER */}

            <div className="interview-header">

                <h1>
                    InterviewVerse AI
                </h1>

                <p>
                    AI-Powered Interview Session
                </p>

            </div>


            {/* INTERVIEW INFORMATION */}

            {interview && (

                <div className="interview-info">

                    <div>

                        <strong>
                            Role:
                        </strong>{" "}

                        {interview.role}

                    </div>


                    <div>

                        <strong>
                            Experience:
                        </strong>{" "}

                        {Number(
                            interview.experience
                        ) === 0

                            ? "Fresher"

                            : `${interview.experience} Years`}

                    </div>


                    <div>

                        <strong>
                            Difficulty:
                        </strong>{" "}

                        {interview.difficulty}

                    </div>

                </div>
            )}


            {/* PROGRESS */}

            <div className="interview-progress">

                <p>

                    Question{" "}

                    {currentQuestion + 1}

                    {" "}of{" "}

                    {questions.length}

                </p>


                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width:
                                `${progress}%`,
                        }}
                    />

                </div>

            </div>


            {/* QUESTION */}

            <div className="question-card">

                <h2>

                    Question{" "}

                    {currentQuestion + 1}

                </h2>


                <p>

                    {questionText}

                </p>

            </div>


            {/* ANSWER */}

            {!evaluation && (

                <div className="answer-section">

                    <label>
                        Your Answer
                    </label>


                    <textarea
                        value={answer}
                        onChange={(e) =>
                            setAnswer(
                                e.target.value
                            )
                        }
                        placeholder="Type your answer here..."
                        rows="8"
                        disabled={
                            submitting
                        }
                    />


                    <button
                        onClick={
                            submitAnswer
                        }
                        disabled={
                            submitting
                        }
                    >

                        {submitting

                            ? "Evaluating with Gemini..."

                            : "Submit Answer"}

                    </button>

                </div>
            )}


            {/* AI FEEDBACK */}

            {evaluation && (

                <div className="evaluation-card">

                    <h2>
                        🤖 AI Feedback
                    </h2>


                    <h3>
                        Score
                    </h3>

                    <p>

                        <strong>

                            {evaluation.score}

                            {evaluation.score !==
                            "N/A"
                                ? "/10"
                                : ""}

                        </strong>

                    </p>


                    <h3>
                        Correctness
                    </h3>

                    <p>
                        {evaluation.correctness}
                    </p>


                    <h3>
                        Relevance
                    </h3>

                    <p>
                        {evaluation.relevance}
                    </p>


                    <h3>
                        Clarity
                    </h3>

                    <p>
                        {evaluation.clarity}
                    </p>


                    <h3>
                        Strengths
                    </h3>

                    <p>
                        {evaluation.strengths}
                    </p>


                    <h3>
                        Improvements
                    </h3>

                    <p>
                        {evaluation.improvements}
                    </p>


                    <h3>
                        Feedback
                    </h3>

                    <p>
                        {evaluation.feedback}
                    </p>


                    <button
                        onClick={
                            nextQuestion
                        }
                        disabled={
                            submitting
                        }
                    >

                        {currentQuestion ===
                        questions.length - 1

                            ? "Generate Final Report"

                            : "Next Question →"}

                    </button>

                </div>
            )}

        </div>
    );
}

export default InterviewSession;