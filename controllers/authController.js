import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { AuthenticationError, BadRequestError } from "../errors/index.js";

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AuthenticationError("No user with this email exist");
  }

  const matchPassword = await user.comparePassword(password);
  if (!matchPassword) {
    throw new BadRequestError("Incorrect password. Please try again.");
  }

  const token = user.createJWT();
  // So that password is not passed to frontend
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
const update = (req, res) => {
  res.send("update");
};

export { register, login, update };
