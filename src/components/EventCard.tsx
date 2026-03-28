import React from 'react';
import { FamilyEvent } from '../state/features/events/eventSlice';

interface EventCardProps {
  event: FamilyEvent;
  onEdit: () => void;
  onDelete: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Birthday: '#e74c3c',
      Anniversary: '#e91e63',
      Holiday: '#f39c12',
      Vacation: '#3498db',
      Meeting: '#9b59b6',
      Other: '#95a5a6',
    };
    return colors[category] || '#34495e';
  };

  return (
    <div
      className="event-card"
      style={{ borderLeftColor: getCategoryColor(event.category) }}
    >
      <div className="event-header">
        <h3>{event.title}</h3>
        <span className="event-category" style={{ backgroundColor: getCategoryColor(event.category) }}>
          {event.category}
        </span>
      </div>
      {event.description && <p className="event-description">{event.description}</p>}
      <div className="event-details">
        <p>
          <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
        </p>
        {event.eventTime && (
          <p>
            <strong>Time:</strong> {event.eventTime}
          </p>
        )}
        {event.location && (
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        )}
      </div>
      <div className="event-actions">
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

export default EventCard;
