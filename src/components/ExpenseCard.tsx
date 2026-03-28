import React from 'react';
import { Expense } from '../state/features/budget/budgetSlice';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="expense-card">
      <div className="expense-header">
        <div>
          <h4>{expense.title}</h4>
          <p className="category">{expense.category}</p>
        </div>
        <div className="amount">${expense.amount.toFixed(2)}</div>
      </div>
      {expense.description && <p className="description">{expense.description}</p>}
      <div className="expense-details">
        <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
      </div>
      <div className="expense-actions">
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

export default ExpenseCard;
