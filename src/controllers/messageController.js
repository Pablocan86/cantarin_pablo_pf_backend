const messageManager = require("../dao/classes/message.dao.js");
const userManager = require("../dao/classes/user.dao.js");

const messageService = new messageManager();

exports.getMessages = async (req, res) => {
  try {
    let user = req.session.user;
    const listMessages = await messageService.getMessages(user.email);

    res.render("chat", { listMessages, user, style: "message.css" });
  } catch (error) {
    console.error("No se encuentas mensajes en la Base de datos", error);
  }
};

exports.createMessage = async (req, res) => {
  let user = req.session.user.email;
  try {
    let { mensaje } = req.body;
    await messageService.createMessage(user, mensaje);
    const listMessages = await messageService.getMessages(user);
    res.render("chat", { listMessages, style: "message.css" });
  } catch (error) {
    res.send({ message: "usted no es usuario" });
  }
};

exports.deleteMessage = async (req, res) => {
  let { uid } = req.params;
  let user = req.session.user;

  try {
    await messageService.deleteMessage(uid);
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
};
