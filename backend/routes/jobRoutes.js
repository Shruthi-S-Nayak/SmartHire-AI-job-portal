const express = require("express");
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, getRecommendations, getSkillMatch } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
router.get("/", getJobs);
router.get("/recommendations", protect, getRecommendations);
router.get("/recruiter/myjobs", protect, authorizeRoles("recruiter"), getMyJobs);
// NOTE: specific routes (/recommendations, /recruiter/myjobs, /:id/match) MUST come before /:id
router.get("/:id/match", protect, getSkillMatch);
router.get("/:id", getJobById);
router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);
module.exports = router;
