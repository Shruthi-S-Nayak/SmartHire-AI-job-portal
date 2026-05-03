const express = require("express");
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus } = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
// NOTE: specific routes (/my, /job/:jobId) MUST come before parameterized routes (/:jobId)
router.get("/my", protect, authorizeRoles("user"), getMyApplications);
router.get("/job/:jobId", protect, authorizeRoles("recruiter"), getJobApplications);
router.put("/:id/status", protect, authorizeRoles("recruiter"), updateApplicationStatus);
router.post("/:jobId", protect, authorizeRoles("user"), applyForJob);
module.exports = router;
