import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';

export interface PhotoAlbum {
  id: number;
  name: string;
  description?: string;
  createdBy: number;
  createdDate: string;
  coverPhoto?: string;
  photoCount: number;
  lastUpdated: string;
}

export interface Photo {
  id: number;
  albumId: number;
  title?: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  uploadedBy: number;
  uploadedDate: string;
  date?: string;
  tags?: string[];
}

interface PhotoState {
  albums: PhotoAlbum[];
  currentAlbum: PhotoAlbum | null;
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  albums: [],
  currentAlbum: null,
  photos: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAlbums = createAsyncThunk('photos/fetchAlbums', async () => {
  const res = await apiClient.get<PhotoAlbum[]>('/Photos/GetAlbums');
  return res.data;
});

export const fetchPhotosFromAlbum = createAsyncThunk(
  'photos/fetchFromAlbum',
  async (albumId: number) => {
    const res = await apiClient.get<Photo[]>(`/Photos/GetAlbumPhotos/${albumId}`);
    return res.data;
  }
);

export const createAlbum = createAsyncThunk(
  'photos/createAlbum',
  async (album: Omit<PhotoAlbum, 'id' | 'createdDate' | 'photoCount'>) => {
    const res = await apiClient.post<PhotoAlbum>('/Photos/CreateAlbum', album);
    return res.data;
  }
);

export const updateAlbum = createAsyncThunk(
  'photos/updateAlbum',
  async (album: PhotoAlbum) => {
    const res = await apiClient.put<PhotoAlbum>(`/Photos/UpdateAlbum/${album.id}`, album);
    return res.data;
  }
);

export const deleteAlbum = createAsyncThunk(
  'photos/deleteAlbum',
  async (id: number) => {
    await apiClient.delete(`/Photos/DeleteAlbum/${id}`);
    return id;
  }
);

export const uploadPhoto = createAsyncThunk(
  'photos/upload',
  async (data: { albumId: number; file: File; title?: string; description?: string }) => {
    const formData = new FormData();
    formData.append('albumId', data.albumId.toString());
    formData.append('file', data.file);
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);

    const res = await apiClient.post<Photo>('/Photos/UploadPhoto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
);

export const deletePhoto = createAsyncThunk(
  'photos/deletePhoto',
  async (id: number) => {
    await apiClient.delete(`/Photos/DeletePhoto/${id}`);
    return id;
  }
);

const photoSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    selectAlbum: (state, action) => {
      const albumId = action.payload;
      state.currentAlbum = state.albums.find((a) => a.id === albumId) || null;
    },
    clearCurrentAlbum: (state) => {
      state.currentAlbum = null;
      state.photos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch albums
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch albums';
      })
      // Fetch photos
      .addCase(fetchPhotosFromAlbum.fulfilled, (state, action) => {
        state.photos = action.payload;
      })
      // Create album
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.albums.push(action.payload);
      })
      // Update album
      .addCase(updateAlbum.fulfilled, (state, action) => {
        const index = state.albums.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.albums[index] = action.payload;
        }
      })
      // Delete album
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.albums = state.albums.filter((a) => a.id !== action.payload);
      })
      // Upload photo
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.photos.push(action.payload);
      })
      // Delete photo
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.photos = state.photos.filter((p) => p.id !== action.payload);
      });
  },
});

export const { selectAlbum, clearCurrentAlbum } = photoSlice.actions;
export default photoSlice.reducer;
