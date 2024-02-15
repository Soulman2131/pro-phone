import asyncHandler from "../../middleware/asyncHandler.js";
import { OrderModel } from "../../models/Order.js";

// GET ALL /api/orders
const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await OrderModel.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

// UPDATE ORDER TO DELIVERED put => /api/orders/:id/deliver
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("La commande est introuvable");
  }
});

export { getOrders, updateOrderToDelivered };
