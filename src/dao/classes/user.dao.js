const userModel = require("../models/users.model.js");

class UserManager {
  constructor() {}

  async getUsers() {
    let users = userModel.find().lean();
    return users;
  }

  async getUserById(id) {
    let user = userModel.findById(id).lean();
    return user;
  }
  async getUserByEmail(email) {
    let user = userModel.findOne({ email: email });
    return user;
  }

  async postDocuments(id, documents) {
    await userModel.findOneAndUpdate(
      id,
      { $push: { documents: { $each: documents } } },
      { new: true }
    );
  }

  async updateUser(correo, propiedad) {
    await userModel.updateOne({ email: correo }, propiedad);
  }

  async updateUserRol(correo, rol) {
    await userModel.updateOne({ email: correo }, rol);
  }
}

module.exports = UserManager;
