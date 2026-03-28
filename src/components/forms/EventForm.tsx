import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FamilyEvent } from '../../state/features/events/eventSlice';

interface EventFormProps {
  initialData?: FamilyEvent;
  onSubmit: (data: Omit<FamilyEvent, 'id' | 'createdDate' | 'createdBy'>) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Event title is required'),
  eventDate: Yup.string().required('Event date is required'),
  category: Yup.string().required('Category is required'),
  eventTime: Yup.string(),
  location: Yup.string(),
  description: Yup.string(),
});

const EventForm: React.FC<EventFormProps> = ({ initialData, onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{
        title: initialData?.title || '',
        description: initialData?.description || '',
        eventDate: initialData?.eventDate || '',
        eventTime: initialData?.eventTime || '',
        location: initialData?.location || '',
        category: initialData?.category || 'Other',
        reminder: initialData?.reminder || false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit({
          ...values,
          attendees: initialData?.attendees || [],
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <div className="form-group">
            <label>Event Title *</label>
            <Field type="text" name="title" placeholder="Event title" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <Field as="textarea" name="description" placeholder="Event description" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <Field type="date" name="eventDate" />
              <ErrorMessage name="eventDate" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Time</label>
              <Field type="time" name="eventTime" />
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <Field type="text" name="location" placeholder="Event location" />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <Field as="select" name="category">
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Holiday">Holiday</option>
              <option value="Vacation">Vacation</option>
              <option value="Meeting">Meeting</option>
              <option value="Other">Other</option>
            </Field>
          </div>

          <div className="form-group">
            <label>
              <Field type="checkbox" name="reminder" />
              Send Reminder
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {initialData ? 'Update Event' : 'Add Event'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
