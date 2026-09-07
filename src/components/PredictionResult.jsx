import React from 'react';

export default function PredictionResult({ result }) {
  if (!result || !result.predictions || result.predictions.length === 0) {
    return null;
  }

  const top = result.predictions[0];
  const confidencePercent = (top.probability * 100).toFixed(2);
  const isLowConfidence = top.probability < 0.5;

  const categoryName = top.className
    .split(',')
    .map(s => s.trim().charAt(0).toUpperCase() + s.trim().slice(1))
    .join(', ');

  return (
    <div className="card prediction-result-card">
      <h2 className="card-title">Prediction Result</h2>

      <div className="result-panel">
        <div className="category-section">
          <span className="label-heading">Predicted Category</span>
          <h3 className="category-title">{categoryName}</h3>
        </div>

        <div className="confidence-section">
          <div className="confidence-header">
            <span className="label-heading">Confidence</span>
            <span className="confidence-score">{confidencePercent}%</span>
          </div>

          <div className="confidence-track">
            <div
              className={`confidence-bar ${isLowConfidence ? 'low' : ''}`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </div>

      {isLowConfidence && (
        <div className="alert-warning" role="alert">
          <span className="warning-icon">⚠️</span>
          <div className="warning-content">
            <strong>Low confidence prediction ({confidencePercent}%)</strong>
            <p>The model may not recognize this image accurately.</p>
          </div>
        </div>
      )}
    </div>
  );
}
