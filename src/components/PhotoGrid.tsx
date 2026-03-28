import React, { useState } from 'react';
import { Photo } from '../state/features/photos/photoSlice';

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (id: number) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onDeletePhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    setSelectedPhoto(photos[currentIndex === 0 ? photos.length - 1 : currentIndex - 1]);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    setSelectedPhoto(photos[currentIndex === photos.length - 1 ? 0 : currentIndex + 1]);
  };

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photo-item"
            onClick={() => {
              setSelectedPhoto(photo);
              setCurrentIndex(index);
            }}
          >
            <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.title} />
            <div className="photo-overlay">
              <button
                className="btn btn-sm btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePhoto(photo.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="photo-lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPhoto(null)}>
              ✕
            </button>
            <button className="nav-btn prev-btn" onClick={handlePrevious}>
              ❮
            </button>
            <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} />
            <button className="nav-btn next-btn" onClick={handleNext}>
              ❯
            </button>
            {selectedPhoto.title && <p className="photo-title">{selectedPhoto.title}</p>}
            {selectedPhoto.description && (
              <p className="photo-description">{selectedPhoto.description}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGrid;
