import { Router } from "express";
import { login, register, getMe } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import { authRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/login", authRateLimiter, login);
router.post("/register", authRateLimiter, register);
router.get("/me", authenticateToken, getMe);

export default router;
