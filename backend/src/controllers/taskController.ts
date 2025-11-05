import { Request, Response } from "express";
import prisma from "../prismaClient";


export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};


export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = (req as any).user?.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: { title, description, userId },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};
