import { useState } from "react";
import AddForm from "../AddTask/AddForm";

type TProps = {
    onTaskAdded: () => void;
}

const AddTaskButton = ({onTaskAdded}: TProps) => {
    const [showAddForm, setShowAddForm] = useState(false);
    return (
        <>
        {!showAddForm ? (<div className="mb-4">
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary">Add Task</button>
        </div>) :  (<div className="mb-4">
            <button onClick={() => setShowAddForm(false)} className="btn btn-primary">Cancel</button>
        </div>)}
        
    {showAddForm && <AddForm onTaskAdded={onTaskAdded} />}
  </>
)}


export default AddTaskButton;