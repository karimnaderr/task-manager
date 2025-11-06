import prisma from "../prismaClient";
import { validateTask } from "../utils/validation";

export const getAllTasks = async (userId: number) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createTaskService = async (userId: number, title: string, description: string) => {
    const error = validateTask(title, description);
    if (error) throw new Error(error);
  
    const task = await prisma.task.create({
      data: { userId, title, description },
    });
  
    return task;
};

export const getTaskById = async (userId: number, taskId: number) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) throw new Error("Task not found");
  return task;
};

export const updateTask = async (
    userId: number,
    taskId: number,
    title?: string,
    description?: string
  ) => {
    await getTaskById(userId, taskId); 
  
    const error = validateTask(title ?? "", description ?? "");
    if (error) throw new Error(error);
  
    return prisma.task.update({
      where: { id: taskId },
      data: { title, description },
    });
  };
  

export const deleteTask = async (userId: number, taskId: number) => {
  await getTaskById(userId, taskId); 
  return prisma.task.delete({ where: { id: taskId } });
};

export const toggleCompleteTask = async (userId: number, taskId: number) => {
  const task = await getTaskById(userId, taskId);
  return prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });
};
