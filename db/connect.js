import mongoose from "mongoose";
import mongooose from "mongoose";

const connectDb = (connectionString) => {
  return mongoose.connect(connectionString);
};

export default connectDb;
