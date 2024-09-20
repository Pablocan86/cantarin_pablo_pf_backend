const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const messageRouter = require("./routes/messages.router.js");
const sessionRouter = require("./routes/api/session.router.js");
const viewsRouter = require("./routes/views.router.js");
const usersRouter = require("./routes/users.router.js");
const dotenv = require("dotenv");
const passport = require("passport");
const { errorHandler } = require("./middleware/index.js");
const initializePassport = require("./config/passport.config.js");
const { devLogger, prodLogger } = require("./middleware/logger.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use(cors());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
    secret: "secretCode",
    resave: false,
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  try {
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error en la conexión", error);
  }
};

connectMongoDB();

const swaggerOptions = {
  definition: {
    openapi: `3.0.1`,
    info: {
      title: "Documentación ecommerce Cantarin",
      description: `Proyecto del curso de Backend con el tío Omar 👮‍♂️.`,
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);
app.use("/", productsRouter);
app.use("/carts", cartsRouter);
app.use("/", messageRouter);
app.use("/api/users", usersRouter);
app.use(errorHandler);

app.listen(PORT, `0.0.0.0`, () =>
  console.log(`Server listening on port ${PORT}`)
);
