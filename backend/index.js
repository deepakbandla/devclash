// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require('cors');

// 1. Import your Routes
const authRoutes = require('./routes/auth');
const practiceRoutes = require('./routes/practice'); // NEW

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 2. Use the Routes
app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes); // NEW

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});