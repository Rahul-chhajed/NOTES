const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../modules/User.js');
require('dotenv').config();


router.post('/register', async (req, res) => {
    try {
        const { name, email, DOB } = req.body;
        if (!name || !email|| !DOB) {
            return res.status(400).json({ message: 'All credential are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const user = new User({ name, email, DOB });
        await user.save();
 const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: 'Registration successful', token,user});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'Login successful', token,user});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;


