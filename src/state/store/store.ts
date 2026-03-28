import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../features/profiles/profileSlice';
import familyReducer from '../features/family/familySlice';
import eventReducer from '../features/events/eventSlice';
import taskReducer from '../features/tasks/taskSlice';
import budgetReducer from '../features/budget/budgetSlice';
import photoReducer from '../features/photos/photoSlice';

export const store = configureStore({
  reducer: {
    profiles: profileReducer,
    family: familyReducer,
    events: eventReducer,
    tasks: taskReducer,
    budget: budgetReducer,
    photos: photoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;