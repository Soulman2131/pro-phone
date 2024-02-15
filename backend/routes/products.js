import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getTopProducts,
  updateProduct,
} from "../controllers/products/productCtrl.js";
import { admin, protect } from "../middleware/authMidl.js";
import { createReview } from "../controllers/products/reviewsCtrl.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// reviews
router.route("/:id/reviews").post(protect, createReview);

// Top products
// router.route("/top").get(getTopProducts);
router.get("/top", getTopProducts);

export { router as productRouter };
