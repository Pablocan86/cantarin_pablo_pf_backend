const express = require("express");
const upload = require("../middleware/multer.js");
const userController = require("../controllers/userController.js");

const router = express.Router();

const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
} = require("../middleware/auth.js");

router.get("/", isAuthenticated, isAdmin, userController.getUsers);
router.get("/premium/:uid", isAuthenticated, isAdmin, userController.getUser);

router.get("/:uid/documents", isAuthenticated, userController.getDocuments);

router.post(
  "/:uid/documents",
  upload.fields([
    { name: "identification", maxCount: 1 },
    { name: "adressVerification", maxCount: 1 },
    { name: "accountStatement", maxCount: 1 },
  ]),
  userController.postDocuments
);

router.put("/premium/:uid", userController.putRolUser);

module.exports = router;
