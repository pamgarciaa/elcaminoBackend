import express from "express";
import {
  addToCart,
  getCart,
  checkout,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.post("/checkout", protect, checkout);

export default router;
