const express = require("express");
const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middleware/auth.js");
const sessionController = require("../controllers/sessionController.js");
const userDTO = require("../dao/DTOs/user.dto");
const router = express.Router();

//Vista de la páginade logueo
router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login", { style: "login.css", title: "Bienvenido" });
});

//Vista de la página que pide correo para enviar link de cambio de contraseña
router.get("/changepassword", sessionController.changePasswordGet);

//Envía correo con lonik de cambio de contrase{a}
router.post("/changepassword", sessionController.changePasswordPost);

//Vista para cambiar contraseña
router.get("/reset_password", sessionController.reset_password);

//Viste de usuario registrado
router.get("/userregistrade", (req, res) => {
  res.render("registrade", {
    style: "login.css",
    title: "Registro Exitoso",
  });
});

//Vista para registrarse
router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register", { style: "register.css", title: "Registro" });
});

//Vista de datosd de perfil
router.get("/profile", isAuthenticated, (req, res) => {
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
});

module.exports = router;
