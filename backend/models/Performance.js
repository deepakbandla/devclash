// backend/models/Performance.js
const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true,
        min: 0,
        max: 3600  // ✅ clamped at schema level too
    },
    attemptedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Performance', PerformanceSchema);