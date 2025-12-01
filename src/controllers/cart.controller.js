import cartService from "../services/cart.service.js";
import AppError from "../utils/appError.util.js";

// ADD TO CART
const addToCartController = async (req, res, next) => {
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
const getCartController = async (req, res, next) => {
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
const checkoutController = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return next(new AppError("Shipping address is required", 400));
    }

    const order = await cartService.checkout(req.user._id, shippingAddress);

    if (!order) {
      return next(new AppError("Purchase failed. Please try again.", 400));
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

// DELETE ITEM FROM CART
const deleteItemFromCartController = async (req, res, next) => {
  try {
    // CORRECCIÓN: Usamos req.params porque la ruta es /:productId
    const { productId } = req.params;

    // Verificamos que venga el ID
    if (!productId) {
      return next(new AppError("Product ID is required", 400));
    }

    const cart = await cartService.removeItemFromCart(req.user._id, productId);

    res.status(200).json({
      status: "success",
      message: "Item removed from cart",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export {
  addToCartController,
  getCartController,
  checkoutController,
  deleteItemFromCartController,
};
