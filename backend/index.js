// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require('cors');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Add this near your other imports
const authRoutes = require('./routes/auth');

// Add this after your app.use(express.json())
app.use('/api/auth', authRoutes);