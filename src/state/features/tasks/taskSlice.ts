import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';

export interface FamilyTask {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedTo: number; // Member ID
  assignedBy: number;
  createdDate: string;
  completedDate?: string;
  category?: string;
}

interface TaskState {
  tasks: FamilyTask[];
  filteredTasks: FamilyTask[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  const res = await apiClient.get<FamilyTask[]>('/Tasks/GetAll');
  return res.data;
});

export const addTask = createAsyncThunk(
  'tasks/add',
  async (task: Omit<FamilyTask, 'id' | 'createdDate'>) => {
    const res = await apiClient.post<FamilyTask>('/Tasks/Create', task);
    return res.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (task: FamilyTask) => {
    const res = await apiClient.put<FamilyTask>(`/Tasks/Update/${task.id}`, task);
    return res.data;
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id: number) => {
  await apiClient.delete(`/Tasks/Delete/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    filterTasksByStatus: (state, action) => {
      const status = action.payload;
      state.filteredTasks = state.tasks.filter((t) => t.status === status);
    },
    filterTasksByPriority: (state, action) => {
      const priority = action.payload;
      state.filteredTasks = state.tasks.filter((t) => t.priority === priority);
    },
    filterTasksByAssignee: (state, action) => {
      const memberId = action.payload;
      state.filteredTasks = state.tasks.filter((t) => t.assignedTo === memberId);
    },
    clearTaskFilters: (state) => {
      state.filteredTasks = state.tasks;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.filteredTasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Add task
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.filteredTasks = state.tasks;
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          state.filteredTasks = state.tasks;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.filteredTasks = state.tasks;
      });
  },
});

export const { filterTasksByStatus, filterTasksByPriority, filterTasksByAssignee, clearTaskFilters } =
  taskSlice.actions;
export default taskSlice.reducer;
