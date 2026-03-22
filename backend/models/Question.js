// backend/models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    subject:      { type: String, required: true },
    topic:        { type: String, required: true },
    difficulty:   { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    questionText: { type: String, required: true },
    options:      [String],
    correctAnswer:{ type: String, required: true },
    explanation:  { type: String }
});

module.exports = mongoose.model('Question', QuestionSchema);