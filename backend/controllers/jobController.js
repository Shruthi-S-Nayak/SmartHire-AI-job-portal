const Job = require("../models/Job");
const Application = require("../models/Application");
const matchSkills = require("../utils/matchSkills");

const getJobs = async (req, res) => {
  try {
    const { search, location, jobType, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (search) filter.$or = [{ title: { $regex: search, $options: "i" } }, { company: { $regex: search, $options: "i" } }];
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter).populate("postedBy", "name company").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), jobs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name company email");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, message: "Job posted successfully", job });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Job updated", job: updated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });
    await job.deleteOne();
    await Application.deleteMany({ job: req.params.id });
    res.json({ success: true, message: "Job deleted" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getRecommendations = async (req, res) => {
  try {
    const userSkills = req.user.skills || [];
    if (!userSkills.length) return res.json({ success: true, jobs: [], message: "Add skills to get recommendations" });
    const jobs = await Job.find({ isActive: true }).populate("postedBy", "name company").limit(50);
    const scored = jobs.map(job => ({ ...job.toObject(), matchPercent: matchSkills(userSkills, job.skillsRequired).matchPercent }))
      .filter(j => j.matchPercent > 0).sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 10);
    res.json({ success: true, jobs: scored });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getSkillMatch = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    const result = matchSkills(req.user.skills || [], job.skillsRequired);
    res.json({ success: true, ...result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, getRecommendations, getSkillMatch };
