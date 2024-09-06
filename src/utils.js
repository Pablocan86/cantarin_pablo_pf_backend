const bcrypt = require("bcryptjs");
const { create } = require("connect-mongo");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { faker } = require("@faker-js/faker");

faker.location = "es";

const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret";

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24" });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "Not authenticated" });
  console.log(authHeader);
  const token = authHeader.split(" ")[1]; //El espacio entre comillas es importante
  console.log(authHeader);
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "Not authorized" });
    req.user = credentials.user;
    next();
  });
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: "Unauthorized" });
    if (req.user.role !== role)
      return res.status(403).send({ error: "No permission" });
    next();
  };
};

const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.urlLoremFlickr(),
    code: faker.string.alphanumeric({ length: 6 }),
    status: faker.datatype.boolean(),
    category: faker.commerce.department(),
    stock: faker.number.int({ max: 100 }),
  };
};

module.exports = {
  createHash,
  isValidPassword,
  generateToken,
  authToken,
  passportCall,
  authorization,
  generateProducts,
};
