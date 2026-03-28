import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks/hook';
import type { RootState } from '../state/store/store';
import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  FamilyEvent,
} from '../state/features/events/eventSlice';
import EventForm from '../components/forms/EventForm';
import EventCard from '../components/EventCard';

const Events: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state: RootState) => state.events);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FamilyEvent | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    dispatch(fetchEvents() as any);
  }, [dispatch]);

  const handleAddEvent = async (eventData: Omit<FamilyEvent, 'id' | 'createdDate' | 'createdBy'>) => {
    try {
      await dispatch(addEvent(eventData) as any).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const handleUpdateEvent = async (eventData: Omit<FamilyEvent, 'id' | 'createdDate' | 'createdBy'>) => {
    try {
      if (editingEvent) {
        const updatedEvent: FamilyEvent = {
          ...eventData,
          id: editingEvent.id,
          createdDate: editingEvent.createdDate,
          createdBy: editingEvent.createdBy,
        };
        await dispatch(updateEvent(updatedEvent) as any).unwrap();
        setEditingEvent(null);
      }
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await dispatch(deleteEvent(id) as any).unwrap();
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const filteredEvents = events.filter((e: any) => e.eventDate.startsWith(selectedMonth));

  const groupedByDate = filteredEvents.reduce(
    (acc: any, event: any) => {
      const date = event.eventDate;
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, FamilyEvent[]>
  );

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="events-container">
      <div className="page-header">
        <h1>Family Calendar</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <EventForm onSubmit={handleAddEvent} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editingEvent && (
        <div className="form-container">
          <h2>Edit Event</h2>
          <EventForm
            initialData={editingEvent}
            onSubmit={handleUpdateEvent}
            onCancel={() => setEditingEvent(null)}
          />
        </div>
      )}

      <div className="filter-section">
        <label>Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <div className="events-list">
          {sortedDates.length > 0 ? (
            sortedDates.map((date) => (
              <div key={date} className="event-date-group">
                <h3 className="event-date">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <div className="events-on-date">
                  {groupedByDate[date].map((event: any) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={() => setEditingEvent(event)}
                      onDelete={() => handleDeleteEvent(event.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No events scheduled for this month</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
