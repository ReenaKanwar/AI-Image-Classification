import React from 'react';

export default function LoadingState({ message = 'Analyzing image...' }) {
  return (
    <div className="card loading-card">
      <div className="spinner-wrapper">
        <span className="spinner" />
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}
