import orderService from "../services/order.service.js";

const getMyOrdersController = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrdersController = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export { getMyOrdersController, getAllOrdersController };
