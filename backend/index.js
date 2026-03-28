// backend/index.js
const dotenv = require('dotenv');
dotenv.config(); // ✅ MUST be first before any other imports that use env vars

const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const practiceRoutes = require('./routes/practice');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

// Start server with DB connection
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();