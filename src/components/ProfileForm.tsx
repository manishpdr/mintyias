import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../state/hooks/hook';
import { addProfileAsync, updateProfileAsync, Profile } from '../state/features/profiles/profileSlice';

interface ProfileFormProps {
  editingProfile?: Profile | null;
  onDone: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ editingProfile, onDone }) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingProfile) {
      setName(editingProfile.name);
      setEmail(editingProfile.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [editingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingProfile) {
        await dispatch(updateProfileAsync({ ...editingProfile, name, email })).unwrap();
      } else {
        await dispatch(addProfileAsync({ name, email })).unwrap();
      }

      setName('');
      setEmail('');
      onDone();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingProfile ? 'Edit Profile' : 'Add Profile'}</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : editingProfile ? 'Update' : 'Add'}
      </button>
      {editingProfile && (
        <button type="button" onClick={onDone}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProfileForm;