import React from 'react';
import { Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * PredictionResult Component
 * Displays top predicted category, confidence score, and low-confidence warnings.
 */
export default function PredictionResult({ result }) {
  if (!result || !result.predictions || result.predictions.length === 0) {
    return null;
  }

  const topPrediction = result.predictions[0];
  const confidencePercent = (topPrediction.probability * 100).toFixed(2);
  const isLowConfidence = topPrediction.probability < 0.5;

  // Clean up className string (e.g. capitalize comma-separated labels)
  const formattedCategory = topPrediction.className
    .split(',')
    .map(s => s.trim().charAt(0).toUpperCase() + s.trim().slice(1))
    .join(', ');

  return (
    <div className="result-card">
      <div className="result-header">
        <h2 className="card-title">
          <Award className="card-title-icon" /> Classification Result
        </h2>
        <span className="live-inference-pill">
          <CheckCircle2 className="pill-icon" /> Live Browser Prediction
        </span>
      </div>

      <div className="result-body">
        {/* Main Category Display */}
        <div className="predicted-category-box">
          <span className="category-label">Predicted Category</span>
          <h3 className="category-name">{formattedCategory}</h3>
        </div>

        {/* Confidence Display */}
        <div className="confidence-box">
          <span className="confidence-label">Confidence</span>
          <div className="confidence-value-row">
            <span className="confidence-number">{confidencePercent}%</span>
            <div className="confidence-meter-mini">
              <div 
                className="confidence-fill-mini" 
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Low Confidence Warning */}
      {isLowConfidence && (
        <div className="warning-banner" role="alert">
          <AlertTriangle className="warning-icon" />
          <div className="warning-text">
            <strong>Low confidence prediction ({confidencePercent}%)</strong>
            <p>The model may not recognize this image accurately or the item is not in MobileNet's dataset.</p>
          </div>
        </div>
      )}
    </div>
  );
}
