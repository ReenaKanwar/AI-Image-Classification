import React from 'react';

export default function EmptyState() {
  return (
    <div className="card empty-card">
      <div className="empty-content">
        <p className="empty-heading">No predictions yet</p>
        <p className="empty-subtext">Upload an image on the left and click "Classify Image" to see MobileNet predictions.</p>
      </div>
    </div>
  );
}
