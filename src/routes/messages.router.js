const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageController.js");
const userDTO = require("../dao/DTOs/user.dto.js");

const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isUser,
} = require("../middleware/auth.js");

//Muestra todos los mensajes de un usuario
router.get("/messages", isUser, messageControllers.getMessages);

//Envia crea mensaje del usuario
router.post("/messages", isUser, messageControllers.createMessage);

//Borra un mensaje del usuario
router.delete("/messages/:uid", messageControllers.deleteMessage);

module.exports = router;
