import { Request, Response } from "express";
import prisma from "../prismaClient";

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}


export const getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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


export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const userId = req.user?.id;
  
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
  
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });
  
      if (!task || task.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.status(200).json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Error fetching task" });
    }
  };
  
  export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const { title, description } = req.body;
      const userId = req.user?.id;
  
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
  
      const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
      if (!existingTask || existingTask.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { title, description },
      });
  
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Error updating task" });
    }
  };
  
  export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const userId = req.user?.id;
  
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
  
      const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
      if (!existingTask || existingTask.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      await prisma.task.delete({ where: { id: taskId } });
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Error deleting task" });
    }
  };
  
  export const toggleCompleteTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const userId = req.user?.id;
  
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
  
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      if (!task || task.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { completed: !task.completed },
      });
  
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error toggling task:", error);
      res.status(500).json({ message: "Error toggling task" });
    }
  };
