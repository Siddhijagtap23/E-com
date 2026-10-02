import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid user data' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
