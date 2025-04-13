const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user

exports.registerUser = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body; // Default role to 'user'
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? 'Email already exists'
          : 'Username already exists'
      });
    }

    const user = await User.create({ username, email, password, role }); // Include role

    const payload = {
      id: user._id,
      role: user.role, // Ensure 'role' is included in the token payload
    };
   
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: { username, email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ user: { username: user.username, email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
