const productManager = require("../dao/classes/product.dao.js");
const cartManager = require("../dao/classes/cart.dao.js");
const productModel = require("../dao/models/product.model.js");
const cartModel = require("../dao/models/cart.model.js");
const { generateProducts } = require("../utils.js");
const productService = new productManager();
const cartService = new cartManager();
const CustomError = require("../services/errors/CustomErrors.js");
const EErrors = require("../services/errors/enum.js");
const { iqualCode } = require("../services/errors/info.js");
const { devLogger } = require("../middleware/logger.js");

exports.mockingProducts = async (req, res) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  res.render("mocking", { products: products, style: "products.css" });
};

exports.getProducts = async (req, res) => {
  let { limit = 3, page = 1, sort, category } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);

  try {
    // Construir filtro de búsqueda
    let filter = {};
    if (category) {
      // Buscar por categoría o disponibilidad
      filter = {
        $or: [
          { category: category.toUpperCase() },
          { available: category.toLowerCase() === "true" }, // Comparar como booleano
        ],
      };
    }

    // Opciones de sorteo
    let sortOptions = {};
    if (sort) {
      sortOptions.price = sort === "asc" ? 1 : -1;
    }

    // Obtener el total de productos que coinciden con el filtro
    const totalProducts = await productService.totalProducts(filter);

    // Calcular la paginación
    const totalPages = Math.ceil(totalProducts / limit);
    const offset = (page - 1) * limit;

    // Obtener productos paginados
    const products = await productModel
      .find(filter)
      .lean()
      .sort(sortOptions)
      .skip(offset)
      .limit(limit);

    // Construir la respuestas
    const response = {
      status: "success",
      payload: products,
      userOne: req.session.user,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1
          ? `/products?limit=${limit}&page=${page - 1}&sort=${
              sort || ""
            }&category=${category || ""}`
          : null,
      nextLink:
        page < totalPages
          ? `/products?limit=${limit}&page=${page + 1}&sort=${
              sort || ""
            }&category=${category || ""}`
          : null,
    };

    //Renderizamos la vista
    if (req.session.user.rol === "user" || req.session.user.rol === "premium") {
      const cart = await cartService.getCartById(req.session.user.cart);
      //   const cart = await cartModel.findById(req.session.user.cart);
      res.render("products", {
        user: req.session.user,
        cart: cart.products,
        response,
        style: "products.css",
        title: "Productos",
      });
    } else {
      let isAdmin = true;
      res.render("products", {
        user: req.session.user,
        response,
        style: "products.css",
        title: "Productos",
        isAdmin: isAdmin,
      });
    }

    // res.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.productDetails = async (req, res) => {
  let { pid } = req.params;
  const product = await productService.getProductById(pid);
  if (req.session.user.rol === "admin") {
    let isAdmin = true;
    res.render("productDetail", {
      user: req.session.user,
      product,
      style: "productDetails.css",
      title: "Detalles producto",
      isAdmin: isAdmin,
    });
    // res.send(product)
  } else {
    const cart = await cartService.getCartById(req.session.user.cart);
    if (cart) {
      res.render("productDetail", {
        cart: cart.products,
        user: req.session.user,
        product,
        style: "productDetails.css",
        title: "Detalles producto",
      });
    }
  }
};

exports.productsAdmin = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    if (!page) page = 1;
    let result = await productModel.paginate(
      {},
      { page, limit: 3, lean: true }
    );
    result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
    result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";
    result.isValid = !(page <= 0 || page > result.totalPages);
    result.style = "products.css";
    result.title = "Administrador de productos";
    result.user = req.session.user;

    res.render("productsManager", result);
    // res.send({ result: "success", payload: products });
  } catch (error) {
    console.error("No se encuentran productos en la Base de datos", error);
  }
};

exports.addProductToBD = async (req, res) => {
  let { email, rol } = req.session.user;
  let { title, description, price, thumbnail, code, status, category, stock } =
    req.body;
  let page = parseInt(req.query.page);
  if (!page) page = 1;
  let result = await productModel.paginate({}, { page, limit: 3, lean: true });
  result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
  result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";
  result.isValid = !(page <= 0 || page > result.totalPages);
  result.style = "products.css";
  result.agregado = "Producto agregado correctamente";
  result.user = req.session.user;

  try {
    if (rol === "admin") {
      await productService.addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        status,
        category,
        stock,
        "admin"
      );

      res.render("productsManager", result);
      return;
    }
    await productService.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      category,
      stock,
      email
    );

    res.render("productsManager", result);
  } catch (error) {
    if (error.message === "No se han completado todos los campos") {
      result.error = "No se han completado todos los campos";
      res.render("productsManager", result);
    } else if (
      error.message ===
      `Código de producto ${code} existente en la base de datos`
    ) {
      const error = CustomError.createError({
        name: "Código ya existente en base de datos",
        cause: iqualCode(code),
        message: `Código de producto ${code} existente en la base de datos`,
        code: EErrors.DATABASE_ERROR,
      });
      result.error = error.message;

      res.render("productsManager", result);
      // res.status(400).json({ error: "Número de código existente" });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
};

exports.getUpdateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    let result = await productService.getProductById(pid);

    res.render("updateProduct", {
      result: result,
      title: "Actualización de productos",
      style: "products.css",
    });
  } catch (error) {}
};

exports.updateProductToDB = async (req, res) => {
  let { email, rol } = req.session.user;
  let { uid } = req.params;
  let { title, description, price, thumbnail, code, status, category, stock } =
    req.body;

  try {
    const product = await productService.getProductById(uid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    //Creo el objeto nuevo para agregar con las opciones para que no se borre ninguna propiedad de no pasarla como parámetro
    const productoActualizado = {
      _id: product._id,
      title: title || product.title,
      description: description || product.description,
      price: price || product.price,
      thumbnail: thumbnail || product.thumbnail,
      code: code || product.code,
      status: product.status,
      category: category || product.category,
      stock: stock || product.stock,
    };
    const result = await productService.updateProduct(productoActualizado);

    return res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al procesar la solicitud" });
  }
};

exports.deleteProductToDB = async (req, res) => {
  let { uid } = req.params;
  let { email, rol } = req.session.user;
  try {
    const product = await productService.getProductById(uid);
    if (rol === "premium") {
      if (product.owner === email) {
        await productService.deleteProduct(uid);
        devLogger.debug("Producto eliminado por premium");

        return res
          .status(200)
          .json({ message: "Producto eliminado exitosamente" });
      } else {
        devLogger.debug(
          "No puede eliminar este producto por no ser propietario"
        );
        return res
          .status(202)
          .json({ message: `Usted no puede eliminar este producto` });
        // res.redirect("/productsManager");
        // return;
      }
    }
    if (rol === "admin") {
      await productService.deleteProduct(uid);
      devLogger.debug("Producto eliminado por administrador");
      return res
        .status(200)
        .json({ message: "Producto eliminado exitosamente" });
    }
    res.redirect("/productsManager");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocurrió un error al procesar la solicitud" });
  }
};
