const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("savedJobs", "title company location salary");
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, skills, company } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, bio, location, skills, company }, { new: true }).select("-password");
    res.json({ success: true, message: "Profile updated", user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const user = await User.findByIdAndUpdate(req.user._id, { resume: `/uploads/${req.file.filename}` }, { new: true }).select("-password");
    res.json({ success: true, message: "Resume uploaded", resumeUrl: user.resume });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;
    const isSaved = user.savedJobs.map(id => id.toString()).includes(jobId);
    if (isSaved) user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    else user.savedJobs.push(jobId);
    await user.save();
    res.json({ success: true, message: isSaved ? "Job unsaved" : "Job saved", savedJobs: user.savedJobs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getProfile, updateProfile, uploadResume, toggleSaveJob };
