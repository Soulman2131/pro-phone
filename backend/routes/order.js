import express from "express";
import {
  addOrder,
  getMyOrder,
  getMyOrders,
  updateOrder,
} from "../controllers/orders/userOrder.js";
import { admin, protect } from "../middleware/authMidl.js";
import {
  getOrders,
  updateOrderToDelivered,
} from "../controllers/orders/adminOrder.js";

const router = express.Router();

// Bien proteger les routes avec PROTECT sinon incidence au FRONTEND 😍😎

router.route("/").post(protect, addOrder).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getMyOrder);
router.route("/:id/pay").put(protect, updateOrder);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export { router as orderRouter };
