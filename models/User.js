import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    trim: true,
    minlength: [3, "Name should be of length greater than or equal to 3"],
    maxlength: [20, "Name should be of length less than or equal to 20"],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [20, "Last name should be of length less than or equal to 20"],
    default: "lastName",
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: [6, "Password should be of length greater than or equal to 3"],
    // This is used so that password is not returned whenever we query
    select: false,
  },
  location: {
    type: String,
    trim: true,
    default: "my city",
  },
});

UserSchema.pre("save", async function (next) {
  // If we are not modifying the password, we won't touch this function
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
