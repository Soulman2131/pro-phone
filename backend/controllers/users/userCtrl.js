import asyncHandler from "express-async-handler";
import { UserModel } from "../../models/User.js";

// GET USER PROFILE @api/users/profile
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("L'utilisateur n'existe pas");
  }
});

// UPDATE USER PROFILE
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("L'utilisateur n'existe pas");
  }
});

// ADMIN
// GET USERS api/users
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await UserModel.find({});
  res.status(200).json(users);
});

// GET USER api/users/:id
const getUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("L'utilisateur n'existe pas");
  }
});

// UPDATE USER api/users/:id
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("L'utilisateur n'existe pas");
  }
});

// DELETE USER api/users/:id
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("L'admin ne peut pas être supprimé");
    }

    await UserModel.deleteOne({ _id: user._id });
    res
      .status(200)
      .json({ message: "L'utilisateur a été supprimé avec succes" });
  } else {
    res.status(404);
    throw new Error("L'utilisateur n'existe pas");
  }
});

export {
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
