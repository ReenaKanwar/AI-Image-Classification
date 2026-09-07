import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, FileCheck, Layers } from 'lucide-react';
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../utils/fileValidation';

/**
 * ImageUploader Component
 * Provides a drag-and-drop zone and click-to-browse file input for image uploads.
 */
export default function ImageUploader({ onFilesSelected, isProcessing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Verify target isn't child element
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(droppedFiles);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
      // Reset input value so re-uploading same file triggers onChange
      e.target.value = '';
    }
  };

  const handleClickBrowse = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="uploader-card">
      <div className="card-header">
        <h2 className="card-title">
          <UploadCloud className="card-title-icon" /> Upload Image
        </h2>
        <span className="card-subtitle">Select single or multiple images for AI classification</span>
      </div>

      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'disabled' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickBrowse}
        role="button"
        tabIndex={0}
        aria-label="Upload image drop zone"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClickBrowse();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden-file-input"
          aria-hidden="true"
        />

        <div className="drop-zone-content">
          <div className="upload-icon-wrapper">
            <UploadCloud className="upload-icon" />
          </div>
          
          <div className="upload-text-group">
            <p className="primary-upload-text">
              <span className="highlight-text">Drag & drop your image here</span>
            </p>
            <p className="secondary-upload-text">or <span className="browse-link">click to browse</span></p>
          </div>

          <div className="upload-constraints">
            <div className="constraint-item">
              <ImageIcon className="constraint-icon" />
              <span>Supported: JPG, JPEG, PNG, WEBP</span>
            </div>
            <div className="constraint-item">
              <FileCheck className="constraint-icon" />
              <span>Maximum size: 5 MB per file</span>
            </div>
            <div className="constraint-item">
              <Layers className="constraint-icon" />
              <span>Multiple image upload supported</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
