import express from "express";
import {
  createProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { createUploadMiddleware } from "../middlewares/multer.middleware.js";

const upload = createUploadMiddleware("products");
const router = express.Router();

router.get("/", getAllProductsController);

router.post(
  "/",
  protect,
  checkRole("admin", "moderator"),
  upload.single("productImage"),
  createProductController
);

router.patch(
  "/:id",
  protect,
  checkRole("admin", "moderator"),
  upload.single("productImage"),
  updateProductController
);

router.delete(
  "/:id",
  protect,
  checkRole("admin", "moderator"),
  deleteProductController
);

export default router;
