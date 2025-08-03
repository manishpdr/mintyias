import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks/hook';
import {
  fetchProfiles,
  deleteProfileAsync,
  Profile
} from '../state/features/profiles/profileSlice';
import ProfileForm from '../components/ProfileForm';

const ProfileList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profiles, loading, error } = useAppSelector(s => s.profiles);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  useEffect(() => { 
    dispatch(fetchProfiles());
   }, [dispatch]);

  return (
    <div className="profile-list">
      {loading && <p>Loading profiles...</p>}
      {error && <p className="error">{error}</p>}

      <ProfileForm editingProfile={editingProfile} onDone={() => setEditingProfile(null)} />

      <ul>
        {profiles.map(p => (
          <li key={p.Id}>
            {p.Name} ({p.Email})
            <button onClick={() => setEditingProfile(p)}>Edit</button>
            <button onClick={() => dispatch(deleteProfileAsync(p.Id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileList;