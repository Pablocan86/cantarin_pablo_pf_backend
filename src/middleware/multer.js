const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../src/documents"));
  },
  filename: (req, file, cb) => {
    const email = req.session.user.email;
    const username = email.split("@")[0];
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    cb(null, `${username}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
