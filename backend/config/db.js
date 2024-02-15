import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_URI}@cluster0.znwxl.mongodb.net/mern_trav?retryWrites=true&w=majority`
    )
    .then(() => console.log("Connecté à Mongo...".bgMagenta))
    .catch(() => console.error("Pas connecté à Mongo...".bgRed));
};
