import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface PhotoUploadFormProps {
  albumId: number;
  onSubmit: (data: { albumId: number; file: File; title?: string; description?: string }) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('Image file is required'),
  title: Yup.string(),
  description: Yup.string(),
});

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({ albumId, onSubmit, onCancel }) => {
  const [preview, setPreview] = useState<string>('');

  return (
    <Formik
      initialValues={{
        file: null as File | null,
        title: '',
        description: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (values.file) {
          onSubmit({
            albumId,
            file: values.file,
            title: values.title,
            description: values.description,
          });
        }
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="form">
          <div className="form-group">
            <label>Photo *</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFieldValue('file', file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <ErrorMessage name="file" component="div" className="error" />
            {preview && (
              <div className="preview">
                <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Photo Title</label>
            <Field type="text" name="title" placeholder="Photo title (optional)" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <Field as="textarea" name="description" placeholder="Photo description (optional)" />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Upload Photo
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

export default PhotoUploadForm;
