// On aura le protect des routes et celui du ADMIN

import asyncHandler from "express-async-handler";
import { UserModel } from "../models/User.js";
import jwt from "jsonwebtoken";

// Protect Routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the COOKIE puisque je l'ai appelé "jwt" dans le ctrl de Auth
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // await UserModel.findById(decoded.userId).select('-password')
      req.user = await UserModel.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error(
        "Vous n'êtes pas authorisé. Votre TOKEN n'est pas reconnu"
      );
    }
  } else {
    res.status(401);
    throw new Error("Vous n'êtes pas authorisé sans votre TOKEN");
  }
});

// ADMIN
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Que l'Admin est autorisé");
  }
};

export { protect, admin };
