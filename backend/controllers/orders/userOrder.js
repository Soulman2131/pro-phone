import asyncHandler from "../../middleware/asyncHandler.js";
import { OrderModel } from "../../models/Order.js";

// CREATE ORDER  => /api/orders
const addOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Vous n'avez pas de commande");
  } else {
    // On crée order en fonction de orderItems contenu dans le Model😋😍
    const order = new OrderModel({
      orderItems: orderItems.map((x) => ({
        ...x,
        //product vient du model Order
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createOrder = await order.save(); //😍
    res.status(201).json(createOrder);
  }
});

// GET MY ORDERS => /api/orders/mine
const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await OrderModel.find({ user: req.user._id });
  res.status(200).json(orders);
});

// GET ORDER BY ID  =>  /api/orders/:id
const getMyOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Commande introuvable");
  }
});

// UPDATE ORDER (represents in FRONT payORDER) PUT => /api/orders/:id/pay
const updateOrder = asyncHandler(async (req, res, next) => {
  //
  const order = await OrderModel.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updateOrder = await order.save();
    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("La commande est introuvable");
  }
});

export { addOrder, getMyOrders, getMyOrder, updateOrder };
