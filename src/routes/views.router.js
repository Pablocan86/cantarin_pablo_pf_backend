const express = require("express");
const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middleware/auth.js");
const sessionController = require("../controllers/sessionController.js");
const userDTO = require("../dao/DTOs/user.dto");
const router = express.Router();

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login", { style: "login.css", title: "Bienvenido" });
});

router.get("/changepassword", sessionController.changePasswordGet);

router.post("/changepassword", sessionController.changePasswordPost);

router.get("/reset_password", sessionController.reset_password);

router.get("/userregistrade", (req, res) => {
  res.render("registrade", {
    style: "login.css",
    title: "Registro Exitoso",
  });
});

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register", { style: "register.css", title: "Registro" });
});

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
