const tokenModel = require("../models/tokens.model.js");

class TokenManager {
  constructor() {}

  async createToken(token) {
    const newToken = await tokenModel.create(token);
    return newToken;
  }

  async getToken(token) {
    let existToken = await tokenModel.findOne({ token: token });
    return existToken;
  }
}

module.exports = TokenManager;
