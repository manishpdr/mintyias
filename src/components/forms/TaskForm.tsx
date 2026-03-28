import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FamilyTask } from '../../state/features/tasks/taskSlice';

interface TaskFormProps {
  initialData?: FamilyTask;
  onSubmit: (data: Omit<FamilyTask, 'id' | 'createdDate'>) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Task title is required'),
  dueDate: Yup.string().required('Due date is required'),
  priority: Yup.string().required('Priority is required'),
  status: Yup.string().required('Status is required'),
  assignedTo: Yup.number().required('Assign to member is required'),
});

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{
        title: initialData?.title || '',
        description: initialData?.description || '',
        dueDate: initialData?.dueDate || '',
        priority: initialData?.priority || 'Medium',
        status: initialData?.status || 'Pending',
        assignedTo: initialData?.assignedTo || 0,
        assignedBy: initialData?.assignedBy || 0,
        category: initialData?.category || '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit({
          ...values,
          assignedTo: Number(values.assignedTo),
          assignedBy: Number(values.assignedBy),
        });
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className="form">
          <div className="form-group">
            <label>Task Title *</label>
            <Field type="text" name="title" placeholder="Task title" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <Field as="textarea" name="description" placeholder="Task description" />
          </div>

          <div className="form-group">
            <label>Category</label>
            <Field type="text" name="category" placeholder="Task category" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <Field type="date" name="dueDate" />
              <ErrorMessage name="dueDate" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Priority *</label>
              <Field as="select" name="priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Field>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status *</label>
              <Field as="select" name="status">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Field>
            </div>
            <div className="form-group">
              <label>Assign To *</label>
              <Field type="number" name="assignedTo" placeholder="Member ID" />
              <ErrorMessage name="assignedTo" component="div" className="error" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {initialData ? 'Update Task' : 'Add Task'}
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

export default TaskForm;
