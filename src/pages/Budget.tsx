import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks/hook';
import type { RootState } from '../state/store/store';
import type { Expense, Budget as BudgetType } from '../state/features/budget/budgetSlice';
import {
  fetchExpenses,
  fetchBudgets,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../state/features/budget/budgetSlice';
import ExpenseForm from '../components/forms/ExpenseForm';
import BudgetForm from '../components/forms/BudgetForm';
import ExpenseCard from '../components/ExpenseCard';
import BudgetCard from '../components/BudgetCard';

const Budget: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses, budgets, loading, error } = useAppSelector((state: RootState) => state.budget);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [activeTab, setActiveTab] = useState<'expenses' | 'budgets'>('expenses');

  useEffect(() => {
    dispatch(fetchExpenses() as any);
    dispatch(fetchBudgets() as any);
  }, [dispatch]);

  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'createdDate'>) => {
    try {
      await dispatch(addExpense(expenseData) as any).unwrap();
      setShowExpenseForm(false);
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleUpdateExpense = async (expenseData: Expense) => {
    try {
      await dispatch(updateExpense(expenseData) as any).unwrap();
      setEditingExpense(null);
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await dispatch(deleteExpense(id) as any).unwrap();
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  };

  const monthExpenses = expenses.filter((e: any) => e.date.startsWith(selectedMonth));
  const totalExpenses = monthExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);

  const expensesByCategory = monthExpenses.reduce(
    (acc: Record<string, number>, expense: any) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const currentMonthBudgets = budgets.filter((b: any) => b.month === selectedMonth);

  return (
    <div className="budget-container">
      <div className="page-header">
        <h1>Family Budget & Expenses</h1>
        <div className="header-buttons">
          <button
            className="btn btn-primary"
            onClick={() => setShowExpenseForm(!showExpenseForm)}
          >
            {showExpenseForm ? 'Cancel' : 'Add Expense'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowBudgetForm(!showBudgetForm)}
          >
            {showBudgetForm ? 'Cancel' : 'Set Budget'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-section">
        <label>Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
        <button
          className={`tab ${activeTab === 'budgets' ? 'active' : ''}`}
          onClick={() => setActiveTab('budgets')}
        >
          Budgets
        </button>
      </div>

      {activeTab === 'expenses' && (
        <div className="expenses-section">
          {showExpenseForm && (
            <div className="form-container">
              <ExpenseForm
                onSubmit={handleAddExpense}
                onCancel={() => setShowExpenseForm(false)}
              />
            </div>
          )}

          {editingExpense && (
            <div className="form-container">
              <h2>Edit Expense</h2>
              <ExpenseForm
                initialData={editingExpense}
                onSubmit={(data) => handleUpdateExpense({ ...editingExpense, ...data })}
                onCancel={() => setEditingExpense(null)}
              />
            </div>
          )}

          <div className="expense-summary">
            <div className="summary-card">
              <h3>Total Spent</h3>
              <p className="amount">${totalExpenses.toFixed(2)}</p>
            </div>

            <div className="summary-card">
              <h3>Categories</h3>
              <div className="category-breakdown">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="category-item">
                    <span>{category}</span>
                    <span>${(amount as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading expenses...</div>
          ) : (
            <div className="expenses-list">
              {monthExpenses.length > 0 ? (
                monthExpenses.map((expense: any) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={() => setEditingExpense(expense)}
                    onDelete={() => handleDeleteExpense(expense.id)}
                  />
                ))
              ) : (
                <div className="no-data">No expenses for this month</div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'budgets' && (
        <div className="budgets-section">
          {showBudgetForm && (
            <div className="form-container">
              <BudgetForm
                month={selectedMonth}
                onSubmit={(budgetData: any) => {
                  console.log('Budget created:', budgetData);
                  setShowBudgetForm(false);
                }}
                onCancel={() => setShowBudgetForm(false)}
              />
            </div>
          )}

          {loading ? (
            <div className="loading">Loading budgets...</div>
          ) : (
            <div className="budgets-grid">
              {currentMonthBudgets.length > 0 ? (
                currentMonthBudgets.map((budget: any) => (
                  <BudgetCard key={budget.id} budget={budget} />
                ))
              ) : (
                <div className="no-data">No budgets set for this month</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Budget;
