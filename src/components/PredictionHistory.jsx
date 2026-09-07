import React from 'react';
import { History, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';

/**
 * Formats ISO timestamp string into readable date & time.
 * e.g., "Sep 7, 2026, 5:30 PM"
 */
function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (err) {
    return isoString;
  }
}

/**
 * PredictionHistory Component
 * Displays persistent classification history saved in browser localStorage.
 */
export default function PredictionHistory({ history, onClearHistory, onSelectHistoryItem }) {
  const hasHistory = Array.isArray(history) && history.length > 0;

  return (
    <div className="history-card">
      <div className="card-header flex-between">
        <h2 className="card-title">
          <History className="card-title-icon" /> Prediction History
        </h2>
        {hasHistory && (
          <button
            className="clear-history-btn"
            onClick={onClearHistory}
            type="button"
            aria-label="Clear Prediction History"
          >
            <Trash2 className="btn-icon" /> Clear History
          </button>
        )}
      </div>

      {!hasHistory ? (
        <div className="empty-history">
          <History className="empty-history-icon" />
          <p className="empty-history-text">No predictions yet. Upload an image to get started.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => {
            const formattedCategory = item.category
              ? item.category.split(',')[0].trim()
              : 'Unknown';
            const percentStr = (item.confidence * 100).toFixed(2);

            return (
              <div
                key={item.id}
                className="history-item"
                onClick={() => onSelectHistoryItem && onSelectHistoryItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectHistoryItem && onSelectHistoryItem(item);
                  }
                }}
              >
                <div className="history-thumb-wrapper">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={formattedCategory} className="history-thumb" />
                  ) : (
                    <div className="history-thumb-fallback">
                      <ImageIcon className="fallback-icon" />
                    </div>
                  )}
                </div>

                <div className="history-details">
                  <span className="history-category" title={item.category}>{formattedCategory}</span>
                  <span className="history-timestamp">
                    <Calendar className="time-icon" /> {formatDate(item.timestamp)}
                  </span>
                </div>

                <div className="history-score">
                  <span className="history-percent">{percentStr}%</span>
                  <span className="history-score-label">confidence</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
