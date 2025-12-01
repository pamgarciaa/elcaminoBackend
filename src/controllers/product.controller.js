import productService from "../services/product.service.js";
import fs from "fs-extra";
import AppError from "../utils/appError.util.js";

// CREATE PRODUCT
const createProductController = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!req.file) {
      return next(new AppError("Image is required", 400));
    }

    const productData = {
      name,
      description,
      price,
      stock,
      category,
      image: req.file.filename,
      createdBy: req.user._id,
    };

    const newProduct = await productService.createProduct(productData);

    res.status(201).json({
      status: "success",
      data: { product: newProduct },
    });
  } catch (error) {
    if (req.file) await fs.remove(req.file.path);
    next(error);
  }
};

// GET ALL PRODUCTS
const getAllProductsController = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PRODUCT
const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newImage = req.file ? req.file.filename : undefined;

    const updated = await productService.updateProduct(id, req.body, newImage);

    res.status(200).json({
      status: "success",
      data: { product: updated },
    });
  } catch (error) {
    if (req.file) await fs.remove(req.file.path);
    next(error);
  }
};

// DELETE PRODUCT
const deleteProductController = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
};
