import ProductsService from "../services/dao/mongoDb/products.dao.js";
import realTimeProductsSocket from "../sockets/realTimeProducts.socket.js";

const productsService = new ProductsService();

export const renderRealTimeProducts = (request, response) => {
  response.render("realTimeProducts", {
    title: "Agregar productos en tiempo real.",
    fileCss: "../css/styles.css",
  });
};

export const addProductOnRealTime = async (request, response) => {
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

  const product = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  };

  try {
    await productsService.createProduct(product);
    realTimeProductsSocket.emitAddProduct(product);
    
    response.status(201).json({
      data: {
        message: "Producto creado",
      },
    });
  } catch (e) {
    response.status(500).json({
      error: {
        message: e.message,
      },
    });
  }
};
