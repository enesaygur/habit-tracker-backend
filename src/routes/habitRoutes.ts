import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createHabit,
  deleteHabit,
  getHabits,
  markHabitDone,
  updateHabit,
} from "../controllers/habitController";

const router = Router();

router.post("/", authenticateToken, createHabit);
router.get("/", authenticateToken, getHabits);
router.put("/:id", authenticateToken, updateHabit);
router.delete("/:id", authenticateToken, deleteHabit);
router.post("/:id/log", authenticateToken, markHabitDone);

export default router;
