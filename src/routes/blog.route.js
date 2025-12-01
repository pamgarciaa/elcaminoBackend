import express from "express";
import {
  createBlogController,
  editBlogController,
  deleteBlogController,
  getBlogController,
  getAllBlogsController,
} from "../controllers/blog.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { createUploadMiddleware } from "../middlewares/multer.middleware.js";
const upload = createUploadMiddleware("blogs");
const router = express.Router();

router.post(
  "/",
  protect,
  checkRole("admin", "moderator"),
  upload.single("blogImage"),
  createBlogController
);
router.delete(
  "/:id",
  protect,
  checkRole("admin", "moderator"),
  deleteBlogController
);

router.get("/", getAllBlogsController);
router.get("/:id", getBlogController);
router.patch(
  "/:id",
  protect,
  checkRole("admin", "moderator"),
  upload.single("blogImage"),
  editBlogController
);

export default router;
