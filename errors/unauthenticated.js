import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./CustomAPIError.js";

class AuthenticationError extends CustomAPIError {
  constructor(message) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

export default AuthenticationError;
