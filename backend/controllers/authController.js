const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  const { name, email, password, role, company } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already registered" });
    const user = await User.create({ name, email, password, role, company });
    res.status(201).json({ success: true, token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, skills: user.skills, bio: user.bio, location: user.location, resume: user.resume, savedJobs: user.savedJobs }});
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    res.json({ success: true, token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, skills: user.skills, resume: user.resume, savedJobs: user.savedJobs }});
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("savedJobs", "title company location");
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { register, login, getMe };
