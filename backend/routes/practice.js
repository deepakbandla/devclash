// backend/routes/practice.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/authMiddleware');
const Performance = require('../models/Performance');
const Question = require('../models/Question');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// ✅ Helper: safely extract a JSON array from raw AI text
function extractJSON(text) {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('AI did not return a valid JSON array');
    return JSON.parse(match[0]);
}

// ---------------------------------------------------------
// 1. GENERATE A GENERAL TEST
// ---------------------------------------------------------
router.post('/generate-test', auth, async (req, res) => {
    try {
        const { topic, difficulty, numQuestions } = req.body;

        // ✅ Input validation
        if (!topic || !difficulty || !numQuestions) {
            return res.status(400).json({ msg: 'topic, difficulty, and numQuestions are required' });
        }
        if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            return res.status(400).json({ msg: 'difficulty must be Easy, Medium, or Hard' });
        }
        const count = parseInt(numQuestions);
        if (isNaN(count) || count < 1 || count > 20) {
            return res.status(400).json({ msg: 'numQuestions must be between 1 and 20' });
        }

        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        const prompt = `Generate ${count} multiple-choice questions on the topic "${topic}" at a ${difficulty} difficulty level.
        Respond ONLY with a valid JSON array. No explanation, no markdown, no extra text.
        Each object must have these exact fields:
        - questionText (string)
        - options (array of exactly 4 strings)
        - correctAnswer (string, must exactly match one of the options)
        - explanation (string)`;

        const result = await model.generateContent(prompt);
        const raw = result.response.text();

        // ✅ Safe parse
        const questionsData = extractJSON(raw);

        // ✅ Save to DB with subject/topic/difficulty attached
        const savedQuestions = await Question.insertMany(
            questionsData.map(q => ({
                ...q,
                subject: 'B.Tech CSE',
                topic,
                difficulty
            }))
        );

        res.json(savedQuestions);
    } catch (error) {
        console.error('GENERATE TEST ERROR:', error);
        res.status(500).json({ error: 'AI Generation failed', details: error.message });
    }
});

// ---------------------------------------------------------
// 2. SUBMIT ANSWERS
// ---------------------------------------------------------
router.post('/submit-test', auth, async (req, res) => {
    try {
        const { results } = req.body;
        const userId = req.user.id;

        // ✅ Input validation
        if (!results || !Array.isArray(results) || results.length === 0) {
            return res.status(400).json({ msg: 'results array is required and cannot be empty' });
        }

        const performanceRecords = [];

        for (const r of results) {
            if (!r.questionId || r.userAnswer === undefined || r.timeTaken === undefined) {
                return res.status(400).json({ msg: 'Each result must have questionId, userAnswer, and timeTaken' });
            }

            // ✅ Verify correctness SERVER-SIDE — never trust the client
            const question = await Question.findById(r.questionId);
            if (!question) {
                return res.status(404).json({ msg: `Question ${r.questionId} not found` });
            }

            const isCorrect = r.userAnswer.trim() === question.correctAnswer.trim();

            // ✅ Clamp timeTaken between 0 and 3600 seconds
            const timeTaken = Math.max(0, Math.min(Number(r.timeTaken) || 0, 3600));

            performanceRecords.push({
                user: userId,
                question: r.questionId,
                isCorrect,
                timeTaken
            });
        }

        await Performance.insertMany(performanceRecords);

        // ✅ Return a score summary
        const correct = performanceRecords.filter(r => r.isCorrect).length;
        res.json({
            msg: 'Performance tracked successfully!',
            score: `${correct} / ${performanceRecords.length}`,
            percentage: Math.round((correct / performanceRecords.length) * 100)
        });
    } catch (err) {
        console.error('SUBMIT TEST ERROR:', err);
        res.status(500).json({ error: 'Failed to save performance.', details: err.message });
    }
});

// ---------------------------------------------------------
// 3. TARGETED PRACTICE (Remedial Logic)
// ---------------------------------------------------------
router.post('/generate-targeted', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find recent mistakes
        const mistakes = await Performance.find({ user: userId, isCorrect: false })
            .populate('question')
            .sort({ attemptedAt: -1 })
            .limit(5);

        if (mistakes.length === 0) {
            return res.json({ msg: 'No weak areas found! Try a general test first.' });
        }

        // ✅ Filter out any null populated questions (deleted questions)
        const validMistakes = mistakes.filter(m => m.question !== null);
        if (validMistakes.length === 0) {
            return res.json({ msg: 'No valid weak areas found.' });
        }

        const weakTopics = [...new Set(validMistakes.map(m => m.question.topic))].join(', ');

        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        const prompt = `The student is struggling with these topics: ${weakTopics}.
        Generate 3 targeted multiple-choice questions to help them improve.
        Respond ONLY with a valid JSON array. No explanation, no markdown, no extra text.
        Each object must have: questionText, options (array of 4 strings), correctAnswer, explanation.`;

        const result = await model.generateContent(prompt);
        const raw = result.response.text();

        // ✅ Save targeted questions too
        const questionsData = extractJSON(raw);
        const savedQuestions = await Question.insertMany(
            questionsData.map(q => ({
                ...q,
                subject: 'B.Tech CSE',
                topic: weakTopics,
                difficulty: 'Medium'
            }))
        );

        res.json({ weakTopics, questions: savedQuestions });
    } catch (err) {
        console.error('TARGETED GENERATION ERROR:', err);
        res.status(500).json({ error: 'Targeted generation failed.', details: err.message });
    }
});

module.exports = router;