import { Router } from "express";
import {
  getNewCart,
  renderCart,
  getCartById,
  deleteCartById,
  deleteProductFromCart,
  addProductToCart,
  modifyProductQuantityToCart,
  modifyProductOnCart,
  finishPurchase,
  getAllCarts,
} from "../controllers/carts.controller.js";
import { authorization, passportCall } from "../utils.js";

const router = Router();

router.post("/", passportCall("jwt"), authorization("user"), getNewCart);

router.get("/", getAllCarts);

router.get("/:cid", getCartById);

router.delete("/:cid", deleteCartById);

router.delete("/:cid/products/:pid", deleteProductFromCart);

router.post("/:cid/products/:pid", addProductToCart);

router.put("/:cid", modifyProductQuantityToCart);

router.put("/:cid/products/:pid", modifyProductOnCart);

router.get("/:cid/purchase", passportCall("jwt"), authorization("user"), renderCart)

router.post("/:cid/purchase", passportCall("jwt"), authorization("user"), finishPurchase)

export default router;
