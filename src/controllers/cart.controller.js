import cartService from "../services/cart.service.js";
import AppError from "../utils/appError.util.js";

// ADD TO CART
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return next(new AppError("Product ID and quantity are required", 400));
    }

    const cart = await cartService.addToCart(req.user._id, productId, quantity);

    if (!cart) {
      return next(new AppError("Cart update failed. Please try again.", 500));
    }

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// GET CART
const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);

    res.status(200).json({
      status: "success",
      data: { cart: cart || { items: [] } },
    });
  } catch (error) {
    next(error);
  }
};

// CHECKOUT
const checkout = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return next(new AppError("Shipping address is required", 400));
    }

    const order = await cartService.checkout(req.user._id, shippingAddress);

    if (!order) {
      return next(
        new AppError(
          "No se pudo completar la compra. El carrito podría estar vacío o faltan datos.",
          400
        )
      );
    }

    res.status(201).json({
      status: "success",
      message: "Purchase successful",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export { addToCart, getCart, checkout };
