import { Router } from "express";
import { authorization, passportCall } from "../utils.js";
import { getAllPRoducts, getProductById, createProduct, deleteProduct, modifyProduct } from "../controllers/products.controller.js"

const router = Router();

router.get("/", passportCall("jwt"), authorization("user"), getAllPRoducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.delete("/:id", deleteProduct);

router.put("/:id", modifyProduct);

export default router;
