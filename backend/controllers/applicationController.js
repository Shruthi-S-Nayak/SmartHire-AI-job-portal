const Application = require("../models/Application");
const Job = require("../models/Job");
const matchSkills = require("../utils/matchSkills");

const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || !job.isActive) return res.status(404).json({ success: false, message: "Job not found or closed" });
    if (await Application.findOne({ job: req.params.jobId, applicant: req.user._id }))
      return res.status(400).json({ success: false, message: "Already applied" });
    const { matchPercent } = matchSkills(req.user.skills || [], job.skillsRequired);
    const application = await Application.create({ job: req.params.jobId, applicant: req.user._id, coverLetter: req.body.coverLetter || "", matchScore: matchPercent });
    res.status(201).json({ success: true, message: "Application submitted!", application });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location salary jobType skillsRequired").sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });
    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email skills resume location bio").sort({ matchScore: -1 });
    res.json({ success: true, applications });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "reviewed", "shortlisted", "rejected", "hired"];
    if (!valid.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    if (application.job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });
    application.status = status;
    await application.save();
    res.json({ success: true, message: "Status updated", application });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };
