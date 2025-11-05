import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number; // ✅ numeric to match Prisma
  title: string;
  description: string;
  completed: boolean;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  // ✅ Fetch tasks and user info on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Fetch user info (optional if backend provides it)
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

      // Update local state instantly
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task:", err);
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
              <div>
                <strong
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </strong>
                <p className="mb-0 text-muted">{task.description}</p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-sm ${
                    task.completed ? "btn-secondary" : "btn-primary"
                  }`}
                  onClick={() => toggleComplete(task.id)}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
