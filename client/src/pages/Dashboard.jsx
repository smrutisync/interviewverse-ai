import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Dashboard() {

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ============================================================
    // GET INTERVIEWS
    // ============================================================

    const fetchInterviews = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");


            // ----------------------------------------------------
            // TOKEN CHECK
            // ----------------------------------------------------

            if (!token) {

                alert("Please login first");

                navigate("/login");

                return;
            }


            // ----------------------------------------------------
            // API REQUEST
            // ----------------------------------------------------

            const response = await axios.get(
                "http://localhost:5000/api/interviews",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            console.log(
                "INTERVIEWS:",
                response.data
            );


            // ----------------------------------------------------
            // SAVE INTERVIEWS
            // ----------------------------------------------------

            setInterviews(
                Array.isArray(response.data.interviews)
                    ? response.data.interviews
                    : []
            );

        }

        catch (err) {

            console.error(
                "FETCH INTERVIEWS ERROR:",
                err
            );


            // ----------------------------------------------------
            // UNAUTHORIZED
            // ----------------------------------------------------

            if (
                err.response &&
                err.response.status === 401
            ) {

                localStorage.removeItem("token");

                alert(
                    "Your session has expired. Please login again."
                );

                navigate("/login");

                return;
            }


            // ----------------------------------------------------
            // ERROR MESSAGE
            // ----------------------------------------------------

            setError(
                err.response?.data?.message ||
                "Unable to load interviews."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ============================================================
    // LOAD DATA
    // ============================================================

    useEffect(() => {

        fetchInterviews();

    }, []);


    // ============================================================
    // DELETE INTERVIEW
    // ============================================================

    const deleteInterview = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this interview?"
        );


        if (!confirmed) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            await axios.delete(
                `http://localhost:5000/api/interviews/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            // ----------------------------------------------------
            // REMOVE FROM UI
            // ----------------------------------------------------

            setInterviews((previous) =>
                previous.filter(
                    (interview) =>
                        interview._id !== id
                )
            );


            alert(
                "Interview deleted successfully."
            );

        }

        catch (err) {

            console.error(
                "DELETE INTERVIEW ERROR:",
                err
            );


            alert(
                err.response?.data?.message ||
                "Failed to delete interview."
            );

        }

    };


    // ============================================================
    // LOGOUT
    // ============================================================

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };


    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }


        try {

            return new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        }

        catch {

            return "N/A";

        }

    };


    // ============================================================
    // GET SCORE
    // ============================================================

    const getScore = (interview) => {

        // Direct score

        if (
            typeof interview.score === "number"
        ) {

            return interview.score;

        }


        // Overall score

        if (
            typeof interview.overallScore === "number"
        ) {

            return interview.overallScore;

        }


        // Feedback score

        if (
            typeof interview.totalScore === "number"
        ) {

            return interview.totalScore;

        }


        return null;

    };


    // ============================================================
    // GET STATUS
    // ============================================================

    const getStatus = (interview) => {

        if (
            interview.status === "completed"
        ) {

            return "Completed";

        }


        return "In Progress";

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div className="dashboard-container">


            {/* ==================================================
                HEADER
            =================================================== */}

            <header className="dashboard-header">

                <div>

                    <h1>
                        InterviewVerse AI
                    </h1>

                    <p>
                        Your Interview Dashboard
                    </p>

                </div>


                <div className="dashboard-actions">

                    <button
                        onClick={() =>
                            navigate("/interview")
                        }
                    >
                        + New Interview
                    </button>


                    <button
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>



            {/* ==================================================
                MAIN CONTENT
            =================================================== */}

            <main className="dashboard-content">


                {/* ==================================================
                    WELCOME
                =================================================== */}

                <section className="dashboard-welcome">

                    <h2>
                        Welcome back 👋
                    </h2>

                    <p>
                        Practice interviews, improve your answers,
                        and track your performance.
                    </p>

                </section>



                {/* ==================================================
                    STATISTICS
                =================================================== */}

                <section className="dashboard-stats">


                    <div className="stat-card">

                        <h3>
                            Total Interviews
                        </h3>

                        <strong>
                            {interviews.length}
                        </strong>

                    </div>



                    <div className="stat-card">

                        <h3>
                            Completed
                        </h3>

                        <strong>

                            {
                                interviews.filter(
                                    (interview) =>
                                        interview.status ===
                                        "completed"
                                ).length
                            }

                        </strong>

                    </div>



                    <div className="stat-card">

                        <h3>
                            In Progress
                        </h3>

                        <strong>

                            {
                                interviews.filter(
                                    (interview) =>
                                        interview.status !==
                                        "completed"
                                ).length
                            }

                        </strong>

                    </div>


                </section>



                {/* ==================================================
                    INTERVIEW HISTORY
                =================================================== */}

                <section className="interview-history">


                    <div className="section-title">

                        <h2>
                            Interview History
                        </h2>

                        <button
                            onClick={fetchInterviews}
                        >
                            Refresh
                        </button>

                    </div>



                    {/* ==================================================
                        LOADING
                    =================================================== */}

                    {loading && (

                        <div className="dashboard-message">

                            <h3>
                                Loading interviews...
                            </h3>

                            <p>
                                Please wait.
                            </p>

                        </div>

                    )}



                    {/* ==================================================
                        ERROR
                    =================================================== */}

                    {!loading && error && (

                        <div className="dashboard-message error">

                            <h3>
                                Something went wrong
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                onClick={fetchInterviews}
                            >
                                Try Again
                            </button>

                        </div>

                    )}



                    {/* ==================================================
                        NO INTERVIEWS
                    =================================================== */}

                    {!loading &&
                        !error &&
                        interviews.length === 0 && (

                            <div className="dashboard-message">

                                <h3>
                                    No interviews yet 🚀
                                </h3>

                                <p>
                                    Start your first AI-powered
                                    interview.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/interview")
                                    }
                                >
                                    Start Interview
                                </button>

                            </div>

                        )}



                    {/* ==================================================
                        INTERVIEW CARDS
                    =================================================== */}

                    {!loading &&
                        !error &&
                        interviews.length > 0 && (

                            <div className="interview-list">

                                {interviews.map(
                                    (interview) => {

                                        const score =
                                            getScore(interview);

                                        const status =
                                            getStatus(interview);


                                        return (

                                            <div
                                                className="interview-card"
                                                key={interview._id}
                                            >


                                                {/* ROLE */}

                                                <div className="interview-card-main">

                                                    <h3>

                                                        {interview.role ||
                                                            "Interview"}

                                                    </h3>


                                                    <p>

                                                        Experience:{" "}

                                                        {
                                                            interview.experience ===
                                                            0
                                                                ? "Fresher"
                                                                : `${interview.experience} Years`
                                                        }

                                                    </p>


                                                    <p>

                                                        Difficulty:{" "}

                                                        {
                                                            interview.difficulty ||
                                                            "Medium"
                                                        }

                                                    </p>


                                                    <p>

                                                        Created:{" "}

                                                        {
                                                            formatDate(
                                                                interview.createdAt
                                                            )
                                                        }

                                                    </p>

                                                </div>



                                                {/* STATUS */}

                                                <div className="interview-card-status">

                                                    <span
                                                        className={
                                                            status ===
                                                            "Completed"
                                                                ? "status completed"
                                                                : "status progress"
                                                        }
                                                    >

                                                        {status}

                                                    </span>


                                                    <div className="score">

                                                        {
                                                            score !==
                                                            null
                                                                ? `${score}/100`
                                                                : "Not evaluated"
                                                        }

                                                    </div>

                                                </div>



                                                {/* ACTIONS */}

                                                <div className="interview-card-actions">


                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/interview/${interview._id}`
                                                            )
                                                        }
                                                    >

                                                        {
                                                            status ===
                                                            "Completed"
                                                                ? "View Report"
                                                                : "Continue"
                                                        }

                                                    </button>



                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteInterview(
                                                                interview._id
                                                            )
                                                        }
                                                    >

                                                        Delete

                                                    </button>


                                                </div>


                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                </section>

            </main>

        </div>

    );

}


export default Dashboard;