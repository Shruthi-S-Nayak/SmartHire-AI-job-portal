const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ["user", "recruiter"], default: "user" },
  skills:   { type: [String], default: [] },
  resume:   { type: String, default: "" },
  company:  { type: String, default: "" },
  bio:      { type: String, default: "" },
  location: { type: String, default: "" },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
}, { timestamps: true });
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPassword = async function (p) {
  return await bcrypt.compare(p, this.password);
};
module.exports = mongoose.model("User", userSchema);
