const passport = require("passport");
const userDTO = require("../dao/DTOs/user.dto");
const { createHash, isValidPassword } = require("../utils.js");
const nodemailer = require("nodemailer");
const { devLogger, prodLogger } = require("../middleware/logger.js");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const TokenManager = require("../dao/classes/token.dao.js");
const UserManager = require("../dao/classes/user.dao.js");

const tokenService = new TokenManager();
const userService = new UserManager();

dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.usermail,
    pass: process.env.pass,
  },
});

exports.register = async (req, res) => {
  res.redirect("/userregistrade");
};

exports.failregister = async (req, res) => {
  res.render("register", {
    style: "register.css",
    title: "Registro",
    error: "No se puede registar al usuario",
  });
};

exports.login = async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales invalidas" });
  try {
    if (!req.user) return res.redirect("/register");
    req.session.user = {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      rol: req.user.rol,
      last_connection: req.user.last_connection,
    };
    if (req.session.user.rol === "admin") {
      res.redirect("/productsManager");
    } else {
      res.redirect("/products");
    }
  } catch (err) {
    res.status(500).send("Error al iniciar sesión");
  }
};

exports.changePasswordGet = async (req, res) => {
  res.render("changePassword", { style: "requireEmail.css" });
};

exports.changePasswordPost = async (req, res) => {
  let correo = req.body.correo;
  let user = await userService.getUserByEmail(correo);
  let token = uuidv4();
  let expirationTime = Date.now() + 3600 * 1000;
  let newToken = {
    token: token,
    email: correo,
    expirationTime: expirationTime,
  };
  await tokenService.createToken(newToken);

  let mail = await transport.sendMail({
    from: "pablo.cantarin86@gmail.com",
    to: correo,
    subject: "Restablecimiento de contraseña",
    html: `  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title><style>
      body {
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
          "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      h1 {
        background-color: black;
        width: 100%;
        color: white;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h1>RESTABLECIMIENTO DE CONTRASEÑA</h1>
    <p>Hola ${user.first_name}!</p>
    <div>
      <p>Ingresa al siguiente link:</p>
      <p>http://localhost:8080/reset_password?token=${token}</p>
    </div>
  </body>
  </html>
`,
  });
  let login = "/login";
  res.render("changePassword", {
    gracias: "Gracias",
    aviso: `Revisa tu correo ${correo}`,
    style: "requireEmail.css",
    link: login,
  });
};

exports.reset_password = async (req, res) => {
  const token = req.query.token;
  let existToken = await tokenService.getToken(token);
  let currentTime = Date.now();
  if (currentTime > existToken.expirationTime) {
    res.redirect("/changePassword");
  } else {
    res.render("resetPassword", {
      token: token,
      correo: existToken.email,
      style: "resetPassword.css",
    });
  }
};

exports.changePasswordPut = async (req, res) => {
  const { correo, password } = req.body;

  try {
    let user = await userService.getUserByEmail(correo);
    let isSamePassword = isValidPassword(user, password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "No se puede utilizar la misma contraseña" });
    } else {
      let newPassword = createHash(password);
      let change = { password: newPassword };
      await userService.updateUser(correo, change);

      return res
        .status(200)
        .json({ message: "Contraseña actualizada correctamente" });
    }
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.current = async (req, res) => {
  try {
    let id = req.session.user.id;
    if (req.session.user) {
      let user = new userDTO(req.session.user);
      res.render("profile", { user: user, style: "profile.css", id: id });
    } else {
      res.render("profile", {
        style: "profile.css",
        error: "No ha iniciado sesión",
      });
    }
  } catch (error) {
    prodLogger.warning("No ha iniciado sesión");
  }
};

exports.logout = async (req, res) => {
  const { email } = req.session.user;
  const date = new Date();
  const formatDate = date.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const last = { last_connection: formatDate };
  await userService.updateUser(email, last);
  req.session.destroy((err) => {
    if (err) {
      prodLogger.error("Error al cerrar cesión");
      return res.status(500).send("Error al cerrar sesión");
    }

    res.redirect("/login");
  });
};

exports.googleCallback = async (req, res) => {
  req.session.user = req.user;
  if (req.session.user.rol === "admin") {
    res.redirect("/productsManager");
  }
  if (req.session.user.rol === "user") {
    res.redirect("/products");
  }
};

exports.githubCallback = async (req, res) => {
  req.session.user = req.user;
  if (req.session.user.rol === "admin") {
    res.redirect("/productsManager");
  } else {
    res.redirect("/products");
  }
};
