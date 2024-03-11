export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAllCarts = () => {
    return this.dao.getAllCarts();
  };

  createCart = (cart) => {
    return this.dao.createCart(cart);
  };

  getCartById = (_id) => {
    return this.dao.getCartById(_id);
  };

  updateCart = (cid, cart) => {
    return this.dao.updateCart({ _id: cid }, cart);
  };

  deleteCart = (_id) => {
    return this.dao.deleteCart(_id);
  };

  deleteAllCarts = () => {
    return this.dao.deleteAllCarts();
  };

  getProductsFromCart = (cid) => {
    return this.dao
      .findOne({ _id: cid })
      .populate({
        path: "products.product",
        model: "products",
      })
      .exec();
  };
}
