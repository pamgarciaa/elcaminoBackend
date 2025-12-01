import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import AppError from "../utils/appError.util.js";

// ADD TO CART
const addToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  return cart.populate("items.product");
};

// GET CART
const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

// CHECKOUT
const checkout = async (userId, shippingAddress) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty. Add products before checking out.", 400);
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    AppError.try(product, "A product in your cart could not be found.", 404);

    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for product: ${product.name}. Available: ${product.stock}`,
        400
      );
    }

    totalAmount += product.price * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    });

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress: shippingAddress || "Default Address",
    status: "paid",
  });

  cart.items = [];
  await cart.save();

  return order;
};

// REMOVE ITEM FROM CART
const removeItemFromCart = async (userId, productId) => {
  // Buscamos el carrito del usuario
  const cart = await Cart.findOne({ user: userId });

  // Si no hay carrito, lanzamos error (o devolvemos null, segun prefieras)
  AppError.try(cart, "Cart not found", 404);

  // Verificamos si el item existe antes de intentar borrarlo (Opcional, pero buena práctica)
  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId
  );
  if (!itemExists) {
    throw new AppError("Product not found in cart", 404);
  }

  // Usamos $pull para eliminar el objeto del array 'items' que coincida con el product ID
  // Esto es mucho más eficiente que filtrar el array en JS y guardar.
  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: productId } } },
    { new: true } // Devuelve el carrito actualizado
  ).populate("items.product");

  return updatedCart;
};

// Asegúrate de exportarlo
export default { addToCart, getCart, checkout, removeItemFromCart };
