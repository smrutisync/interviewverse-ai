const { GoogleGenAI } = require("@google/genai");

// ============================================================
// GEMINI CLIENT
// ============================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
    apiKey: apiKey,
});

// ============================================================
// QUESTION BANK
// ============================================================

const questionBank = {
    "Java Developer": [
        {
            question:
                "Tell me about yourself and why you are interested in a Java Developer role.",
            topic: "Introduction",
        },

        {
            question:
                "What is Java and what are its main features?",
            topic: "Core Java",
        },

        {
            question:
                "What is the difference between JDK, JRE, and JVM?",
            topic: "Core Java",
        },

        {
            question:
                "Explain the four pillars of Object-Oriented Programming.",
            topic: "OOP",
        },

        {
            question:
                "What is the difference between == and equals() in Java?",
            topic: "Core Java",
        },

        {
            question:
                "What is the difference between method overloading and method overriding?",
            topic: "OOP",
        },

        {
            question:
                "What is inheritance in Java? Give an example.",
            topic: "OOP",
        },

        {
            question:
                "What is the difference between ArrayList and LinkedList, and when would you use each?",
            topic: "Collections",
        },

        {
            question:
                "What is the difference between checked and unchecked exceptions in Java? Provide an example of each.",
            topic: "Exception Handling",
        },

        {
            question:
                "Why are String objects immutable in Java, and how does StringBuilder help in String manipulation?",
            topic: "Strings",
        },

        {
            question:
                "What is the purpose of the final, finally, and finalize keywords in Java?",
            topic: "Core Java",
        },

        {
            question:
                "Describe an academic or personal project you built using Java. What were its main features and architecture?",
            topic: "Projects",
        },

        {
            question:
                "How do you connect a Java application to a database, and how do you handle SQL exceptions?",
            topic: "JDBC",
        },

        {
            question:
                "Can you describe a time when you faced a difficult technical bug and how you solved it?",
            topic: "Problem Solving",
        },
    ],
};

// ============================================================
// FALLBACK QUESTIONS FOR OTHER ROLES
// ============================================================

const getFallbackQuestions = (role) => {
    return [
        {
            question:
                `Tell me about yourself and why you are interested in a ${role} role.`,
            topic: "Introduction",
        },

        {
            question:
                `What do you understand about the responsibilities of a ${role}?`,
            topic: "Technical",
        },

        {
            question:
                "Tell me about a technical project you have worked on.",
            topic: "Projects",
        },

        {
            question:
                "What programming languages and technologies are you comfortable with?",
            topic: "Technical",
        },

        {
            question:
                "How do you approach solving a programming problem?",
            topic: "Problem Solving",
        },

        {
            question:
                "How do you debug an error in your code?",
            topic: "Problem Solving",
        },

        {
            question:
                "What is the most challenging technical concept you have learned?",
            topic: "Technical",
        },

        {
            question:
                "How do you keep yourself updated with new technologies?",
            topic: "Learning",
        },

        {
            question:
                "Describe a difficult problem you solved in a project.",
            topic: "Problem Solving",
        },

        {
            question:
                "Why should we consider you for this role?",
            topic: "HR",
        },
    ];
};

// ============================================================
// GENERATE INTERVIEW QUESTIONS
// ============================================================

const generateQuestions = (
    role,
    experience,
    difficulty
) => {
    try {
        console.log("========================================");
        console.log("GENERATING INTERVIEW QUESTIONS");
        console.log("Role:", role);
        console.log("Experience:", experience);
        console.log("Difficulty:", difficulty);
        console.log("========================================");

        // --------------------------------------------------------
        // Get questions
        // --------------------------------------------------------

        let questions = questionBank[role];

        if (!questions) {
            questions = getFallbackQuestions(role);
        }

        // --------------------------------------------------------
        // Shuffle questions
        // --------------------------------------------------------

        const shuffledQuestions = [...questions].sort(
            () => Math.random() - 0.5
        );

        // --------------------------------------------------------
        // ALWAYS RETURN 10 QUESTIONS
        // --------------------------------------------------------

        let selectedQuestions =
            shuffledQuestions.slice(0, 10);

        // --------------------------------------------------------
        // If bank has fewer than 10 questions,
        // repeat questions until we have exactly 10.
        // --------------------------------------------------------

        if (selectedQuestions.length < 10) {
            const originalLength =
                selectedQuestions.length;

            for (
                let i = originalLength;
                i < 10;
                i++
            ) {
                selectedQuestions.push(
                    shuffledQuestions[
                        i % shuffledQuestions.length
                    ]
                );
            }
        }

        // --------------------------------------------------------
        // Format questions
        // --------------------------------------------------------

        const formattedQuestions =
            selectedQuestions.map(
                (item, index) => {
                    return {
                        id: index + 1,

                        question:
                            item.question,

                        topic:
                            item.topic,

                        difficulty:
                            difficulty || "Medium",
                    };
                }
            );

        console.log(
            "Generated questions:",
            formattedQuestions.length
        );

        return formattedQuestions;

    } catch (error) {
        console.error(
            "GENERATE QUESTIONS ERROR:",
            error
        );

        throw new Error(
            "Failed to generate interview questions"
        );
    }
};

// ============================================================
// CLEAN GEMINI JSON RESPONSE
// ============================================================

const cleanJsonResponse = (text) => {
    if (!text) {
        throw new Error(
            "Gemini returned an empty response"
        );
    }

    let cleaned = String(text).trim();

    // --------------------------------------------------------
    // Remove markdown code fences
    // --------------------------------------------------------

    if (cleaned.startsWith("```json")) {
        cleaned = cleaned
            .replace(/^```json\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
    }

    // --------------------------------------------------------
    // Find JSON object if extra text exists
    // --------------------------------------------------------

    const firstBrace =
        cleaned.indexOf("{");

    const lastBrace =
        cleaned.lastIndexOf("}");

    if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace > firstBrace
    ) {
        cleaned =
            cleaned.substring(
                firstBrace,
                lastBrace + 1
            );
    }

    return cleaned;
};

// ============================================================
// VALIDATE EVALUATION RESULT
// ============================================================

const validateEvaluation = (result) => {
    if (!result || typeof result !== "object") {
        throw new Error(
            "Invalid evaluation object"
        );
    }

    // --------------------------------------------------------
    // Score
    // --------------------------------------------------------

    let score = Number(result.score);

    if (Number.isNaN(score)) {
        score = 0;
    }

    // Keep score between 0 and 10

    score =
        Math.max(
            0,
            Math.min(
                10,
                score
            )
        );

    // Round score

    score =
        Math.round(
            score * 10
        ) / 10;

    // --------------------------------------------------------
    // Feedback
    // --------------------------------------------------------

    const feedback =
        typeof result.feedback === "string"
            ? result.feedback.trim()
            : "Good attempt. Continue improving your technical explanation.";

    // --------------------------------------------------------
    // Strengths
    // --------------------------------------------------------

    let strengths =
        Array.isArray(result.strengths)
            ? result.strengths
            : [];

    strengths =
        strengths
            .filter(
                item =>
                    typeof item === "string" &&
                    item.trim() !== ""
            )
            .map(
                item => item.trim()
            )
            .slice(0, 5);

    // --------------------------------------------------------
    // Improvements
    // --------------------------------------------------------

    let improvements =
        Array.isArray(result.improvements)
            ? result.improvements
            : [];

    improvements =
        improvements
            .filter(
                item =>
                    typeof item === "string" &&
                    item.trim() !== ""
            )
            .map(
                item => item.trim()
            )
            .slice(0, 5);

    // --------------------------------------------------------
    // Default values
    // --------------------------------------------------------

    if (strengths.length === 0) {
        strengths = [
            "The candidate attempted the question.",
        ];
    }

    if (improvements.length === 0) {
        improvements = [
            "Provide a more detailed and technically accurate explanation.",
        ];
    }

    return {
        score,
        feedback,
        strengths,
        improvements,
    };
};

// ============================================================
// GEMINI ANSWER EVALUATION
// ============================================================

const evaluateAnswer = async (
    question,
    answer,
    role,
    difficulty
) => {

    // --------------------------------------------------------
    // Validate API key
    // --------------------------------------------------------

    if (!process.env.GEMINI_API_KEY) {
        console.error(
            "GEMINI_API_KEY is missing"
        );

        throw new Error(
            "GEMINI_API_KEY is missing in server/.env"
        );
    }

    // --------------------------------------------------------
    // Validate input
    // --------------------------------------------------------

    if (!question) {
        throw new Error(
            "Question is required for evaluation"
        );
    }

    if (
        !answer ||
        !String(answer).trim()
    ) {
        return {
            score: 0,

            feedback:
                "No answer was provided.",

            strengths: [],

            improvements: [
                "Provide an answer to the interview question.",
            ],
        };
    }

    // --------------------------------------------------------
    // Prompt
    // --------------------------------------------------------

    const prompt = `
You are an expert technical interviewer conducting a ${difficulty || "Medium"} difficulty interview.

Candidate Role:
${role || "Software Developer"}

Candidate Experience:
Fresher / Entry Level

Interview Question:
${question}

Candidate Answer:
${String(answer).trim()}

Evaluate the candidate fairly for a fresher.

Evaluate these four areas:

1. Technical correctness
2. Relevance
3. Clarity
4. Completeness

Scoring guide:

9-10 = Excellent
7-8 = Very Good
5-6 = Average
3-4 = Weak
0-2 = Very Poor or incorrect

Return ONLY a valid JSON object.

Do NOT use markdown.
Do NOT use code fences.
Do NOT add text before or after the JSON.

Use exactly this structure:

{
  "score": 0,
  "feedback": "Short overall feedback",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "improvements": [
    "improvement 1",
    "improvement 2"
  ]
}
`;

    // --------------------------------------------------------
    // Try Gemini more than once
    // --------------------------------------------------------

    const maxAttempts = 2;

    let lastError = null;

    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
    ) {
        try {
            console.log(
                `Gemini evaluation attempt ${attempt}/${maxAttempts}`
            );

            const response =
                await ai.models.generateContent({
                    model:
                        "gemini-3.6-flash",

                    contents:
                        prompt,

                    config: {
                        responseMimeType:
                            "application/json",

                        
                    },
                });

            // ------------------------------------------------
            // Get Gemini response text
            // ------------------------------------------------

            const responseText =
                response?.text;

            console.log(
                "Gemini evaluation response received."
            );

            if (!responseText) {
                throw new Error(
                    "Gemini returned an empty evaluation response"
                );
            }

            // ------------------------------------------------
            // Clean JSON
            // ------------------------------------------------

            const cleanedJson =
                cleanJsonResponse(
                    responseText
                );

            console.log(
                "Cleaned evaluation JSON:",
                cleanedJson
            );

            // ------------------------------------------------
            // Parse JSON
            // ------------------------------------------------

            let parsedResult;

            try {
                parsedResult =
                    JSON.parse(
                        cleanedJson
                    );

            } catch (parseError) {
                console.error(
                    "JSON PARSE ERROR:",
                    parseError
                );

                console.error(
                    "RAW GEMINI RESPONSE:",
                    responseText
                );

                throw new Error(
                    "Gemini returned invalid JSON"
                );
            }

            // ------------------------------------------------
            // Validate and normalize
            // ------------------------------------------------

            const evaluation =
                validateEvaluation(
                    parsedResult
                );

            console.log(
                "Evaluation successful:",
                evaluation.score
            );

            return evaluation;

        } catch (error) {

            lastError = error;

            console.error(
                `GEMINI EVALUATION ERROR - ATTEMPT ${attempt}:`,
                error.message
            );

            // ------------------------------------------------
            // Do NOT retry quota/rate-limit errors
            // ------------------------------------------------

            const errorMessage =
                String(
                    error.message || ""
                ).toLowerCase();

            if (
                errorMessage.includes("quota") ||
                errorMessage.includes("rate limit") ||
                errorMessage.includes("resource exhausted") ||
                errorMessage.includes("429")
            ) {
                console.error(
                    "Gemini quota exceeded. Stopping retry."
                );

                throw new Error(
                    "Gemini API quota exceeded. Please wait and try again."
                );
            }

            // ------------------------------------------------
            // Retry temporary errors
            // ------------------------------------------------

            if (attempt < maxAttempts) {
                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            1500
                        )
                );
            }
        }
    }

    // ========================================================
    // ALL GEMINI ATTEMPTS FAILED
    // ========================================================

    console.error(
        "ALL GEMINI EVALUATION ATTEMPTS FAILED:",
        lastError
    );

    throw new Error(
        "AI evaluation failed"
    );
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    generateQuestions,
    evaluateAnswer,
};