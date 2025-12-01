import express from "express";
import {
  getMyOrdersController,
  getAllOrdersController,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/myorders", protect, getMyOrdersController);

router.get("/all", protect, checkRole(["admin"]), getAllOrdersController);

export default router;
