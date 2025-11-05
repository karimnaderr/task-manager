import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";

type AddFormProps = {
  onTaskAdded: () => void;
};

const AddForm = ({ onTaskAdded }: AddFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addTask } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      await addTask(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      onTaskAdded();
    } catch (err: any) {
      console.error("Error adding task:", err);
      alert(err?.response?.data?.message || "Failed to add task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <div className="mb-3">
        <input
          placeholder="Task Title"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div className="mb-3">
        <textarea
          placeholder="Task Description (optional)"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={submitting}
        />
      </div>
      <button
        className="btn btn-success"
        type="submit"
        disabled={submitting || !title.trim()}
      >
        {submitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default AddForm;