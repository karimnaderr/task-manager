import { useState } from "react";
import type { Task } from "../../types";
import TaskItem from "./TaskItem";
import axiosClient from "../../api/axiosClient";

type TaskListProps = {
  tasks: Task[];
  onTaskUpdate: () => void;
};

const TaskList = ({ tasks, onTaskUpdate }: TaskListProps) => {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleSave = async (id: number) => {
    try {
      setSavingId(id);
      await axiosClient.patch(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      cancelEditing();
      onTaskUpdate();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save task");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      await axiosClient.delete(`/tasks/${id}`);
      onTaskUpdate();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete task");
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await axiosClient.patch(`/tasks/${id}/complete`, {});
      onTaskUpdate();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update task");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="mt-4 text-center">
        <div className="card">
          <div className="card-body">
            <p className="card-text text-muted mb-0">
              No tasks yet. Create your first task above!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="row g-4">
            {tasks.map((task) => (
              <div key={task.id} className="col-12 col-md-6 col-lg-4">
                <TaskItem
                  task={task}
                  isEditing={editingTaskId === task.id}
                  editTitle={editTitle}
                  editDescription={editDescription}
                  saving={savingId === task.id}
                  onEditTitleChange={setEditTitle}
                  onEditDescriptionChange={setEditDescription}
                  onSave={() => handleSave(task.id)}
                  onCancel={cancelEditing}
                  onToggleComplete={() => handleToggleComplete(task.id)}
                  onStartEdit={() => startEditing(task)}
                  onDelete={() => handleDelete(task.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
