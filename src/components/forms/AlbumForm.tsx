import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PhotoAlbum } from '../../state/features/photos/photoSlice';

interface AlbumFormProps {
  initialData?: PhotoAlbum;
  onSubmit: (data: Omit<PhotoAlbum, 'id' | 'createdDate' | 'photoCount'>) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Album name is required'),
  description: Yup.string(),
});

const AlbumForm: React.FC<AlbumFormProps> = ({ initialData, onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{
        name: initialData?.name || '',
        description: initialData?.description || '',
        createdBy: initialData?.createdBy || 0,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit({
          name: values.name,
          description: values.description,
          createdBy: values.createdBy,
          lastUpdated: new Date().toISOString(),
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <div className="form-group">
            <label>Album Name *</label>
            <Field type="text" name="name" placeholder="Album name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <Field as="textarea" name="description" placeholder="Album description" />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {initialData ? 'Update Album' : 'Create Album'}
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

export default AlbumForm;
