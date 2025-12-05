import Product from "../models/product.model.js";
import fs from "fs-extra";
import AppError from "../utils/appError.util.js";

// CREATE PRODUCT
const createProduct = async (productData) => {
  return await Product.create(productData);
};

// GET ALL PRODUCTS
const getAllProducts = async (filter = {}) => {
  return await Product.find(filter);
};

// UPDATE PRODUCT
const updateProduct = async (id, updateData, newImageFilename) => {
  const product = await Product.findById(id);

  AppError.try(product, "Product not found", 404);

  if (newImageFilename) {
    if (product.image) {
      const oldPath = "uploads/" + product.image;
      if (await fs.pathExists(oldPath)) {
        await fs.remove(oldPath);
      }
    }
    updateData.image = newImageFilename;
  }

  Object.assign(product, updateData);
  await product.save();
  return product;
};

// DELETE PRODUCT
const deleteProduct = async (id) => {
  const product = await Product.findById(id);

  AppError.try(product, "Product not found", 404);

  if (product.image) {
    const imagePath = "uploads/" + product.image;
    if (await fs.pathExists(imagePath)) {
      await fs.remove(imagePath);
    }
  }

  await Product.findByIdAndDelete(id);
  return true;
};

export default { createProduct, getAllProducts, updateProduct, deleteProduct };
