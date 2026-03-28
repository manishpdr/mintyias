import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks/hook';
import type { RootState } from '../state/store/store';
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  FamilyTask,
  filterTasksByStatus,
} from '../state/features/tasks/taskSlice';
import TaskForm from '../components/forms/TaskForm';
import TaskCard from '../components/TaskCard';

type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state: RootState) => state.tasks);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<FamilyTask | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');

  useEffect(() => {
    dispatch(fetchTasks() as any);
  }, [dispatch]);

  useEffect(() => {
    if (statusFilter !== 'All') {
      dispatch(filterTasksByStatus(statusFilter));
    }
  }, [statusFilter, dispatch]);

  const handleAddTask = async (taskData: Omit<FamilyTask, 'id' | 'createdDate'>) => {
    try {
      await dispatch(addTask(taskData) as any).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleUpdateTask = async (taskData: Omit<FamilyTask, 'id' | 'createdDate'>) => {
    try {
      if (editingTask) {
        await dispatch(updateTask({ ...editingTask, ...taskData } as any)).unwrap();
        setEditingTask(null);
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id) as any).unwrap();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const filteredTasks =
    statusFilter === 'All'
      ? tasks
      : tasks.filter((t: any) => t.status === statusFilter);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return '#2ecc71';
      case 'In Progress':
        return '#3498db';
      case 'Pending':
        return '#f39c12';
      case 'Cancelled':
        return '#95a5a6';
      default:
        return '#34495e';
    }
  };

  const groupedByStatus = {
    Pending: tasks.filter((t: any) => t.status === 'Pending'),
    'In Progress': tasks.filter((t: any) => t.status === 'In Progress'),
    Completed: tasks.filter((t: any) => t.status === 'Completed'),
    Cancelled: tasks.filter((t: any) => t.status === 'Cancelled'),
  };

  return (
    <div className="tasks-container">
      <div className="page-header">
        <h1>Family Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editingTask && (
        <div className="form-container">
          <h2>Edit Task</h2>
          <TaskForm
            initialData={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        </div>
      )}

      <div className="filter-section">
        <label>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="All">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="tasks-board">
          {Object.entries(groupedByStatus).map(([status, statusTasks]) => (
            <div
              key={status}
              className="task-column"
              style={{ borderTopColor: getStatusColor(status as TaskStatus) }}
            >
              <h3>{status}</h3>
              <p className="task-count">{statusTasks.length} tasks</p>
              <div className="tasks-column-content">
                {statusTasks.length > 0 ? (
                  statusTasks.map((task: FamilyTask) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => setEditingTask(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                      onStatusChange={(newStatus: string) =>
                        handleUpdateTask({ ...task, status: newStatus as TaskStatus })
                      }
                    />
                  ))
                ) : (
                  <p className="no-tasks">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
