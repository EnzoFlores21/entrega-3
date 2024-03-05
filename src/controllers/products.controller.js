import { productsService, usersService } from "../services/service.js";

export async function getAllPRoducts(request, response) {

  try {
    
    const { limit, page, query, sort } = request.query;

    const productsToRender = await productsService.getAllProducts(
      limit,
      page,
      query,
      sort
    );

    response.render("home", {
      title: "Productos",
      productsToRender,
      fileCss: "../css/styles.css",
    });
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Internal Server Error");
  }
};

export const getProductById = async (request, response) => {
  const { id } = request.params;

  try {
    const product = await productsService.getProductById(id);

    if (product) {
      return response.json(product);
    } else {
      return response.send("ERROR: producto no encontrado.");
    }
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
};

export const createProduct = async (request, response) => {
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  } = request.body;
  const product =
    (title, description, price, thumbnail, code, stock, status, category);

  try {
    await productsService.createProduct(product);
    response.json({
      message: "Producto creado.",
      product,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
};

export const deleteProduct = async (request, response) => {
  const { id } = request.params;

  try {
    await productsService.deleteProduct(id);
    response.json({
      message: `Producto con ID ${id} eliminado.`,
    });
  } catch (error) {
    if (error.code === "ECONNRESET") {
      console.error("Error de conexión:", error);
      return response.status(500).json({
        error: "Error de conexión al intentar eliminar el producto.",
      });
    } else {
      response.status(500).json({
        error: error.message,
      });
    }
  }
};

export const modifyProduct = async (request, response) => {
  const { id } = request.params;
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  } = request.body;
  const updatedProduct = new Product(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category
  );

  try {
    await productsService.updateProduct(id, updatedProduct);
    response.json({
      message: `Producto con ID ${id} modificado.`,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
      id: numberId,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
};
