// routes/auth.js
const express = require('express');
const authUtils = require('../utils/authUtils');
const User = require('../models/User');
const authRouter = express.Router();


// Signup
authRouter.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if(existingUser && existingUser.email === email) {
      return res.status(409).json({ error: 'User already exists' });
    }
    else{
      const hashedPassword = await authUtils.hashPassword(password);
      const user = new User({ username, email, password: hashedPassword });
      const token = authUtils.generateToken(user);
      await user.save();
      res.json({ message: 'Signup successful', userId: user._id, auth_token: token });
    }
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isValid = await authUtils.comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = authUtils.generateToken(user);
    res.json({ message: 'Login successful', userId: user._id, auth_token: token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

authRouter.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
})

module.exports = authRouter;
