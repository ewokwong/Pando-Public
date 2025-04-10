// Code to handle login / signup routes
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cleanUserObject = require('../common/cleanUserObject');
const { sendEmail } = require('../services/emailService');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const router = express.Router();

// Route to handle signup
router.post('/signup', async (req, res) => {
    const { email, name, dob, password, confirmPassword } = req.body;

    // Email validation: <USER>@<X>.<Y>
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: 'A valid email is required' });
    }

    // Rest of form verification
    if (!name) {
        return res.status(400).json({ message: 'A name is required' });
    }

    // Validate DOB (ensure user entered one)
    if (!dob) {
        return res.status(400).json({ message: 'A valid DOB is required' });
    }

    // Check if the user is at least 18 years old
    const birthDate = new Date(dob);
    let age = new Date().getFullYear() - birthDate.getFullYear();
    const month = new Date().getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
        age--; // Adjust age if the birthday hasn't occurred yet this year
    }

    if (age < 18) {
        return res.status(400).json({ message: 'Pando users must be at least 18 years old' });
    }

    if (!password) {
        return res.status(400).json({ message: 'A password is required' });
    }

    if (!confirmPassword || password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already in system
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already used' });
    }

    try {

        // Hash password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create new user
        const newUser = new User({
            email,
            name,
            dob,
            password: hashedPassword
        });

        // Save user in DB
        await newUser.save();
        
        // Generate JWT Token with unique user_ID
        const token = jwt.sign(
            // Assign them unique user_ID
            { userId: newUser._id }, 
            SECRET_KEY, 
            { expiresIn: '1d' }
        );
        
        const userObj = cleanUserObject(newUser);
        res.status(201).json({ message: 'User created successfully', token, userObj });
    } catch (err) {
        console.error("Error saving user:", err);
    
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Route to handle login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt with email, password:', email, password, typeof password);
    // Check both fields are populated
    if (!email) {
        return res.status(400).json({ message: 'A valid email is required' });
    }

    if (!password) {
        return res.status(400).json({ message: 'A password is required' });
    }

    try {

        // Find user in DB
        const user = await User.findOne({ email });
        if (!user || user == null) return res.status(400).json({ message: 'User not found, please make sure email is correct' });

        // Password comparison
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Invalid credentials: Passwords do not match');
            return res.status(400).json({ message: 'Invalid credentials, please check your password and try again.' }); // Password doesn't match
        }

        const token = jwt.sign(
            { userId: user._id }, 
            SECRET_KEY, 
            { expiresIn: '1d' }
        );
        
        // Send the token in response
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Route to add a new Firebase user to the database
router.post('/add-firebase-user', async (req, res) => {
  const { firebaseUID, email, displayName, profilePhoto, idToken } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ firebaseUID });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      firebaseUID,
      email,
      name: displayName,
      profilePhoto,
    });

    await newUser.save();

    // Generate a custom JWT token
    const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: '1d' });

    res.status(201).json({ message: 'User created successfully', user: newUser, token });
  } catch (error) {
    console.error('Error creating Firebase user:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

module.exports = router;