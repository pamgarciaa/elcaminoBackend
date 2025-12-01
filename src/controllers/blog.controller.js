import blogService from "../services/blog.service.js";
import fs from "fs-extra";
import AppError from "../utils/appError.util.js";

// CREATE
const createBlogController = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!req.file) return next(new AppError("Please upload an image", 400));

    const blogData = {
      title,
      content,
      image: req.file.path,
      author: req.user.id,
    };

    const newBlog = await blogService.createBlog(blogData);

    res.status(201).json({ status: "success", data: { blog: newBlog } });
  } catch (error) {
    if (req.file) await fs.remove(req.file.path);
    next(error);
  }
};

// EDIT
const editBlogController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (content) updates.content = content;

    if (req.file) updates.image = req.file.path;

    const updatedBlog = await blogService.editBlog(id, updates);

    res.status(200).json({ status: "success", data: { blog: updatedBlog } });
  } catch (error) {
    if (req.file) await fs.remove(req.file.path);
    next(error);
  }
};

// DELETE
const deleteBlogController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await blogService.deleteBlog(id);

    if (blog.image) await fs.remove(blog.image);

    res
      .status(200)
      .json({ status: "success", message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET ONE
const getBlogController = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);

    res.status(200).json({ status: "success", data: { blog } });
  } catch (error) {
    next(error);
  }
};

// GET ALL
const getAllBlogsController = async (req, res, next) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res
      .status(200)
      .json({ status: "success", results: blogs.length, data: { blogs } });
  } catch (error) {
    next(error);
  }
};

export {
  createBlogController,
  editBlogController,
  deleteBlogController,
  getBlogController,
  getAllBlogsController,
};
