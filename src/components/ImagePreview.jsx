import React, { useRef } from 'react';
import { Image as ImageIcon, Trash2, Sparkles, Loader2, Images } from 'lucide-react';
import { formatFileSize } from '../utils/fileValidation';

/**
 * ImagePreview Component
 * Displays image preview, metadata, remove option, batch tab switcher, and Classify action button.
 */
export default function ImagePreview({
  images,
  selectedIndex,
  onSelectIndex,
  onRemoveImage,
  onClassify,
  isClassifying,
  isModelReady
}) {
  const currentImgRef = useRef(null);

  if (!images || images.length === 0) return null;

  const activeItem = images[selectedIndex] || images[0];

  const handleClassifyClick = () => {
    if (currentImgRef.current && !isClassifying && isModelReady) {
      onClassify(currentImgRef.current, activeItem);
    }
  };

  return (
    <div className="preview-card">
      <div className="card-header flex-between">
        <div className="header-left">
          <h2 className="card-title">
            <ImageIcon className="card-title-icon" /> Image Preview
          </h2>
          {images.length > 1 && (
            <span className="batch-badge">
              <Images className="batch-icon" /> {selectedIndex + 1} of {images.length} images
            </span>
          )}
        </div>
      </div>

      {/* Multiple Image Selector Tabs (if multiple images selected) */}
      {images.length > 1 && (
        <div className="image-tabs-container">
          {images.map((item, idx) => (
            <button
              key={item.id}
              className={`tab-thumb-btn ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => onSelectIndex(idx)}
              type="button"
              title={item.file.name}
            >
              <img src={item.previewUrl} alt={`Thumbnail ${idx + 1}`} />
              <span className="tab-number">{idx + 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display Box */}
      <div className="preview-body">
        <div className="preview-image-wrapper">
          <img
            ref={currentImgRef}
            src={activeItem.previewUrl}
            alt={activeItem.file.name}
            className="preview-img"
            crossOrigin="anonymous"
          />
        </div>

        {/* Metadata info row */}
        <div className="preview-meta">
          <div className="meta-details">
            <span className="meta-filename" title={activeItem.file.name}>
              {activeItem.file.name}
            </span>
            <span className="meta-filesize">
              {formatFileSize(activeItem.file.size)}
            </span>
          </div>

          <button
            className="remove-btn"
            onClick={() => onRemoveImage(activeItem.id)}
            disabled={isClassifying}
            type="button"
            aria-label="Remove Image"
          >
            <Trash2 className="btn-icon" /> Remove Image
          </button>
        </div>
      </div>

      {/* Action footer */}
      <div className="preview-actions">
        <button
          className="classify-btn"
          onClick={handleClassifyClick}
          disabled={isClassifying || !isModelReady}
          type="button"
        >
          {isClassifying ? (
            <>
              <Loader2 className="btn-icon spinner" />
              <span>Analyzing Neural Features...</span>
            </>
          ) : (
            <>
              <Sparkles className="btn-icon" />
              <span>Classify Image</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
