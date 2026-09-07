import React from 'react';

export default function Header({ isModelLoading, modelError, onRetry }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="app-title">AI Image Classifier</h1>
        <p className="app-subtitle">Upload an image and see what MobileNet predicts.</p>
      </div>

      {(isModelLoading || modelError) && (
        <div className="model-status">
          {isModelLoading && <span className="status-badge loading">Loading AI model...</span>}
          {modelError && (
            <div className="status-error-group">
              <span className="status-badge error">Unable to load AI model</span>
              {onRetry && (
                <button className="btn-secondary btn-sm" onClick={onRetry} type="button">
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
