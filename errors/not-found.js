import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./CustomAPIError.js";

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export default NotFoundError;
