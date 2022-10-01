import { readFile } from "fs/promises";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import Job from "./models/Job.js";
dotenv.config();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await Job.deleteMany();

    const jsonData = JSON.parse(
      await readFile(new URL("./mock-data.json", import.meta.url))
    );
    await Job.create(jsonData);
    console.log("Success!!!");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
