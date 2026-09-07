import React from 'react';

function formatDate(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch (err) {
    return '';
  }
}

export default function PredictionHistory({ history, onClearHistory, onSelectHistoryItem }) {
  const hasHistory = Array.isArray(history) && history.length > 0;

  return (
    <div className="card history-card">
      <div className="card-header flex-between">
        <h2 className="card-title">Prediction History</h2>
        {hasHistory && (
          <button className="btn-secondary btn-sm" onClick={onClearHistory} type="button">
            Clear History
          </button>
        )}
      </div>

      {!hasHistory ? (
        <div className="empty-history-state">
          <p>No predictions yet. Upload an image to get started.</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item) => {
            const label = item.label ? item.label.split(',')[0].trim() : 'Unknown';
            const percent = (item.confidence * 100).toFixed(2);

            return (
              <div
                key={item.id}
                className="history-item-row"
                onClick={() => onSelectHistoryItem && onSelectHistoryItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectHistoryItem && onSelectHistoryItem(item)}
              >
                <div className="history-thumb-box">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={label} className="history-thumb-img" />
                  ) : (
                    <div className="history-thumb-empty" />
                  )}
                </div>

                <div className="history-meta flex-1">
                  <span className="history-category-title">{label}</span>
                  <span className="history-date-stamp">{formatDate(item.timestamp)}</span>
                </div>

                <div className="history-score-badge">
                  <span>{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
