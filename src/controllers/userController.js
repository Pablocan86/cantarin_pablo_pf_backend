const UserManager = require("../dao/classes/user.dao.js");
const upload = require("../middleware/multer.js");
const userService = new UserManager();

exports.getUsers = async (req, res) => {
  try {
    let users = await userService.getUsers();
    res.render("users", { users: users, style: "users.css" });
  } catch (error) {}
};
exports.getUser = async (req, res) => {
  let { uid } = req.params;
  try {
    let user = await userService.getUserById(uid);

    res.render("changeRol", { user: user, style: "users.css" });
  } catch (error) {}
};

exports.putRolUser = async (req, res) => {
  let { uid } = req.params;
  try {
    let user = await userService.getUserById(uid);
    if (user.rol === "premium") {
      const newRol = { rol: "user" };
      await userService.updateUserRol(user.email, newRol);

      return res
        .status(202)
        .json({ message: `Se cambio rol de usuario a ${newRol.rol}` });
    }
    if (user.rol === "user") {
      if (user.documents.length >= 3) {
        const newRol = { rol: "premium" };
        await userService.updateUserRol(user.email, newRol);
        return res
          .status(202)
          .json({ message: `Se cambio rol de usuario a ${newRol.rol}` });
      } else {
        return res.status(202).json({ message: `Falta documentación` });
      }
    }
    if (user.rol === "admin")
      return res
        .status(202)
        .json({ message: "El administrador no puede cambiar el rol" });

    res.redirect(`/premium/${uid}`);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocurrió un error al procesar la solicitud" });
  }
};

exports.getDocuments = async (req, res) => {
  const { uid } = req.params;
  res.render("documents", {
    style: "documents.css",
    user: req.session.user,
    id: uid,
  });
};

exports.postDocuments = async (req, res) => {
  const { uid } = req.params;
  let user = await userService.getUserById(uid);
  const idUser = { _id: uid };
  const documents = [];
  for (let fieldname in req.files) {
    req.files[fieldname].forEach((file) => {
      documents.push({
        name_document: fieldname,
        reference: file.filename,
      });
    });
  }
  if (user.documents.length === 3) {
    res.render("documents", {
      style: "documents.css",
      user: user,
      id: uid,
      message: "Ya se encuentra cargada toda la documentación",
    });
  }
  await userService.postDocuments(idUser, documents);
  res.render("documents", {
    style: "documents.css",
    user: req.session.user,
    id: uid,
    message: "Documentación cargada correctamente",
  });
};
