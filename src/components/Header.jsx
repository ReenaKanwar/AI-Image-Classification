import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, Loader2, Sparkles } from 'lucide-react';

/**
 * Header Component
 * Displays application branding, description, and live model status indicator badge.
 */
export default function Header({ modelState, onRetryModel }) {
  const { status, isReady, isLoading, error } = modelState;

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-section">
          <div className="logo-badge">
            <Cpu className="logo-icon" />
          </div>
          <div>
            <div className="title-row">
              <h1 className="app-title">AI Image Classifier</h1>
              <span className="tech-badge">
                <Sparkles className="badge-icon" /> TensorFlow.js
              </span>
            </div>
            <p className="app-subtitle">
              Identify objects and categories instantly using browser-based pre-trained MobileNet neural network.
            </p>
          </div>
        </div>

        {/* Model Status Indicator */}
        <div className="model-status-wrapper">
          <div className={`status-pill ${status}`}>
            {isLoading && (
              <>
                <Loader2 className="status-icon spinner" />
                <span>Loading AI Model...</span>
              </>
            )}
            {isReady && (
              <>
                <CheckCircle2 className="status-icon success" />
                <span>AI Model Ready</span>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertTriangle className="status-icon danger" />
                <span>Model Load Error</span>
              </>
            )}
          </div>
          {status === 'error' && onRetryModel && (
            <button className="retry-btn" onClick={onRetryModel} type="button">
              Retry Load
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
