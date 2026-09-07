import React from 'react';
import { Loader2, Cpu } from 'lucide-react';

/**
 * LoadingState Component
 * Displays animated spinner and message for async tasks like model load or inference.
 */
export default function LoadingState({ message = 'Processing...' }) {
  return (
    <div className="loading-state-card">
      <div className="loading-state-content">
        <div className="spinner-halo">
          <Cpu className="cpu-pulse-icon" />
          <Loader2 className="spinner-ring" />
        </div>
        <p className="loading-message">{message}</p>
        <p className="loading-subtext">Running neural network calculations locally in browser</p>
      </div>
    </div>
  );
}
