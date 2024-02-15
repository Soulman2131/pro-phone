import express from "express";
import cookieParser from "cookie-parser";
import colors from "colors";
import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();

import { logger } from "./middleware/logger.js";
import { connectDB } from "./config/db.js";

import { productRouter } from "./routes/products.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { userRouter } from "./routes/user.js";
import { orderRouter } from "./routes/order.js";
import { uploadRouter } from "./routes/uploads.js";
import path from "path";

// Mongo && Port
const PORT = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cookieParser());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Trav a mis true

// ROUTER
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/uploads", uploadRouter);

// 😍😎 PayPal
app.use("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Upload Image
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ERRORHANDLER
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(
    `App listening on mode ${process.env.NODE_ENV} in port ${PORT}`.green
      .inverse
  )
);
