import express from "express";
import { register, login, update } from "../controllers/authController.js";
import authenticateUserMiddleware from "../middleware/auth.js";
import rateLimiter from "express-rate-limit";

const router = express.Router();

// For each IP address requesting resources from our server
const apiRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 60, // 15 mins
  max: 10,
  message: "Rate limit reached. Please try again after 15 minutes.",
});

router.route("/register").post(apiRateLimiter, register);
router.route("/login").post(apiRateLimiter, login);
router.route("/update").patch(authenticateUserMiddleware, update);

export default router;
