import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Interview from "./pages/Interview";
import InterviewSession from "./pages/InterviewSession";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    HOME
                ========================== */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* =========================
                    LOGIN
                ========================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    REGISTER
                ========================== */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    DASHBOARD
                ========================== */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
    path="/profile"
    element={<Profile />}
/>


                {/* =========================
                    CREATE INTERVIEW
                ========================== */}

                <Route
                    path="/interview"
                    element={<Interview />}
                />


                {/* =========================
                    INTERVIEW SESSION
                ========================== */}

                <Route
                    path="/interview/:id"
                    element={<InterviewSession />}
                />


                {/* =========================
                    UNKNOWN ROUTE
                ========================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;