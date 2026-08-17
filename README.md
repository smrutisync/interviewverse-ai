# 🚀 InterviewVerse AI

### AI-Powered Interview Preparation & Evaluation Platform

InterviewVerse AI is a full-stack AI-powered interview preparation platform designed to help students and freshers practice technical interviews in an interactive environment.

The platform allows users to create mock interviews based on job role, experience level, and difficulty, answer interview questions, receive AI-powered evaluation using Google Gemini, and track their interview performance through a dashboard.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Protected routes and APIs
- User-specific interview data

### 🎯 Interview Management
- Create mock interviews
- Select job role
- Select experience level
- Select interview difficulty
- Generate 10-question interview sessions
- Continue in-progress interviews
- Complete interviews
- Delete previous interviews

### 🤖 AI-Powered Evaluation
Google Gemini AI evaluates each submitted answer based on:

- Technical correctness
- Relevance
- Clarity
- Completeness

The system provides:

- Score out of 10
- Overall feedback
- Strengths
- Areas for improvement
- Practical improvement suggestions

### 📊 Dashboard
The dashboard allows users to:

- View total interviews
- View completed interviews
- View in-progress interviews
- View interview history
- View interview scores
- Continue interviews
- Delete interviews

### 👤 Profile
Users can view:

- Name
- Email
- Account information

### 📋 Interview Report
After completing an interview, users can review their interview performance and AI-generated evaluation.

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- JavaScript
- HTML
- CSS

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- MongoDB
- Mongoose

## Authentication & Security

- JSON Web Token (JWT)
- bcrypt.js

## Artificial Intelligence

- Google Gemini API
- `@google/genai`

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 🏗️ Project Architecture

```text
InterviewVerse-AI
│
├── client/
│   │
│   ├── src/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── InterviewSession.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── ...
│   │
│   └── package.json
│
├── server/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── interviewController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Interview.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── interviewRoutes.js
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── server.js
│   └── package.json
│
├── postman/
│
├── .gitignore
├── README.md
└── ...
```
🔄 Application Workflow

                    USER
                     │
                     ▼
              Register / Login
                     │
                     ▼
              JWT Authentication
                     │
                     ▼
                 Dashboard
                     │
                     ▼
              Create Interview
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Job Role  Experience  Difficulty
          │          │          │
          └──────────┼──────────┘
                     ▼
             Interview Session
                     │
                     ▼
               10 Questions
                     │
                     ▼
              Candidate Answer
                     │
                     ▼
                Gemini AI
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Score       Feedback     Improvements
        │            │            │
        └────────────┼────────────┘
                     ▼
             Complete Interview
                     │
                     ▼
              Final Report
                     │
                     ▼
                 MongoDB
                     │
                     ▼
             Interview History
🔐 Authentication Flow
```
User Registration
       │
       ▼
Password Received
       │
       ▼
bcrypt Password Hashing
       │
       ▼
MongoDB User Document
       │
       ▼
User Login
       │
       ▼
Password Verification
       │
       ▼
JWT Token Generated
       │
       ▼
Token Stored by Client
       │
       ▼
Protected API Requests
       │
       ▼
JWT Verification
       │
       ▼
Authenticated User
```
🤖 AI Evaluation Flow

When a candidate submits an answer, the backend sends the following information to Gemini:

Job Role
Experience Level
Difficulty
Interview Question
Candidate Answer

Gemini evaluates the answer based on:

Technical correctness
Relevance
Clarity
Completeness

Example AI Response:
```
{
  "score": 8,
  "feedback": "Good explanation with correct technical concepts.",
  "strengths": [
    "Good understanding of the topic",
    "Clear explanation"
  ],
  "improvements": [
    "Provide a practical example",
    "Explain the concept in more depth"
  ]
}
```
🗄️ Database Design
```
User
User
│
├── name
├── email
├── password
└── timestamps
Interview
Interview
│
├── user
├── role
├── experience
├── difficulty
├── questions
├── answers
├── status
├── completedAt
└── timestamps
```
🔌 API Endpoints
Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```
Interviews
```
POST   /api/interviews
GET    /api/interviews
GET    /api/interviews/:id
POST   /api/interviews/:id/answer
PUT    /api/interviews/:id/complete
DELETE /api/interviews/:id
```
Protected endpoints use:

Authorization: Bearer <JWT_TOKEN>
⚙️ Installation
1. Clone the repository
git clone https://github.com/smrutisync/InterviewVerse-AI.git
cd InterviewVerse-AI
2. Install frontend dependencies
cd client
npm install
3. Install backend dependencies

Open another terminal:

cd server
npm install
🔑 Environment Variables

Create the following file locally:

server/.env

Add:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
⚠️ Security

Never upload .env files or API keys to GitHub.

Do not expose:

MongoDB credentials
Gemini API keys
JWT secrets
Database passwords

The project uses .gitignore to prevent environment files from being committed.

▶️ Running the Project
Start Backend

From the server directory:

npm start

Backend runs on:

http://localhost:5000
Start Frontend

From the client directory:

npm run dev

Frontend runs on:

http://localhost:5173
🧪 Testing

The project can be tested using:
```
Browser
Postman
MongoDB
VS Code terminal
Main test flow
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create Interview
   ↓
Answer Questions
   ↓
Gemini Evaluation
   ↓
View Scores
   ↓
Complete Interview
   ↓
View Report
   ↓
Interview History
```
📱 Application Modules
Module	Description
🏠 Home	Main application navigation
🔐 Login	User authentication
📝 Register	New user registration
🎯 Interview	Interview configuration
🎤 Interview Session	Question and answer interface
🤖 AI Evaluation	Gemini-powered answer evaluation
📊 Dashboard	Interview statistics and history
👤 Profile	User information
📋 Report	Interview performance and feedback
🎯 Target Users

InterviewVerse AI is primarily designed for:

Freshers
College students
Job seekers
Software engineering candidates
Candidates preparing for technical interviews
💡 Why InterviewVerse AI?

Traditional interview preparation often provides static questions without personalized feedback.

InterviewVerse AI provides an interactive experience where candidates can:
```
Practice
   ↓
Answer
   ↓
Get AI Evaluation
   ↓
Understand Weaknesses
   ↓
Improve
   ↓
Practice Again

This creates a personalized interview preparation cycle.
```
🔒 Security

The application implements:

bcrypt password hashing
JWT authentication
Protected backend routes
User-specific interview access
Environment variables for sensitive credentials
.gitignore protection for secrets
Backend validation
AI response validation
📚 Learning Outcomes

This project demonstrates practical knowledge of:

-Full-stack web development
-React.js
-Node.js
-Express.js
-REST API development
-MongoDB
-Mongoose
-JWT authentication
-Password hashing
-CRUD operations
-Frontend-backend communication
-Generative AI integration
-Google Gemini API
-AI response validation
-Git
-GitHub
-Postman
-Application architecture
🚀 Future Improvements

The current version focuses on the complete core interview experience.

Possible future enhancements include:

-Resume-based interview questions
-RAG-based interview generation
-Role-specific advanced question generation
-Conversation memory
-Advanced performance analytics
-Admin dashboard
-Voice-based interviews
-Speech analysis
-Docker support
-CI/CD pipeline
-Cloud deployment
📈 Future Vision
```

InterviewVerse AI can evolve into a complete AI-powered career preparation platform with:

Resume Analysis
      ↓
Skill Gap Detection
      ↓
Personalized Interview
      ↓
AI Evaluation
      ↓
Performance Analytics
      ↓
Personalized Learning
```
👨‍💻 Author
Smruti Ranjan Nayak

B.Tech – Computer Science & Engineering


⭐ Project Highlights

InterviewVerse AI combines full-stack web development, secure authentication, MongoDB data management, and Generative AI to create an interactive interview preparation platform.

-Core Technologies
-React.js
-Node.js
-Express.js
-MongoDB
-Mongoose
-JWT
-bcrypt
-Google Gemini AI
-Axios
-Git
-GitHub
-Postman
