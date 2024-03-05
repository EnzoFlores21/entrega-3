import { Router } from "express";
import { passportCall } from "../utils.js";
import { renderProfile } from "../controllers/profile.controller.js";
const router = Router();

router.get("/", passportCall("jwt"), renderProfile);

export default router;
