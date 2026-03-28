import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';

export interface FamilyMember {
  id: number;
  name: string;
  email: string;
  relationship: string; // 'Parent', 'Child', 'Spouse', 'Sibling', 'Other'
  dateOfBirth: string;
  role: 'Admin' | 'Member' | 'Viewer';
  profileImage?: string;
  phone?: string;
  joinDate: string;
}

export interface FamilyGroup {
  id: number;
  name: string;
  description?: string;
  createdBy: number;
  createdDate: string;
  members: FamilyMember[];
}

interface FamilyState {
  currentFamily: FamilyGroup | null;
  members: FamilyMember[];
  loading: boolean;
  error: string | null;
}

const initialState: FamilyState = {
  currentFamily: null,
  members: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchFamilyMembers = createAsyncThunk('family/fetchMembers', async () => {
  const res = await apiClient.get<FamilyMember[]>('/Family/GetMembers');
  return res.data;
});

export const addFamilyMember = createAsyncThunk(
  'family/addMember',
  async (member: Omit<FamilyMember, 'id'>) => {
    const res = await apiClient.post<FamilyMember>('/Family/AddMember', member);
    return res.data;
  }
);

export const updateFamilyMember = createAsyncThunk(
  'family/updateMember',
  async (member: FamilyMember) => {
    const res = await apiClient.put<FamilyMember>(`/Family/UpdateMember/${member.id}`, member);
    return res.data;
  }
);

export const deleteFamilyMember = createAsyncThunk(
  'family/deleteMember',
  async (id: number) => {
    await apiClient.delete(`/Family/DeleteMember/${id}`);
    return id;
  }
);

export const getCurrentFamily = createAsyncThunk('family/getCurrent', async () => {
  const res = await apiClient.get<FamilyGroup>('/Family/GetCurrent');
  return res.data;
});

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch members
      .addCase(fetchFamilyMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch members';
      })
      // Add member
      .addCase(addFamilyMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })
      // Update member
      .addCase(updateFamilyMember.fulfilled, (state, action) => {
        const index = state.members.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      // Delete member
      .addCase(deleteFamilyMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m.id !== action.payload);
      })
      // Get current family
      .addCase(getCurrentFamily.fulfilled, (state, action) => {
        state.currentFamily = action.payload;
      });
  },
});

export const { clearError } = familySlice.actions;
export default familySlice.reducer;
