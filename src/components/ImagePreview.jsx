import React, { useRef } from 'react';
import { formatFileSize } from '../utils/fileValidation';

export default function ImagePreview({
  images,
  selectedIndex,
  onSelectIndex,
  onRemoveImage,
  onClassify,
  isClassifying,
  isModelReady
}) {
  const imgRef = useRef(null);

  if (!images || images.length === 0) return null;

  const current = images[selectedIndex] || images[0];

  return (
    <div className="card preview-card">
      <div className="card-header">
        <h2 className="card-title">Image Preview</h2>
        {images.length > 1 && (
          <span className="badge">{selectedIndex + 1} of {images.length}</span>
        )}
      </div>

      {images.length > 1 && (
        <div className="thumb-bar">
          {images.map((item, idx) => (
            <button
              key={item.id}
              className={`thumb-item ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => onSelectIndex(idx)}
              type="button"
            >
              <img src={item.previewUrl} alt={`Thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}

      <div className="preview-image-box">
        <img
          ref={imgRef}
          src={current.previewUrl}
          alt={current.file.name}
          className="preview-img"
          crossOrigin="anonymous"
        />
      </div>

      <div className="file-meta-row">
        <div className="file-details">
          <span className="file-name" title={current.file.name}>{current.file.name}</span>
          <span className="file-size">{formatFileSize(current.file.size)}</span>
        </div>

        <button
          className="btn-danger-outline"
          onClick={() => onRemoveImage(current.id)}
          disabled={isClassifying}
          type="button"
        >
          Remove Image
        </button>
      </div>

      <div className="preview-actions">
        <button
          className="btn-primary btn-block"
          onClick={() => imgRef.current && onClassify(imgRef.current, current)}
          disabled={isClassifying || !isModelReady}
          type="button"
        >
          {isClassifying ? (
            <span className="btn-loading flex-center">
              <span className="btn-spinner" /> Classifying Image...
            </span>
          ) : (
            'Classify Image'
          )}
        </button>
      </div>
    </div>
  );
}
