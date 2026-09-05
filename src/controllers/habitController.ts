import { NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "./../middleware/authMiddleware";
import { AppError } from "./../middleware/errorHandler";
import { calculateStreak } from './../utils/streak';
const prisma = new PrismaClient();

export const createHabit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new AppError("Name is required", 400);
    }

    const habit = await prisma.habit.create({
      data: {
        name,
        userId: req.userId as number,
      },
    });

    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

export const getHabits = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(habits);
  } catch (error) {
    next(error);
  }
};

export const updateHabit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const habit = await prisma.habit.findUnique({ where: { id: Number(id) } });

    if (!habit) {
      throw new AppError("Habit not found", 404);
    }

    if (habit.userId !== req.userId) {
      throw new AppError("Not allowed", 403);
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.status(200).json(updatedHabit);
  } catch (error) {
    next(error);
  }
};

export const deleteHabit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const habit = await prisma.habit.findUnique({
      where: { id: Number(id) },
    });

    if (!habit) {
      throw new AppError("Habit not found", 404);
    }

    if (habit.userId !== req.userId) {
      throw new AppError("Not allowed", 403);
    }

    await prisma.habit.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const markHabitDone = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const habit = await prisma.habit.findUnique({
      where: { id: Number(id) },
    });

    if (!habit) {
      throw new AppError("Habit not found", 404);
    }

    if (habit.userId !== req.userId) {
      throw new AppError("Not allowed", 403);
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
      return next(new AppError("Habit already done today", 409));
    }
    next(error);
  }
};

export const getHabitStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const habit = await prisma.habit.findUnique({
      where: { id: Number(id) },
    });

    if (!habit) {
      throw new AppError("Habit not found", 404);
    }

    if (habit.userId !== req.userId) {
      throw new AppError("Not allowed", 403);
    }

    const sevenDayAgo = new Date();
    sevenDayAgo.setDate(sevenDayAgo.getDate() - 7);
    sevenDayAgo.setHours(0, 0, 0, 0);

    const logs = await prisma.habitlog.findMany({
      where: {
        habitId: Number(id),
        date: {
          gte: sevenDayAgo,
        },
      },
      orderBy: { date: "desc" },
    });

    const streak = calculateStreak(logs.map((log) => log.date));
    res.status(200).json({
      completedThisWeek: logs.length,
      totalDaysTracked: 7,
      currentStreak: streak,
    });
  } catch (error) {
    next(error);
  }
};
