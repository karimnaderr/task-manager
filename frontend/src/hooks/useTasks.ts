import { useState, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import type { Task } from "../types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/tasks");
      setTasks(res.data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch tasks";
      setError(errorMessage);
      console.error("Error fetching tasks:", err);
      // Log full error details for debugging
      console.error("Error details:", {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (title: string, description: string) => {
    try {
      setError(null);
      const res = await axiosClient.post("/tasks", { title, description });
      // Don't update local state here - let the parent refresh via onTaskAdded callback
      // This ensures we always have the latest data from the server
      return res.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to add task";
      setError(errorMessage);
      console.error("Error adding task:", err);
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setError(null);
      await axiosClient.delete(`/tasks/${id}`);
      // Don't update local state - let parent refresh
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to delete task";
      setError(errorMessage);
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      setError(null);
      const res = await axiosClient.patch(`/tasks/${id}/complete`, {});
      // Don't update local state - let parent refresh
      return res.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to update task";
      setError(errorMessage);
      console.error("Error toggling task:", err);
      throw err;
    }
  };

  const updateTask = async (id: number, title: string, description: string) => {
    try {
      setError(null);
      const res = await axiosClient.patch(`/tasks/${id}`, { title, description });
      // Don't update local state - let parent refresh
      return res.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to update task";
      setError(errorMessage);
      console.error("Error updating task:", err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
  };
};

