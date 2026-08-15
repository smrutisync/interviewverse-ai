import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={styles.container}>

            {/* =========================
                NAVBAR
            ========================== */}

            <nav style={styles.navbar}>

                <h2 style={styles.logo}>
                    InterviewVerse AI
                </h2>

                <button
                    onClick={handleLogout}
                    style={styles.logout}
                >
                    Logout
                </button>

            </nav>


            {/* =========================
                MAIN CONTENT
            ========================== */}

            <main style={styles.main}>

                <h1 style={styles.heading}>
                    Welcome to InterviewVerse AI 👋
                </h1>

                <p style={styles.subtitle}>
                    Your AI-powered interview preparation platform.
                </p>


                {/* =========================
                    CARDS
                ========================== */}

                <div style={styles.cards}>


                    {/* START INTERVIEW */}

                    <div style={styles.card}>

                        <h2>
                            🎯 Start Interview
                        </h2>

                        <p>
                            Practice a mock interview and improve your
                            interview skills.
                        </p>

                        <Link
                            to="/interview"
                            style={styles.button}
                        >
                            Start Interview
                        </Link>

                    </div>


                    {/* INTERVIEW HISTORY */}

                    <div style={styles.card}>

                        <h2>
                            📚 Interview History
                        </h2>

                        <p>
                            View your previous interviews and track your
                            progress.
                        </p>

                        {/* IMPORTANT:
                            Dashboard route is /dashboard
                        */}

                       <Link to="/dashboard" style={styles.button}>
    View History
</Link>

                    </div>


                    {/* PROFILE */}

                    <div style={styles.card}>

                        <h2>
                            👤 Profile
                        </h2>

                        <p>
                            Manage your account and personal information.
                        </p>

                        <Link to="/profile" style={styles.button}>
    View Profile
</Link>

                    </div>


                </div>

            </main>

        </div>
    );
}


/* ============================================================
   STYLES
============================================================ */

const styles = {

    container: {
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        fontFamily: "Arial, sans-serif",
    },


    /* =========================
       NAVBAR
    ========================== */

    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        background: "#1f2937",
    },


    logo: {
        margin: 0,
    },


    logout: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#ef4444",
        color: "white",
        fontWeight: "bold",
    },


    /* =========================
       MAIN
    ========================== */

    main: {
        textAlign: "center",
        padding: "60px 30px",
    },


    heading: {
        fontSize: "42px",
        marginBottom: "15px",
    },


    subtitle: {
        color: "#9ca3af",
        fontSize: "18px",
        marginBottom: "50px",
    },


    /* =========================
       CARDS
    ========================== */

    cards: {
        display: "flex",
        justifyContent: "center",
        gap: "25px",
        flexWrap: "wrap",
    },


    card: {
        width: "280px",
        padding: "30px",
        background: "#1f2937",
        borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
    },


    /* =========================
       BUTTON
    ========================== */

    button: {
        display: "inline-block",
        marginTop: "15px",
        padding: "10px 20px",
        background: "#2563eb",
        color: "white",
        textDecoration: "none",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },

};


export default Home;