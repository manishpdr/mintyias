import React from 'react';
import { Budget } from '../state/features/budget/budgetSlice';

interface BudgetCardProps {
  budget: Budget;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  const percentageUsed = (budget.spentAmount / budget.budgetAmount) * 100;
  const remaining = budget.budgetAmount - budget.spentAmount;
  const isOverBudget = percentageUsed > 100;

  return (
    <div className="budget-card">
      <div className="budget-header">
        <h3>{budget.category}</h3>
        <span className={`status ${isOverBudget ? 'over' : 'ok'}`}>
          {isOverBudget ? 'Over Budget' : 'On Track'}
        </span>
      </div>
      <div className="budget-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(percentageUsed, 100)}%`,
              backgroundColor: isOverBudget ? '#e74c3c' : '#2ecc71',
            }}
          />
        </div>
        <p>{percentageUsed.toFixed(1)}% used</p>
      </div>
      <div className="budget-details">
        <div className="detail-row">
          <span>Budget:</span>
          <span>${budget.budgetAmount.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span>Spent:</span>
          <span>${budget.spentAmount.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span>Remaining:</span>
          <span style={{ color: isOverBudget ? '#e74c3c' : '#2ecc71' }}>
            ${Math.abs(remaining).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
