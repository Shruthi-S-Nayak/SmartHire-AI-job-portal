const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
router.get("/:applicationId", protect, getMessages);
router.post("/:applicationId", protect, sendMessage);
module.exports = router;
