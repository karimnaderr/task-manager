import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const navigate = useNavigate();

  // ✅ Fetch tasks and user info on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Fetch user info
    axiosClient
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUserName(res.data.name))
      .catch(() => {});

    // Fetch tasks
    axiosClient
      .get("/tasks", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [navigate]);

  // ✅ Add new task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axiosClient.post(
        "/tasks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // ✅ Delete task
  const deleteTask = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axiosClient.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ✅ Toggle complete
  const toggleComplete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axiosClient.patch(
        `/tasks/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // ✅ Start / Cancel Editing
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

  // ✅ Save Edited Task
  const saveEdit = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found when saving task");
      return;
    }
  
    try {
      setSavingId(id);
      console.log("Saving edit for task", id, { title: editTitle, description: editDescription });
  
      const res = await axiosClient.patch(
        `/tasks/${id}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Save response:", res.status, res.data);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      cancelEditing();
    } catch (err: any) {
      // Show useful info
      console.error("Error updating task:", err?.response?.status, err?.response?.data || err.message);
      // Optional: show an alert to user
      alert(err?.response?.data?.message || "Failed to save task");
    } finally {
      setSavingId(null);
    }
  };
  

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {userName || "User"} 👋</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} style={{ maxWidth: 500 }}>
        <input
          placeholder="Title"
          className="form-control mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="form-control mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-success" type="submit">
          Add Task
        </button>
      </form>

      {/* Task List */}
      <ul className="list-group mt-4">
        {tasks.length === 0 ? (
          <li className="list-group-item text-center text-muted">
            No tasks yet.
          </li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div style={{ flex: 1 }}>
                {editingTaskId === task.id ? (
                  <>
                    <input
                      className="form-control mb-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <strong
                      style={{
                        textDecoration: task.completed ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </strong>
                    <p className="mb-0 text-muted">{task.description}</p>
                  </>
                )}
              </div>

              <div className="d-flex gap-2">
                {editingTaskId === task.id ? (
                    <>
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => saveEdit(task.id)}
                            disabled={savingId === task.id}
                        >
                            {savingId === task.id ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEditing}
                            disabled={savingId === task.id}
                        >
                            Cancel
                        </button>
                        </>
                        ) : (
                    <>
                    <button
                      className={`btn btn-sm ${
                        task.completed ? "btn-secondary" : "btn-primary"
                      }`}
                      onClick={() => toggleComplete(task.id)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => startEditing(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
