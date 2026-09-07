import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

/**
 * ErrorMessage Component
 * Displays actionable alert banner for user, validation, or model errors.
 */
export default function ErrorMessage({ message, onDismiss, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-alert-banner" role="alert">
      <div className="alert-content-left">
        <AlertCircle className="alert-icon" />
        <span className="alert-text">{message}</span>
      </div>

      <div className="alert-actions-right">
        {onRetry && (
          <button className="alert-retry-btn" onClick={onRetry} type="button">
            <RefreshCw className="btn-icon" /> Retry
          </button>
        )}
        {onDismiss && (
          <button className="alert-dismiss-btn" onClick={onDismiss} type="button" aria-label="Dismiss Error">
            <X className="btn-icon" />
          </button>
        )}
      </div>
    </div>
  );
}
