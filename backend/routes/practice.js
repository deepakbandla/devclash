const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/authMiddleware');
const Performance = require('../models/Performance'); // Move this to the top

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. GENERAL TEST GENERATION
router.post('/generate-test', auth, async (req, res) => {
    try {
        const { topic, difficulty, numQuestions } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Generate ${numQuestions} multiple-choice questions on ${topic} at a ${difficulty} difficulty level. 
        Format the response as a valid JSON array with fields: question, options (array), correctAnswer, and explanation.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanJson = text.replace(/```json|```/g, "");
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        res.status(500).json({ error: "Failed to generate questions" });
    }
});

// backend/routes/practice.js

router.post('/submit-test', auth, async (req, res) => {
    try {
        const { results } = req.body; // Expecting an array of { questionId, selectedOption, isCorrect, timeTaken }
        const userId = req.user.id;

        // 1. Save all performance records in bulk
        const performanceRecords = results.map(result => ({
            user: userId,
            question: result.questionId,
            isCorrect: result.isCorrect,
            timeTaken: result.timeTaken
        }));

        await Performance.insertMany(performanceRecords);

        // 2. Analyze for "Weak Areas" immediately
        const weakAttempts = results.filter(r => !r.isCorrect);
        const slowAttempts = results.filter(r => r.isCorrect && r.timeTaken > 60); // Over 60s is "slow"

        res.json({
            msg: "Test submitted successfully",
            score: `${results.filter(r => r.isCorrect).length} / ${results.length}`,
            analysis: {
                weakCount: weakAttempts.length,
                slowButCorrect: slowAttempts.length,
                suggestion: weakAttempts.length > 0 
                    ? "We've identified some gaps. Try a 'Targeted' session next." 
                    : "Great job! Speed up your response time to master these topics."
            }
        });

    } catch (err) {
        res.status(500).json({ error: "Failed to submit test results" });
    }
});

// 2. TARGETED GENERATION ROUTE (Adaptive Logic)
router.post('/generate-targeted', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user's mistakes
        const history = await Performance.find({ user: userId, isCorrect: false })
            .populate('question')
            .sort({ attemptedAt: -1 })
            .limit(3);

        if (history.length === 0) {
            return res.json({ msg: "No weak areas found yet. Keep practicing!" });
        }

        const weakTopics = history.map(h => h.question.topic).join(", ");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `The student is struggling with these topics: ${weakTopics}. 
        Generate 3 targeted practice questions to help them bridge their gap. 
        Format as a JSON array with: question, options, correctAnswer, and explanation.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, "");

        res.json(JSON.parse(cleanJson));

    } catch (err) {
        res.status(500).json({ error: "Failed to generate targeted questions" });
    }
});

// ALWAYS keep this at the very bottom of the file
module.exports = router;