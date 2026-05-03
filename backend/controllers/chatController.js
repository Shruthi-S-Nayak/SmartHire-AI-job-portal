const Message = require("../models/Message");
const Application = require("../models/Application");

const getMessages = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Not found" });
    const isApplicant = application.applicant.toString() === req.user._id.toString();
    const isRecruiter = application.job.postedBy.toString() === req.user._id.toString();
    if (!isApplicant && !isRecruiter) return res.status(403).json({ success: false, message: "Not authorized" });
    const messages = await Message.find({ application: req.params.applicationId }).populate("sender", "name role").sort({ createdAt: 1 });
    await Message.updateMany({ application: req.params.applicationId, receiver: req.user._id }, { isRead: true });
    res.json({ success: true, messages });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, message: "Message cannot be empty" });
    const application = await Application.findById(req.params.applicationId).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Not found" });
    const isApplicant = application.applicant.toString() === req.user._id.toString();
    const isRecruiter = application.job.postedBy.toString() === req.user._id.toString();
    if (!isApplicant && !isRecruiter) return res.status(403).json({ success: false, message: "Not authorized" });
    const receiverId = isApplicant ? application.job.postedBy : application.applicant;
    const message = await Message.create({ application: req.params.applicationId, sender: req.user._id, receiver: receiverId, content });
    const populated = await message.populate("sender", "name role");
    res.status(201).json({ success: true, message: populated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getMessages, sendMessage };
