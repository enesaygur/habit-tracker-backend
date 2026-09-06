import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import { loginLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me", authenticateToken, getMe);

export default router;
