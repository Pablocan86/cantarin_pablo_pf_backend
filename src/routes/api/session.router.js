const express = require("express");
const passport = require("passport");
const sessionController = require("../../controllers/sessionController.js");
const {
  generateToken,
  authToken,
  passportCall,
  authorization,
} = require("../../utils.js");

const router = express.Router();

const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret";
const users = [];

//Registra usuario
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "failregister",
  }),
  sessionController.register
);
//Si falla registro
router.get("/failregister", sessionController.failregister);
//Loguea
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "faillogin" }),
  sessionController.login
);

//Cambia contraseña de usuario
router.put("/change_password", sessionController.changePasswordPut);

//Datos del usuario de la session
router.get("/current", sessionController.current);

//Si falla el logueo
router.get("/faillogin", (req, res) => {
  res.render("login", {
    style: "login.css",
    title: "Bienvenido",
    Error: "Usuario y/o contraseña incorrectos",
  });
});

//Deslogueo
router.post("/logout", sessionController.logout);

//Autorización de google
router.get("/auth/google", passport.authenticate("google", { scope: "email" }));

//Callback de google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "login" }),
  sessionController.googleCallback
);

//Logueo con GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: "user.email" }),
  async (req, res) => {}
);

//Callback GitHub
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "login" }),
  sessionController.githubCallback
);
module.exports = router;
