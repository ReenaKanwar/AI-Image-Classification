import React from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * TopPredictions Component
 * Renders the top 3 candidate predictions with animated CSS progress bars.
 */
export default function TopPredictions({ predictions }) {
  if (!predictions || predictions.length === 0) return null;

  // Take top 3 predictions
  const top3 = predictions.slice(0, 3);

  return (
    <div className="top-predictions-card">
      <div className="card-header">
        <h2 className="card-title">
          <BarChart3 className="card-title-icon" /> Top 3 Predictions
        </h2>
        <span className="card-subtitle">Probability distribution across top MobileNet candidate classes</span>
      </div>

      <div className="predictions-list">
        {top3.map((pred, index) => {
          const percentVal = (pred.probability * 100).toFixed(2);
          const rankNum = String(index + 1).padStart(2, '0');

          // Clean class names
          const formattedName = pred.className
            .split(',')
            .map(s => s.trim().charAt(0).toUpperCase() + s.trim().slice(1))
            .join(', ');

          return (
            <div className="prediction-item" key={index}>
              <div className="item-row">
                <span className="item-rank">{rankNum}</span>
                <span className="item-name" title={formattedName}>{formattedName}</span>
                <span className="item-percent">{percentVal}%</span>
              </div>
              <div className="progress-track" aria-label={`${formattedName} confidence ${percentVal}%`}>
                <div 
                  className={`progress-bar rank-${index + 1}`} 
                  style={{ width: `${percentVal}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
