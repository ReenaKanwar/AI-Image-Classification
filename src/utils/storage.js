/**
 * Storage Utility for Prediction History
 * Uses localStorage to persist predictions safely with thumbnail compression.
 */

const STORAGE_KEY = 'image_classifier_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Retrieves stored prediction history from localStorage.
 * @returns {Array} Array of historical prediction objects
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.warn('Invalid storage format, resetting history');
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Failed to parse prediction history from localStorage:', error);
    return [];
  }
}

/**
 * Creates a lightweight base64 thumbnail string from an image element or URL.
 * @param {HTMLImageElement} imgElement 
 * @returns {Promise<string>} Data URL thumbnail string
 */
export function createThumbnail(imgElement) {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxDim = 120;
      
      let width = imgElement.naturalWidth || imgElement.width || maxDim;
      let height = imgElement.naturalHeight || imgElement.height || maxDim;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

      if (ctx) {
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        resolve('');
      }
    } catch (err) {
      console.warn('Failed to generate canvas thumbnail:', err);
      resolve('');
    }
  });
}

/**
 * Saves a new prediction to history in localStorage.
 * @param {Object} predictionData 
 * @param {string} predictionData.category
 * @param {number} predictionData.confidence
 * @param {Array} predictionData.topPredictions
 * @param {string} [predictionData.thumbnail]
 * @returns {{ success: boolean, history: Array, error?: string }}
 */
export function savePrediction({ category, confidence, topPredictions, thumbnail = '' }) {
  try {
    const existingHistory = getHistory();
    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      category,
      confidence,
      topPredictions,
      thumbnail,
      timestamp: new Date().toISOString()
    };

    // Prepend new item and enforce maximum item cap
    const updatedHistory = [newItem, ...existingHistory].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    
    return { success: true, history: updatedHistory };
  } catch (error) {
    console.error('Failed to save prediction to localStorage:', error);
    return {
      success: false,
      history: getHistory(),
      error: 'Prediction history could not be saved to local browser storage.'
    };
  }
}

/**
 * Clears all prediction history from localStorage.
 * @returns {boolean}
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear prediction history:', error);
    return false;
  }
}
