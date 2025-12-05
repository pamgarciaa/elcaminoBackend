import express from "express";
import { getAllKitsController } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllKitsController);

export default router;
