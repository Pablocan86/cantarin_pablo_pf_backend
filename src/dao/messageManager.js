const messageModel = require("../dao/models/message.model");

class MessageManager {
  constructor() {}

  async addMessage(user, message) {
    const newMessage = await messageModel.create({
      user: user,
      message: message,
    });
  }

  async deleteMessage(id) {
    const messages = await messageModel.find();
    const exist = messages.find((m) => m.id === id);
    if (exist) {
      await messageModel.deleteOne({ _id: id });
    } else {
      throw Error("No se encuentra mensaje en la base de datos");
    }
  }
}

module.exports = MessageManager;
