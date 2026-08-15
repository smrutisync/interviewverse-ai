import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Interview() {
    const navigate = useNavigate();

    const [role, setRole] = useState("Java Developer");
    const [experience, setExperience] = useState("0");
    const [difficulty, setDifficulty] = useState("Medium");
    const [loading, setLoading] = useState(false);

    const createInterview = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!role.trim()) {
            alert("Please select a job role");
            return;
        }

        if (experience === "") {
            alert("Please select your experience");
            return;
        }

        try {
            setLoading(true);

            // Get login token
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                navigate("/login");
                return;
            }

            // IMPORTANT:
            // Fresher = 0 years
            const experienceYears = Number(experience);

            const response = await axios.post(
                "http://localhost:5000/api/interviews",
                {
                    role: role.trim(),
                    experience: experienceYears,
                    difficulty: difficulty,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Interview created:", response.data);

            alert("Interview created successfully!");

            // Get interview ID from backend response
            const interviewId =
                response.data.interview?._id ||
                response.data.interview?.id ||
                response.data._id ||
                response.data.id;

            if (interviewId) {
                navigate(`/interview/${interviewId}`);
            } else {
                alert("Interview created, but interview ID was not returned.");
            }

        } catch (error) {
            console.error("CREATE INTERVIEW ERROR:", error);

            if (error.response) {
                alert(
                    `Failed: ${
                        error.response.data?.message ||
                        "Server error"
                    }`
                );
            } else if (error.request) {
                alert(
                    "Failed: Cannot connect to backend server."
                );
            } else {
                alert(
                    `Failed: ${error.message}`
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="interview-container">

            <h1>Start AI Interview</h1>

            <p>
                Configure your interview and let InterviewVerse AI
                prepare your session.
            </p>

            <form onSubmit={createInterview}>

                {/* JOB ROLE */}

                <div className="form-group">

                    <label>
                        Job Role
                    </label>

                    <input
                        type="text"
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                        placeholder="Enter job role"
                    />

                </div>


                {/* EXPERIENCE */}

                <div className="form-group">

                    <label>
                        Experience (Years)
                    </label>

                    <select
                        value={experience}
                        onChange={(e) =>
                            setExperience(e.target.value)
                        }
                    >

                        <option value="0">
                            Fresher
                        </option>

                        <option value="1">
                            1 Year
                        </option>

                        <option value="2">
                            2 Years
                        </option>

                        <option value="3">
                            3 Years
                        </option>

                        <option value="4">
                            4 Years
                        </option>

                        <option value="5">
                            5+ Years
                        </option>

                    </select>

                </div>


                {/* DIFFICULTY */}

                <div className="form-group">

                    <label>
                        Difficulty
                    </label>

                    <select
                        value={difficulty}
                        onChange={(e) =>
                            setDifficulty(e.target.value)
                        }
                    >

                        <option value="Easy">
                            Easy
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Hard">
                            Hard
                        </option>

                    </select>

                </div>


                {/* CREATE BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Creating..."
                        : "Create Interview"}

                </button>

            </form>

        </div>
    );
}

export default Interview;