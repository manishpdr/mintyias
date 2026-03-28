import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Expense } from '../../state/features/budget/budgetSlice';

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: Omit<Expense, 'id' | 'createdDate'>) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Expense title is required'),
  amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
  category: Yup.string().required('Category is required'),
  date: Yup.string().required('Date is required'),
  paidBy: Yup.number().required('Paid by member is required'),
});

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{
        title: initialData?.title || '',
        description: initialData?.description || '',
        amount: initialData?.amount || 0,
        category: initialData?.category || 'Other',
        date: initialData?.date || new Date().toISOString().split('T')[0],
        paidBy: initialData?.paidBy || 0,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit({
          ...values,
          amount: Number(values.amount),
          paidBy: Number(values.paidBy),
          splitAmong: initialData?.splitAmong || [],
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <div className="form-group">
            <label>Expense Title *</label>
            <Field type="text" name="title" placeholder="What was purchased?" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <Field as="textarea" name="description" placeholder="Expense details" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount *</label>
              <Field type="number" name="amount" placeholder="0.00" step="0.01" />
              <ErrorMessage name="amount" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <Field as="select" name="category">
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </Field>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <Field type="date" name="date" />
              <ErrorMessage name="date" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Paid By (Member ID) *</label>
              <Field type="number" name="paidBy" placeholder="Member ID" />
              <ErrorMessage name="paidBy" component="div" className="error" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {initialData ? 'Update Expense' : 'Add Expense'}
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

export default ExpenseForm;
