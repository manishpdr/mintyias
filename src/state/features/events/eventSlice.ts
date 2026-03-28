import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';

export interface FamilyEvent {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
  category: 'Birthday' | 'Anniversary' | 'Holiday' | 'Vacation' | 'Meeting' | 'Other';
  createdBy: number;
  createdDate: string;
  attendees?: number[]; // Member IDs
  image?: string;
  reminder: boolean;
}

interface EventState {
  events: FamilyEvent[];
  filteredEvents: FamilyEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  filteredEvents: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchEvents = createAsyncThunk('events/fetchAll', async () => {
  const res = await apiClient.get<FamilyEvent[]>('/Events/GetAll');
  return res.data;
});

export const addEvent = createAsyncThunk(
  'events/add',
  async (event: Omit<FamilyEvent, 'id' | 'createdDate' | 'createdBy'>) => {
    const res = await apiClient.post<FamilyEvent>('/Events/Create', event);
    return res.data;
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async (event: FamilyEvent) => {
    const res = await apiClient.put<FamilyEvent>(`/Events/Update/${event.id}`, event);
    return res.data;
  }
);

export const deleteEvent = createAsyncThunk('events/delete', async (id: number) => {
  await apiClient.delete(`/Events/Delete/${id}`);
  return id;
});

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    filterEventsByDate: (state, action) => {
      const date = action.payload;
      state.filteredEvents = state.events.filter((e) =>
        e.eventDate.startsWith(date)
      );
    },
    filterEventsByCategory: (state, action) => {
      const category = action.payload;
      state.filteredEvents = state.events.filter((e) => e.category === category);
    },
    clearFilters: (state) => {
      state.filteredEvents = state.events;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.filteredEvents = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      })
      // Add event
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
        state.filteredEvents = state.events;
      })
      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
          state.filteredEvents = state.events;
        }
      })
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
        state.filteredEvents = state.events;
      });
  },
});

export const { filterEventsByDate, filterEventsByCategory, clearFilters } =
  eventSlice.actions;
export default eventSlice.reducer;
