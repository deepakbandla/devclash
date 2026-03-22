// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const bcrypt = require('bcryptjs');

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Simple validation
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json({ msg: "User registered!", userId: savedUser._id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;