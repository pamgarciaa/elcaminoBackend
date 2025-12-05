import productService from "../services/product.service.js";
import fs from "fs-extra";
import AppError from "../utils/appError.util.js";

// CREATE PRODUCT
const createProductController = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      features,
      level,
      isDigital,
    } = req.body;

    if (!req.file) {
      return next(new AppError("Image is required", 400));
    }

    let parsedFeatures = features;
    if (typeof features === "string") {
      parsedFeatures = features.split(",").map((f) => f.trim());
    }

    const productData = {
      name,
      description,
      price,
      stock,
      category,
      features: parsedFeatures || [],
      level: level ? Number(level) : undefined,
      isDigital: isDigital === "true" || isDigital === true,
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
    const filter = { category: { $ne: "kit" } };
    const products = await productService.getAllProducts(filter);

    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL KITS (Solo trae kits, ordenados por nivel)
const getAllKitsController = async (req, res, next) => {
  try {
    const filter = { category: "kit" };
    const kits = await productService.getAllProducts(filter);

    kits.sort((a, b) => a.level - b.level);

    res.status(200).json({
      status: "success",
      results: kits.length,
      data: { kits },
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
  getAllKitsController,
  updateProductController,
  deleteProductController,
};
