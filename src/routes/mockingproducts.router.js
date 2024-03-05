import { Router } from "express";
import { getMockProducts } from "../controllers/mockingproducts.controller.js";

const router = Router();

router.get("/", getMockProducts);

export default router;