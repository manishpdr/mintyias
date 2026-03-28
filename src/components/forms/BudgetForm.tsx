import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface BudgetFormProps {
  month: string;
  onSubmit: (data: { category: string; budgetAmount: number; month: string }) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  budgetAmount: Yup.number()
    .positive('Budget must be positive')
    .required('Budget amount is required'),
});

const BudgetForm: React.FC<BudgetFormProps> = ({ month, onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{
        category: '',
        budgetAmount: 0,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit({
          ...values,
          budgetAmount: Number(values.budgetAmount),
          month,
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <div className="form-group">
            <label>Category *</label>
            <Field as="select" name="category">
              <option value="">Select category</option>
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </Field>
            <ErrorMessage name="category" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Budget Amount *</label>
            <Field type="number" name="budgetAmount" placeholder="0.00" step="0.01" />
            <ErrorMessage name="budgetAmount" component="div" className="error" />
          </div>

          <p className="text-muted">Month: {month}</p>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Set Budget
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

export default BudgetForm;
