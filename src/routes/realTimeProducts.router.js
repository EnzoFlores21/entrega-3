import { Router } from "express";
import {
  renderRealTimeProducts,
  addProductOnRealTime,
} from "../controllers/realTimeProducts.controller.js";
import { authorization, passportCall } from "../utils.js";

const router = Router();

router.get("/", passportCall("jwt"), authorization("admin"), renderRealTimeProducts);

router.post("/", passportCall("jwt"), authorization("admin"), addProductOnRealTime);

export default router;
