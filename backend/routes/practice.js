const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/authMiddleware');

// Import your new models
const Performance = require('../models/Performance');
const Question = require('../models/Question');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------------------------------------------------
// 1. GENERATE A GENERAL TEST
// ---------------------------------------------------------
router.post('/generate-test', auth, async (req, res) => {
    try {
        const { topic, difficulty, numQuestions } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Generate ${numQuestions} multiple-choice questions on ${topic} at a ${difficulty} difficulty level. 
        Format the response as a valid JSON array with fields: questionText, options (array of 4 strings), correctAnswer, and explanation.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "");
        const questionsData = JSON.parse(text);

        // Optional: Save these questions to MongoDB so we have IDs to reference later
        const savedQuestions = await Question.insertMany(
            questionsData.map(q => ({ ...q, subject: "B.Tech CSE", topic, difficulty }))
        );

        res.json(savedQuestions);
    } catch (error) {
        console.error("DETAILED AI ERROR:", error); // This will print the real error in VS Code
    res.status(500).json({ 
        error: "AI Generation failed", 
        details: error.message 
    });
    }
});

// ---------------------------------------------------------
// 2. SUBMIT ANSWERS (The "Adaptive" Logic)
// ---------------------------------------------------------
router.post('/submit-test', auth, async (req, res) => {
    try {
        const { results } = req.body; // Expecting [{ questionId, isCorrect, timeTaken }]
        const userId = req.user.id;

        const performanceRecords = results.map(r => ({
            user: userId,
            question: r.questionId,
            isCorrect: r.isCorrect,
            timeTaken: r.timeTaken
        }));

        await Performance.insertMany(performanceRecords);

        res.json({ msg: "Performance tracked successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save performance." });
    }
});

// ---------------------------------------------------------
// 3. TARGETED PRACTICE (The "Remedial" Logic)
// ---------------------------------------------------------
router.post('/generate-targeted', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find recent mistakes
        const mistakes = await Performance.find({ user: userId, isCorrect: false })
            .populate('question')
            .sort({ attemptedAt: -1 })
            .limit(3);

        if (mistakes.length === 0) {
            return res.json({ msg: "No weak areas found! Try a general test first." });
        }

        const weakTopics = [...new Set(mistakes.map(m => m.question.topic))].join(", ");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `The student is struggling with: ${weakTopics}. 
        Generate 3 targeted questions to help them improve. Format as JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "");
        
        res.json(JSON.parse(text));
    } catch (err) {
        res.status(500).json({ error: "Targeted generation failed." });
    }
});

module.exports = router;