import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FamilyMember } from '../../state/features/family/familySlice';

interface MemberFormProps {
  initialData?: FamilyMember;
  onSubmit: (data: Omit<FamilyMember, 'id'>) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  relationship: Yup.string().required('Relationship is required'),
  dateOfBirth: Yup.string().required('Date of Birth is required'),
  role: Yup.string().required('Role is required'),
  phone: Yup.string(),
});

const MemberForm: React.FC<MemberFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const handleSubmit = (values: any) => {
    onSubmit({
      ...values,
      joinDate: initialData?.joinDate || new Date().toISOString(),
    });
  };

  return (
    <Formik
      initialValues={{
        name: initialData?.name || '',
        email: initialData?.email || '',
        relationship: initialData?.relationship || '',
        dateOfBirth: initialData?.dateOfBirth || '',
        role: initialData?.role || 'Member',
        phone: initialData?.phone || '',
        profileImage: initialData?.profileImage || '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <div className="form-group">
            <label>Name *</label>
            <Field type="text" name="name" placeholder="Family member name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <Field type="email" name="email" placeholder="Email address" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <Field type="tel" name="phone" placeholder="Phone number" />
          </div>

          <div className="form-group">
            <label>Relationship *</label>
            <Field as="select" name="relationship">
              <option value="">Select relationship</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Other">Other</option>
            </Field>
            <ErrorMessage name="relationship" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Date of Birth *</label>
            <Field type="date" name="dateOfBirth" />
            <ErrorMessage name="dateOfBirth" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <Field as="select" name="role">
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </Field>
          </div>

          <div className="form-group">
            <label>Profile Image URL</label>
            <Field type="text" name="profileImage" placeholder="Image URL" />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {initialData ? 'Update Member' : 'Add Member'}
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

export default MemberForm;
