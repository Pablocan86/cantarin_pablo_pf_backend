const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageController.js");
const userDTO = require("../dao/DTOs/user.dto.js");
// const messageModel = require("../dao/models/message.model.js");
// const MessageManager = require("../dao/classes/message.dao.js");
const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isUser,
} = require("../middleware/auth.js");

// const messageM = new MessageManager();

router.get("/messages", isUser, messageControllers.getMessages);

router.post("/messages", isUser, messageControllers.createMessage);

// router.put("/", (req, res) => {
//   res.send("Estoy llegando desde Put de messages.router");
// });

router.delete("/messages/:uid", messageControllers.deleteMessage);

module.exports = router;
