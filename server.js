import express from "express";
import "express-async-errors";
import connectDb from "./db/connect.js";
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send({ msg: "Hello" });
});
app.use("/api/v1", (req, res) => res.send({ msg: "Hello" }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
