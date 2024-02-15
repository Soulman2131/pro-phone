import mongoose from "mongoose";
import colors from "colors";
import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";

// Les Models
import { OrderModel } from "./models/Order.js";
import { ProductModel } from "./models/Product.js";
import { UserModel } from "./models/User.js";
import users from "./data/users.js";
import products from "./data/products.js";

// Mongo && Port
connectDB();

// IMPORTDATA
const importData = async () => {
  try {
    //
    await ProductModel.deleteMany();
    await UserModel.deleteMany();
    await OrderModel.deleteMany();

    const createdUsers = await UserModel.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    //
    await ProductModel.insertMany(sampleProducts);
    console.log("Base de donnée importée...!".bgCyan.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// DESTROY DATA
const destroyData = async () => {
  try {
    //
    await ProductModel.deleteMany();
    await UserModel.deleteMany();
    await OrderModel.deleteMany();

    console.log("Base de donnée détruite...!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// CONCLUSION
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

// 😍😊 npm run data:import or npm run data:destroy
