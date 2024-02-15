import express from "express";
import { login, logout, register } from "../controllers/users/authCtrl.js";
import {
  deleteUser,
  getUser,
  getUserProfile,
  updateUser,
  updateUserProfile,
} from "../controllers/users/userCtrl.js";
import { admin, protect } from "../middleware/authMidl.js";

const router = express.Router();
// AUTH
router.post("/login", login);
router.post("/logout", logout);
router.route("/").post(register);

// USERS
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
// Admin
router
  .route("/:id")
  .get(protect, admin, getUser)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// A essayer
// router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

export { router as userRouter };
