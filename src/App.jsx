import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import PredictionResult from './components/PredictionResult';
import TopPredictions from './components/TopPredictions';
import PredictionHistory from './components/PredictionHistory';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';

import { loadModel, classifyImage } from './services/classifier';
import { validateImageFile } from './utils/fileValidation';
import { getHistory, savePrediction, clearHistory, createThumbnail } from './utils/storage';

export default function App() {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [isClassifying, setIsClassifying] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [history, setHistory] = useState([]);

  const initModel = useCallback(async () => {
    setIsModelLoading(true);
    setModelError(null);
    try {
      await loadModel();
      setIsModelReady(true);
    } catch (err) {
      setModelError(err.message || 'Unable to load AI model.');
    } finally {
      setIsModelLoading(false);
    }
  }, []);

  useEffect(() => {
    initModel();
    setHistory(getHistory());
  }, [initModel]);

  const handleFilesSelected = (files) => {
    setErrorMessage(null);
    if (!files || files.length === 0) return;

    const validItems = [];
    let firstError = null;

    files.forEach((file) => {
      const val = validateImageFile(file);
      if (!val.isValid) {
        if (!firstError) firstError = val.error;
      } else {
        validItems.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
          file,
          previewUrl: URL.createObjectURL(file)
        });
      }
    });

    if (firstError && validItems.length === 0) {
      setErrorMessage(firstError);
      return;
    }

    if (firstError && validItems.length > 0) {
      setErrorMessage(`Skipped invalid file(s): ${firstError}`);
    }

    if (validItems.length > 0) {
      setSelectedImages((prev) => [...prev, ...validItems]);
      setSelectedIndex(selectedImages.length);
      setCurrentResult(null);
    }
  };

  const handleRemoveImage = (id) => {
    setSelectedImages((prev) => {
      const target = prev.find(item => item.id === id);
      if (target && target.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(item => item.id !== id);
    });

    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    setCurrentResult(null);
    setErrorMessage(null);
  };

  const handleClassify = async (imgElement, activeItem) => {
    if (!imgElement) return;
    if (!isModelReady) {
      setErrorMessage('AI model is not ready yet.');
      return;
    }

    setIsClassifying(true);
    setErrorMessage(null);

    try {
      const predictions = await classifyImage(imgElement);
      const thumbnail = await createThumbnail(imgElement);

      const top = predictions[0];
      const updatedHistory = savePrediction({
        label: top.className,
        confidence: top.probability,
        topPredictions: predictions,
        thumbnail
      });

      setHistory(updatedHistory);
      setCurrentResult({
        imageItem: activeItem,
        predictions,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setErrorMessage(err.message || 'Unable to classify this image.');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleClearHistory = () => {
    if (clearHistory()) {
      setHistory([]);
    } else {
      setErrorMessage('Failed to clear history from storage.');
    }
  };

  const handleSelectHistoryItem = (item) => {
    if (!item.topPredictions) return;
    setCurrentResult({
      imageItem: { previewUrl: item.thumbnail, file: { name: 'History Item' } },
      predictions: item.topPredictions,
      timestamp: item.timestamp
    });
  };

  return (
    <div className="app-wrapper">
      <Header
        isModelLoading={isModelLoading}
        modelError={modelError}
        onRetry={initModel}
      />

      <main className="main-content">
        <ErrorMessage
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
          onRetry={modelError ? initModel : undefined}
        />

        {/* Classifier Section */}
        <section className="classifier-grid">
          <div className="left-panel">
            <ImageUploader
              onFilesSelected={handleFilesSelected}
              isProcessing={isClassifying}
            />

            <ImagePreview
              images={selectedImages}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
              onRemoveImage={handleRemoveImage}
              onClassify={handleClassify}
              isClassifying={isClassifying}
              isModelReady={isModelReady}
            />
          </div>

          <div className="right-panel">
            {isClassifying && <LoadingState message="Analyzing image..." />}

            {!isClassifying && currentResult && (
              <>
                <PredictionResult result={currentResult} />
                <TopPredictions predictions={currentResult.predictions} />
              </>
            )}

            {!isClassifying && !currentResult && <EmptyState />}
          </div>
        </section>

        {/* Prediction History Section */}
        <section className="history-section">
          <PredictionHistory
            history={history}
            onClearHistory={handleClearHistory}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        </section>
      </main>
    </div>
  );
}
