const express = require("express");
const router = express.Router();
const userDTO = require("../dao/DTOs/user.dto.js");
const messageModel = require("../dao/models/message.model.js");
const MessageManager = require("../dao/classes/messageManager.js");
const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isUser,
} = require("../middleware/auth.js");

const messageM = new MessageManager();
router.get("/messages", async (req, res) => {
  try {
    let user = new userDTO(req.session.user);
    const listMessages = await messageModel.find().lean();

    res.render("chat", { listMessages, user, style: "message.css" });
  } catch (error) {
    console.error("No se encuentas mensajes en la Base de datos", error);
  }
});

router.post("/messages", isUser, async (req, res) => {
  try {
    let { mensaje } = req.body;
    let user = new userDTO(req.session.user);
    await messageM.addMessage(user.first_name, mensaje);
    const listMessages = await messageModel.find().lean();
    res.render("chat", { listMessages, style: "message.css" });
  } catch (error) {
    res.send({ message: "usted no es usuario" });
  }
});

router.put("/", (req, res) => {
  res.send("Estoy llegando desde Put de messages.router");
});

router.delete("/messages/:uid", async (req, res) => {
  let { uid } = req.params;
  let messages = await messageModel.find();
  try {
    const exist = messages.find((m) => m.id === uid);
    await messageM.deleteMessage(uid);
    res.status(201).json({ message: `Mensaje borrado` });
  } catch (error) {
    if (error.message === "No se encuentra mensaje en la base de datos") {
      res.status(400).json({
        error: `No se encuentra mensaje con ID: ${uid} en la base de datos`,
      });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
});

module.exports = router;
