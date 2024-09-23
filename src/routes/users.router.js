const express = require("express");
const upload = require("../middleware/multer.js");
const userController = require("../controllers/userController.js");

const router = express.Router();

const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
} = require("../middleware/auth.js");

//Vista de todos los usuarios registrados
router.get("/", isAuthenticated, isAdmin, userController.getUsers);

//Vista para cambiar rol de usuarios
router.get("/premium/:uid", isAuthenticated, isAdmin, userController.getUser);

//Vista para subir documentación por el usuario
router.get("/:uid/documents", isAuthenticated, userController.getDocuments);

//Vista de las compras del usuario
router.get("/shopping/:uid", isAuthenticated, userController.userBuy);

//Sube documentación al perfil del usuario
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "identification", maxCount: 1 },
    { name: "adressVerification", maxCount: 1 },
    { name: "accountStatement", maxCount: 1 },
  ]),
  userController.postDocuments
);

//Actualiza rol del usuario
router.put("/premium/:uid", userController.putRolUser);

//Elimina aquellos usuarios con más de dos dias sin conexión (solo es endpoint no tiene vista)
router.delete("/", isAuthenticated, isAdmin, userController.deleteInactive);

//Elimina usuario
router.delete("/:uid", isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
