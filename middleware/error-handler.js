import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. Please try again later.",
  };

  // Handling mongoose validation errors
  if (err.name === "ValidationError") {
    defaultError.status = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  // Handling mongoose error for unique email
  if (err.code === 11000) {
    defaultError.status = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} already in use`;
  }

  res.status(defaultError.status).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
