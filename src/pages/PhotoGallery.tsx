import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks/hook';
import type { RootState } from '../state/store/store';
import {
  fetchAlbums,
  fetchPhotosFromAlbum,
  createAlbum,
  deleteAlbum,
  uploadPhoto,
  deletePhoto,
  PhotoAlbum,
  Photo,
  selectAlbum,
} from '../state/features/photos/photoSlice';
import AlbumForm from '../components/forms/AlbumForm';
import PhotoUploadForm from '../components/forms/PhotoUploadForm';
import PhotoGrid from '../components/PhotoGrid';

const PhotoGallery: React.FC = () => {
  const dispatch = useAppDispatch();
  const { albums, currentAlbum, photos, loading, error } = useAppSelector(
    (state: RootState) => state.photos
  );
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAlbums() as any);
  }, [dispatch]);

  useEffect(() => {
    if (currentAlbum) {
      dispatch(fetchPhotosFromAlbum(currentAlbum.id) as any);
    }
  }, [currentAlbum, dispatch]);

  const handleCreateAlbum = async (
    albumData: Omit<PhotoAlbum, 'id' | 'createdDate' | 'photoCount'>
  ) => {
    try {
      await dispatch(createAlbum(albumData) as any).unwrap();
      setShowAlbumForm(false);
    } catch (err) {
      console.error('Error creating album:', err);
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this album and all its photos?')) {
      try {
        await dispatch(deleteAlbum(id) as any).unwrap();
        if (currentAlbum?.id === id) {
          dispatch(selectAlbum(null));
        }
      } catch (err) {
        console.error('Error deleting album:', err);
      }
    }
  };

  const handleUploadPhoto = async (photoData: {
    albumId: number;
    file: File;
    title?: string;
    description?: string;
  }) => {
    try {
      await dispatch(uploadPhoto(photoData) as any).unwrap();
      setShowUploadForm(false);
    } catch (err) {
      console.error('Error uploading photo:', err);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await dispatch(deletePhoto(id) as any).unwrap();
      } catch (err) {
        console.error('Error deleting photo:', err);
      }
    }
  };

  return (
    <div className="photo-gallery-container">
      <div className="page-header">
        <h1>Family Photo Gallery</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAlbumForm(!showAlbumForm)}
        >
          {showAlbumForm ? 'Cancel' : 'Create Album'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAlbumForm && (
        <div className="form-container">
          <AlbumForm
            onSubmit={handleCreateAlbum}
            onCancel={() => setShowAlbumForm(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="loading">Loading gallery...</div>
      ) : (
        <div className="gallery-layout">
          <div className="albums-sidebar">
            <h2>Albums</h2>
            <div className="albums-list">
              {albums.map((album: any) => (
                <div
                  key={album.id}
                  className={`album-item ${currentAlbum?.id === album.id ? 'active' : ''}`}
                  onClick={() => dispatch(selectAlbum(album.id))}
                >
                  {album.coverPhoto && (
                    <img
                      src={album.coverPhoto}
                      alt={album.name}
                      className="album-cover"
                    />
                  )}
                  <div className="album-info">
                    <h3>{album.name}</h3>
                    <p>{album.photoCount} photos</p>
                  </div>
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAlbum(album.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {albums.length === 0 && <p>No albums created yet</p>}
            </div>
          </div>

          <div className="photos-section">
            {currentAlbum ? (
              <>
                <div className="album-header">
                  <h2>{currentAlbum.name}</h2>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowUploadForm(!showUploadForm)}
                  >
                    {showUploadForm ? 'Cancel' : 'Upload Photo'}
                  </button>
                </div>

                {showUploadForm && (
                  <div className="form-container">
                    <PhotoUploadForm
                      albumId={currentAlbum.id}
                      onSubmit={handleUploadPhoto}
                      onCancel={() => setShowUploadForm(false)}
                    />
                  </div>
                )}

                <PhotoGrid
                  photos={photos}
                  onDeletePhoto={handleDeletePhoto}
                />

                {photos.length === 0 && <div className="no-data">No photos in this album</div>}
              </>
            ) : (
              <div className="no-data">Select an album to view photos</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
