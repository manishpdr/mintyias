import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';

export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  category: string; // 'Groceries', 'Utilities', 'Entertainment', 'Healthcare', 'Other'
  paidBy: number; // Member ID
  date: string;
  createdDate: string;
  splitAmong?: number[]; // Member IDs
  attachments?: string[];
}

export interface Budget {
  id: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string; // YYYY-MM
  createdDate: string;
}

interface BudgetState {
  expenses: Expense[];
  budgets: Budget[];
  filteredExpenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  expenses: [],
  budgets: [],
  filteredExpenses: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchExpenses = createAsyncThunk('budget/fetchExpenses', async () => {
  const res = await apiClient.get<Expense[]>('/Budget/GetExpenses');
  return res.data;
});

export const fetchBudgets = createAsyncThunk('budget/fetchBudgets', async () => {
  const res = await apiClient.get<Budget[]>('/Budget/GetBudgets');
  return res.data;
});

export const addExpense = createAsyncThunk(
  'budget/addExpense',
  async (expense: Omit<Expense, 'id' | 'createdDate'>) => {
    const res = await apiClient.post<Expense>('/Budget/CreateExpense', expense);
    return res.data;
  }
);

export const updateExpense = createAsyncThunk(
  'budget/updateExpense',
  async (expense: Expense) => {
    const res = await apiClient.put<Expense>(`/Budget/UpdateExpense/${expense.id}`, expense);
    return res.data;
  }
);

export const deleteExpense = createAsyncThunk(
  'budget/deleteExpense',
  async (id: number) => {
    await apiClient.delete(`/Budget/DeleteExpense/${id}`);
    return id;
  }
);

export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (budget: Omit<Budget, 'id' | 'createdDate' | 'spentAmount'>) => {
    const res = await apiClient.post<Budget>('/Budget/CreateBudget', budget);
    return res.data;
  }
);

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async (budget: Budget) => {
    const res = await apiClient.put<Budget>(`/Budget/UpdateBudget/${budget.id}`, budget);
    return res.data;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    filterExpensesByCategory: (state, action) => {
      const category = action.payload;
      state.filteredExpenses = state.expenses.filter((e) => e.category === category);
    },
    filterExpensesByMonth: (state, action) => {
      const month = action.payload;
      state.filteredExpenses = state.expenses.filter((e) => e.date.startsWith(month));
    },
    clearExpenseFilters: (state) => {
      state.filteredExpenses = state.expenses;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
        state.filteredExpenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      // Add expense
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
        state.filteredExpenses = state.expenses;
      })
      // Update expense
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
          state.filteredExpenses = state.expenses;
        }
      })
      // Delete expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
        state.filteredExpenses = state.expenses;
      })
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      // Create budget
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      })
      // Update budget
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      });
  },
});

export const { filterExpensesByCategory, filterExpensesByMonth, clearExpenseFilters } =
  budgetSlice.actions;
export default budgetSlice.reducer;
