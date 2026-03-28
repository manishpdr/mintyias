import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks/hook';
import type { RootState } from '../state/store/store';
import {
  fetchFamilyMembers,
  getCurrentFamily,
} from '../state/features/family/familySlice';
import { fetchEvents } from '../state/features/events/eventSlice';
import { fetchTasks } from '../state/features/tasks/taskSlice';
import { fetchExpenses, fetchBudgets } from '../state/features/budget/budgetSlice';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([]);

  const { members, currentFamily } = useAppSelector((state: RootState) => state.family);
  const { events } = useAppSelector((state: RootState) => state.events);
  const { tasks } = useAppSelector((state: RootState) => state.tasks);
  const { expenses } = useAppSelector((state: RootState) => state.budget);

  useEffect(() => {
    dispatch(fetchFamilyMembers() as any);
    dispatch(getCurrentFamily() as any);
    dispatch(fetchEvents() as any);
    dispatch(fetchTasks() as any);
    dispatch(fetchExpenses() as any);
    dispatch(fetchBudgets() as any);
  }, [dispatch]);

  useEffect(() => {
    const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    const completedTasks = tasks.filter((t: any) => t.status === 'Completed').length;
    const upcomingEvents = events.filter((e: any) => new Date(e.eventDate) >= new Date())
      .length;

    setDashboardCards([
      {
        title: 'Family Members',
        value: members.length,
        icon: '👥',
        color: '#3498db',
      },
      {
        title: 'Total Expenses',
        value: `$${totalExpenses.toFixed(2)}`,
        icon: '💰',
        color: '#e74c3c',
      },
      {
        title: 'Completed Tasks',
        value: completedTasks,
        icon: '✅',
        color: '#2ecc71',
      },
      {
        title: 'Upcoming Events',
        value: upcomingEvents,
        icon: '📅',
        color: '#f39c12',
      },
    ]);
  }, [members, expenses, tasks, events]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Family Dashboard</h1>
        {currentFamily && <p className="family-name">{currentFamily.name}</p>}
      </div>

      <div className="dashboard-grid">
        {dashboardCards.map((card, index) => (
          <div key={index} className="dashboard-card" style={{ borderLeftColor: card.color }}>
            <div className="card-icon">{card.icon}</div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p className="card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Recent Events</h2>
          <div className="events-list">
            {events.slice(0, 5).map((event: any) => (
              <div key={event.id} className="event-item">
                <span className="event-category">{event.category}</span>
                <div>
                  <h4>{event.title}</h4>
                  <p>{new Date(event.eventDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && <p>No events scheduled</p>}
          </div>
        </div>

        <div className="section">
          <h2>Pending Tasks</h2>
          <div className="tasks-list">
            {tasks
              .filter((t: any) => t.status !== 'Completed')
              .slice(0, 5)
              .map((task: any) => (
                <div key={task.id} className="task-item">
                  <span className={`priority priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <div>
                    <h4>{task.title}</h4>
                    <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            {tasks.filter((t: any) => t.status !== 'Completed').length === 0 && (
              <p>No pending tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
