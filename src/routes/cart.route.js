import express from "express";
import {
  addToCartController,
  getCartController,
  checkoutController,
  deleteItemFromCartController,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addToCartController);
router.get("/", protect, getCartController);
router.post("/checkout", protect, checkoutController);
router.delete("/:productId", protect, deleteItemFromCartController);

export default router;
