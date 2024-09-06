const fs = require("fs").promises;

class ProductManager {
  constructor() {
    //Ubicación de archivo base de datos de productos
    this.productsFile = "./preEntrega1_Cantarin_Backend/src/Products.json";
  }
  //Método que agrega un producto a la base de datos
  async addProduct(
    title,
    description,
    price,
    status = true,
    thumbnail = [],
    code,
    stock,
    category
  ) {
    try {
      //Lectura de base de datos de productos
      const products = await this.readProducts();
      //Validación para que complete todos los datos el usuario, por ahora no agrego status porque por defecto es "true" según consignas
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !category
      ) {
        console.error("Todos los campos son obligatorios");
        return;
      }
      //Verifico que no exista un mismo código
      if (products.some((prod) => prod.code === code)) {
        console.error("Ya existe un producto con ese código");
        return;
      }
      //Variable que capta último de la base de datos
      const ultimoId =
        products.length > 0 ? Math.max(...products.map((prod) => prod.id)) : 0;

      const product = {
        id: ultimoId + 1,
        title,
        description,
        price,
        status: status,
        thumbnail,
        code,
        stock,
        category,
      };
      //Pusheo a el array de lectura de productos para luego reescribir el archivo json
      products.push(product);

      fs.writeFile(this.productsFile, JSON.stringify(products));
      console.log(
        `Su producto con el nombre "${product.title}" fue agregado correctamente`
      );
    } catch (error) {
      console.error("No se agregar el producto", error);
    }
  }
  //Método para obetener todos los productos de la base de datos (Products.json)
  async getProducts() {
    try {
      const productos = await this.readProducts();
      console.log(productos);
    } catch (error) {
      console.error("No se encuetran productos en la base de datos");
    }
  }
  //Método para obtener producto por id
  async getProductById(id) {
    try {
      const products = await this.readProducts();
      const productById = products.find((prod) => prod.id === id);
      if (productById) {
        return productById;
      } else console.log("No existe ese producto");
    } catch (error) {
      console.error("No se encuentra un producto  en la base de datos", error);
    }
  }
  //Método para actualizar algún producto, solo el valor que le paso sin borrar los otros
  async updateProduct(
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category
  ) {
    try {
      const products = await this.readProducts();
      const productoEncontrado = products.find((prod) => prod.id === id);
      if (!productoEncontrado) {
        return;
      }
      //Creo el objeto nuevo para agregar con las opciones para que no se borre ninguna propiedad de no pasarla como parámetro
      const productoActualizado = {
        id,
        title: title || productoEncontrado.title,
        description: description || productoEncontrado.description,
        price: price || productoEncontrado.price,
        status: productoEncontrado.status,
        thumbnail: thumbnail || productoEncontrado.thumbnail,
        code: code || productoEncontrado.code,
        stock: stock || productoEncontrado.stock,
        category: category || productoEncontrado.category,
      };
      const productosActualizados = products.map((prod) => {
        if (prod.id === id) {
          return productoActualizado;
        }

        return prod;
      });

      await fs.writeFile(
        this.productsFile,
        JSON.stringify(productosActualizados, null, 2),
        "utf8"
      );

      console.log("Producto actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  }
  //Método para borrar producto del id que le paso como parámetro
  async deleteProduct(id) {
    try {
      const products = await this.readProducts();
      const newProducts = products.filter((prod) => prod.id != id);
      const deletedProduct = products.find((prod) => prod.id === id);
      if (deletedProduct) {
        fs.writeFile(this.productsFile, JSON.stringify(newProducts, null, 2));
        console.log(`Usted ha eliminado el producto ${deletedProduct.title}`);
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al leer el archivo de productos", error);
    }
  }
  //Método para leer el archivo Products.json y poder usarlo en otros métodos
  async readProducts() {
    try {
      const contenido = await fs.readFile(this.productsFile, "utf8");
      const productos = JSON.parse(contenido);
      return productos;
    } catch (error) {
      console.error("Error al leer el archivo de productos: ", error);
      throw error;
    }
  }
}

//Dejo abajo instancia de clase por si se quieren probar los métodos desde este archivo
// const manager = new ProductManager()

module.exports = ProductManager;
