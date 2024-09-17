// routes/signup.js
const express = require('express');
const router = express.Router();
const Signup = require('../models/signupschema');

// Route to handle signup requests
router.post('/signup', async (req, res) => {
  try {
    // Extract signup data from the request body
    const { firstName, lastName, email, password } = req.body;

    // Create a new Signup document
    const newSignup = new Signup({ firstName, lastName, email, password });

    // Save the new signup to the database
    await newSignup.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
