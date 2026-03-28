import React from 'react';
import { FamilyTask } from '../state/features/tasks/taskSlice';

interface TaskCardProps {
  task: FamilyTask;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled') => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#e74c3c';
      case 'Medium':
        return '#f39c12';
      case 'Low':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className="priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
          {task.priority}
        </span>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-details">
        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        <p>Status: {task.status}</p>
      </div>
      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as any)}
          className="status-select"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button className="btn btn-sm btn-primary" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
