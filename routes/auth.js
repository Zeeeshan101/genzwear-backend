const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router(); // ✅ this is the correct declaration
const User = require('../models/User');

// ✅ Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({ 
  name, 
  email, 
  password: hashedPassword,
  isAdmin:  false   
});

    await newUser.save();

    res.status(201).json({ message: 'User registered!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
