import mongoose, { mongo } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, "Please provide the position for the job"],
      trim: true,
      minlength: [3, "Position should be of length greater than or equal to 3"],
      maxlength: [50, "Position name too long"],
    },
    company: {
      type: String,
      trim: true,
      required: [true, "Please provide company name"],
      maxlength: [100, "Company name too long"],
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    jobType: {
      type: String,
      required: [true, "Please provide email"],
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "my city",
      required: [true, "Please provide job location"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User not defined"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
