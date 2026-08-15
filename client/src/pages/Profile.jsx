import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:5000/api/auth/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(response.data.user);

            } catch (error) {
                console.error("PROFILE ERROR:", error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div style={styles.container}>
                <h2>Loading profile...</h2>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            <div style={styles.card}>

                <h1>👤 My Profile</h1>

                {user ? (
                    <>
                        <div style={styles.info}>
                            <strong>Name</strong>
                            <span>
                                {user.name || "Not available"}
                            </span>
                        </div>

                        <div style={styles.info}>
                            <strong>Email</strong>
                            <span>
                                {user.email || "Not available"}
                            </span>
                        </div>

                        <div style={styles.info}>
                            <strong>Account</strong>
                            <span>InterviewVerse AI</span>
                        </div>
                    </>
                ) : (
                    <p>Unable to load profile.</p>
                )}

                <button
                    onClick={() => navigate("/dashboard")}
                    style={styles.button}
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
    },

    card: {
        width: "400px",
        padding: "40px",
        background: "#1f2937",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        textAlign: "center",
    },

    info: {
        display: "flex",
        justifyContent: "space-between",
        padding: "18px 5px",
        borderBottom: "1px solid #374151",
        marginBottom: "5px",
    },

    button: {
        marginTop: "30px",
        padding: "12px 25px",
        border: "none",
        borderRadius: "7px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default Profile;