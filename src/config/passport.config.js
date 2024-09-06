const passport = require("passport");
const GitHubStrategy = require("passport-github2");
const local = require("passport-local");
const userService = require("../dao/models/users.model.js");
const cartService = require("../dao/models/cart.model.js");
const { createHash, isValidPassword } = require("../utils.js");
const dotenv = require("dotenv");
const CustomError = require("../services/errors/CustomErrors.js");
const EErrors = require("../services/errors/enum.js");
const { generateUserErrorInfo } = require("../services/errors/info.js");
const { devLogger, prodLogger } = require("../middleware/logger.js");
dotenv.config();

const LocalStrategy = local.Strategy;
const GoogleStrategy = require("passport-google-oauth20");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["secretCode"];
  }
  return token;
};

const initializePassport = () => {
  //Estrategia de Google
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.Google_clientID,
        clientSecret: process.env.Google_clientSecret,
        callbackURL: "http://localhost:8080/api/sessions/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userService.findOne({ email: profile._json.email });
          if (!user) {
            const newCart = new cartService();
            let createCart = await cartService.create(newCart);
            let newUser = {
              first_name: profile._json.email,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
              cart: createCart._id,
            };
            let result = await userService.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Estrategia de GitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GitHub_clientID,
        clientSecret: process.env.GitHub_clientSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userService.findOne({
            email: profile._json.email,
          });
          if (!user) {
            const newCart = new cartService();
            let createCart = await cartService.create(newCart);
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
              cart: createCart._id,
            };

            let result = await userService.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Estrategia Personalizada
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          if (!first_name || first_name.trim() === "") {
            prodLogger.info("Debe completar los campos");
            throw CustomError.createError({
              name: "Debe completar más de un campo",
              cause: generateUserErrorInfo(),
              message: "Error al crear el usuario",
              code: EErrors.INVALID_TYPES_ERROR,
              shouldThrow: true,
            });
          }
          let user = await userService.findOne({ email: username });
          if (user) {
            devLogger.info("Usuario existente");
            return done(null, false);
          }
          const newCart = new cartService();
          let createCart = await cartService.create(newCart);

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: createCart._id,
          };
          let result = await userService.create(newUser);
          return done(null, result);
        } catch (error) {
          if (error.shouldThrow) {
            return done(null, false, { message: error.message });
          } else {
            return done(null, false, {
              message: "Error al obtener el usuario: " + error.message,
            });
          }
        }
      }
    )
  );

  //Estrategia JWT
  // passport.use(
  //   "jwt",
  //   new JWTStrategy(
  //     {
  //       jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
  //       secretOrKey: "secretCode",
  //     },
  //     async (jwt_payload, done) => {
  //       try {
  //         return done(null, jwt_payload);
  //       } catch (error) {
  //         return done(error);
  //       }
  //     }
  //   )
  // );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userService.findById(id);
    done(null, user);
  });

  //Estrategia Personalizada
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.findOne({ email: username });
          if (!user) {
            return done(null, user);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
