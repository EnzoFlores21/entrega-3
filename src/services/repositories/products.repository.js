import mongoose from "mongoose";

export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAllProducts = () => {
    return this.dao.getAllProducts();
  };

  getProductById(_id) {
    const objectId = new mongoose.Types.ObjectId(_id);
    return this.dao.getProductById(objectId);
  }

  createProduct = (product) => {
    return this.dao.createProduct(product);
  };

  updateProduct = (_id, product) => {
    const objectId = new mongoose.Types.ObjectId(_id);
    return this.dao.updateProduct(objectId, product);
  };

  deleteProduct = (_id) => {
    const objectId = new mongoose.Types.ObjectId(_id);
    return this.dao.deleteProduct(objectId);
  };
}
