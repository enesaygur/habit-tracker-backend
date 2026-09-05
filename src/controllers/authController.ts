import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";
import { JWT_SECRET } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { loginSchema, registerSchema } from "../schemas/authSchema";

const prisma = new PrismaClient();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400);
    }

    const { email, password } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400);
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "12h",
      },
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
