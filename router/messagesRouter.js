const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/messageController");

router.post("/", MessageController.createMessage);
router.get("/", MessageController.getAllMessages);
router.get("/:id", MessageController.getMessageById);
router.delete("/:id", MessageController.deleteMessage);

module.exports = router;
