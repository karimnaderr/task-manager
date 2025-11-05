import { useEffect } from "react";
import Header from "../components/Header/Header";
import AddTaskButton from "../components/AddTaskButton/AddTaskButton";
import TaskList from "../components/TaskList/TaskList";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import ErrorState from "../components/ErrorState/ErrorState";

export default function Dashboard() {
  const { tasks, loading, error, fetchTasks } = useTasks();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!authLoading && token) {
      fetchTasks();
    }
  }, [authLoading]);

  const handleTaskUpdate = () => {
    fetchTasks();
  };

  if (authLoading || loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-5">
      <Header />

      {error && (
        <ErrorState error={error} />
      )}

      <AddTaskButton onTaskAdded={handleTaskUpdate} />

      <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} />
    </div>
  );
}
