const STORAGE_KEY = 'image_classifier_history';

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading history:', err);
    return [];
  }
}

export function createThumbnail(imgElement) {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 100;

      let w = imgElement.naturalWidth || imgElement.width || size;
      let h = imgElement.naturalHeight || imgElement.height || size;

      if (w > h) {
        h = Math.round((h * size) / w);
        w = size;
      } else {
        w = Math.round((w * size) / h);
        h = size;
      }

      canvas.width = Math.max(w, 1);
      canvas.height = Math.max(h, 1);

      if (ctx) {
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        resolve('');
      }
    } catch (err) {
      resolve('');
    }
  });
}

export function savePrediction({ label, confidence, topPredictions, thumbnail }) {
  try {
    const history = getHistory();
    const newItem = {
      id: Date.now().toString(),
      label,
      confidence,
      topPredictions,
      thumbnail,
      timestamp: new Date().toISOString()
    };

    const updated = [newItem, ...history].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving prediction history:', err);
    return getHistory();
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Error clearing history:', err);
    return false;
  }
}
