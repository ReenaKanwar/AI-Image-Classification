import React from 'react';
import { Eye, ArrowUpCircle } from 'lucide-react';

/**
 * EmptyState Component
 * Visual placeholder when no prediction is currently displayed.
 */
export default function EmptyState() {
  return (
    <div className="empty-state-card">
      <div className="empty-state-body">
        <div className="empty-icon-circle">
          <Eye className="empty-icon" />
        </div>
        <h3 className="empty-title">Awaiting Image Classification</h3>
        <p className="empty-description">
          Upload an image above and click <strong>"Classify Image"</strong> to view real-time neural network predictions.
        </p>
        <div className="empty-hint flex-center">
          <ArrowUpCircle className="hint-icon" />
          <span>Upload JPG, PNG or WEBP to get started</span>
        </div>
      </div>
    </div>
  );
}
