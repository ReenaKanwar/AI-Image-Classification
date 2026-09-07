import React from 'react';

export default function ErrorMessage({ message, onDismiss, onRetry }) {
  if (!message) return null;

  return (
    <div className="alert-error" role="alert">
      <span className="error-text">{message}</span>
      <div className="alert-actions">
        {onRetry && (
          <button className="btn-secondary btn-sm" onClick={onRetry} type="button">
            Retry
          </button>
        )}
        {onDismiss && (
          <button className="btn-icon-dismiss" onClick={onDismiss} type="button" aria-label="Dismiss error">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
