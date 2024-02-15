const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Si on met const ça ne marchera pas mais let
  // On définit statusCode && message
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // If it is a bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = `Resource not found `;
    statusCode = 404;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? "😃😌" : err.stack,
  });
};

export { notFound, errorHandler };
