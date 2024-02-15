// Methode Traversy pour le Bcrypt && JwT
// On enléve le TOKEN et le SET JWT pour le mettre dans le dossier UTILS

import asyncHandler from "express-async-handler";

import { UserModel } from "../../models/User.js";
import { generateToken } from "../../Utils/generatetok.js";

//LOGIN
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // Token function
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Email ou mot de passe incorrect");
  }
});

// REGISTER
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("L'utilisateur existe !");
  }

  const user = await UserModel.create({
    name,
    email,
    password,
  });

  if (user) {
    // Token
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      //Pas besoin du password ici
    });
  } else {
    res.status(400);
    throw new Error("L'utilisateur n'existe pas !");
  }
});

// LOGOUT
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "loggedout", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Vous vous êtes déconnecté !" });
});

export { login, logout, register };
