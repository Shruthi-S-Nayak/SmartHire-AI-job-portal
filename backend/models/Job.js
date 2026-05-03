const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title:          { type: String, required: true, trim: true },
  description:    { type: String, required: true },
  company:        { type: String, required: true },
  location:       { type: String, required: true },
  salary:         { type: String, default: "Not disclosed" },
  jobType:        { type: String, enum: ["Full-time","Part-time","Internship","Remote","Contract"], default: "Full-time" },
  skillsRequired: { type: [String], default: [] },
  openings:       { type: Number, default: 1 },
  deadline:       { type: Date },
  isActive:       { type: Boolean, default: true },
  postedBy:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
module.exports = mongoose.model("Job", jobSchema);
