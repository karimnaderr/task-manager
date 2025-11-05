import type { Task } from "../../types";

type TaskItemProps = {
  task: Task;
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  saving: boolean;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleComplete: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
};

const TaskItem = ({
  task,
  isEditing,
  editTitle,
  editDescription,
  saving,
  onEditTitleChange,
  onEditDescriptionChange,
  onSave,
  onCancel,
  onToggleComplete,
  onStartEdit,
  onDelete,
}: TaskItemProps) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        {isEditing ? (
          <>
            <div className="mb-3">
              <input
                className="form-control"
                value={editTitle}
                onChange={(e) => onEditTitleChange(e.target.value)}
                disabled={saving}
                placeholder="Task Title"
              />
            </div>
            <div className="mb-3 flex-grow-1">
              <textarea
                className="form-control"
                value={editDescription}
                onChange={(e) => onEditDescriptionChange(e.target.value)}
                disabled={saving}
                placeholder="Task Description"
                rows={4}
                style={{ resize: "none" }}
              />
            </div>
            <div className="d-flex gap-2 mt-auto">
              <button
                type="button"
                className="btn btn-success btn-sm flex-fill"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm flex-fill"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 flex-grow-1">
              <h5
                className="card-title mb-2"
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#6c757d" : "inherit",
                }}
              >
                {task.title}
              </h5>
              {task.description && (
                <p className="card-text text-muted mb-0" style={{ minHeight: "3rem" }}>
                  {task.description}
                </p>
              )}
            </div>
            <div className="mt-auto">
              {task.completed && (
                <span className="badge bg-success mb-2">Completed</span>
              )}
              <div className="d-flex flex-column gap-2">
                <button
                  className={`btn btn-sm ${
                    task.completed ? "btn-secondary" : "btn-primary"
                  }`}
                  onClick={onToggleComplete}
                >
                  {task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm flex-fill"
                    onClick={onStartEdit}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm flex-fill"
                    onClick={onDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;

