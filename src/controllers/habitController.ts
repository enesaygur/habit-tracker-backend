import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "./../middleware/authMiddleware";

const prisma = new PrismaClient();

export const createHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const habit = await prisma.habit.create({
      data: {
        name,
        userId: req.userId as number,
      },
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getHabits = async (req: AuthRequest, res: Response) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const habit = await prisma.habit.findUnique({ where: { id: Number(id) } });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    if (habit.userId !== req.userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updateHabit = await prisma.habit.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.status(200).json(updateHabit);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const habit = await prisma.habit.findUnique({
      where: { id: Number(id) },
    });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    if (habit.userId !== req.userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await prisma.habit.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const markHabitDone = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const habit = await prisma.habit.findUnique({
      where: { id: Number(id) },
    });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    if (habit.userId !== req.userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await prisma.habitlog.create({
      data: {
        habitId: Number(id),
        date: today,
      },
    });
    res.status(201).json(log);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Habit already marked as done today" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};
