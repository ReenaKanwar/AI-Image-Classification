import React from 'react';

export default function TopPredictions({ predictions }) {
  if (!predictions || predictions.length === 0) return null;

  const top3 = predictions.slice(0, 3);

  return (
    <div className="card top-predictions-card">
      <h2 className="card-title">Top 3 Predictions</h2>

      <div className="predictions-list">
        {top3.map((item, index) => {
          const percent = (item.probability * 100).toFixed(2);
          const rank = String(index + 1).padStart(2, '0');

          const name = item.className
            .split(',')
            .map(s => s.trim().charAt(0).toUpperCase() + s.trim().slice(1))
            .join(', ');

          return (
            <div className="prediction-item" key={index}>
              <div className="item-header">
                <span className="item-rank">{rank}</span>
                <span className="item-label" title={name}>{name}</span>
                <span className="item-value">{percent}%</span>
              </div>
              <div className="progress-bg">
                <div
                  className={`progress-fill rank-${index + 1}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
