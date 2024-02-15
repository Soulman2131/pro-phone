import moment from "moment";
import colors from "colors";
export const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }: ${moment().format()}`.yellow.inverse
  );

  next();
};
