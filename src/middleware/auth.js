const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    res.redirect("/profile");
  }
};

const isAdmin = (req, res, next) => {
  const { rol } = req.session.user;
  if (rol === "admin") {
    return next();
  } else {
    res.redirect("/products");
  }
};

const isAdminOrPremium = (req, res, next) => {
  const { rol } = req.session.user;
  if (rol === "admin" || rol === "premium") {
    return next();
  } else {
    res.redirect("/products");
  }
};

const isUser = (req, res, next) => {
  if (req.session.user.rol === "user") {
    return next();
  } else {
    res.send({ message: "Usted no es usuario" });
  }
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isAdminOrPremium,
  isUser,
};
