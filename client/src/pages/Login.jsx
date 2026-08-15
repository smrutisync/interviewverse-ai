import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email: email.trim(),
                password: password,
            });

            console.log("LOGIN RESPONSE:", response.data);

            const token = response.data.token;

            if (!token) {
                alert("Login failed: Server did not return a token.");
                return;
            }

            // Save JWT
            localStorage.setItem("token", token);

            // Save user
            if (response.data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
            }

            console.log(
                "TOKEN SAVED:",
                localStorage.getItem("token")
            );

            alert("Login successful!");

            navigate("/");

        } catch (error) {
            console.error("LOGIN ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>InterviewVerse AI</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br />
                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

            <p>
                Don't have an account?{" "}
                <Link to="/register">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default Login;