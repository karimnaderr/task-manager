import { Request, Response } from "express";
import * as taskService from "../services/taskService";

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

export const getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tasks = await taskService.getAllTasks(userId);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error fetching tasks" });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description } = req.body;
    const task = await taskService.createTask(userId, title, description);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error creating task" });
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = Number(req.params.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const task = await taskService.getTaskById(userId, taskId);
    res.status(200).json(task);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = Number(req.params.id);
    const { title, description } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updatedTask = await taskService.updateTask(userId, taskId, title, description);
    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = Number(req.params.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await taskService.deleteTask(userId, taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const toggleCompleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = Number(req.params.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updatedTask = await taskService.toggleCompleteTask(userId, taskId);
    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
