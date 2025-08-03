import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';

export interface Profile { id: string; name: string; email: string; }

interface ProfileState {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profiles: [], loading: false, error: null
};

export const fetchProfiles = createAsyncThunk('profiles/fetch', async () => {
  const res = await apiClient.get<Profile[]>('/profiles');
  return res.data;
});

export const addProfileAsync = createAsyncThunk(
  'profiles/add',
  async (input: Omit<Profile, 'id'>) => {
    const res = await apiClient.post<Profile>('/profiles', input);
    return res.data;
  }
);

export const updateProfileAsync = createAsyncThunk(
  'profiles/update',
  async (profile: Profile) => {
    const res = await apiClient.put<Profile>(`/profiles/${profile.id}`, profile);
    return res.data;
  }
);

export const deleteProfileAsync = createAsyncThunk(
  'profiles/delete',
  async (id: string) => {
    await apiClient.delete(`/profiles/${id}`);
    return id;
  }
);
const slice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProfiles.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchProfiles.fulfilled, (state, action) => { state.loading = false; state.profiles = action.payload; })
      .addCase(fetchProfiles.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed'; })

      .addCase(addProfileAsync.fulfilled, (state, action) => { state.profiles.push(action.payload); })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        const idx = state.profiles.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.profiles[idx] = action.payload;
      })
      .addCase(deleteProfileAsync.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter(p => p.id !== action.payload);
      });
  }
});

export default slice.reducer;

