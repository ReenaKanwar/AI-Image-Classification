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

import { loadModel, classifyImage, getModelStatus } from './services/classifier';
import { validateImageFile } from './utils/fileValidation';
import { getHistory, savePrediction, clearHistory, createThumbnail } from './utils/storage';

export default function App() {
  // Model state
  const [modelState, setModelState] = useState({
    status: 'idle',
    isReady: false,
    isLoading: true,
    error: null
  });

  // Selected images state
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Classification & UI states
  const [isClassifying, setIsClassifying] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [history, setHistoryState] = useState([]);

  // Initialize MobileNet Model on Mount
  const initModel = useCallback(async () => {
    setModelState({ status: 'loading', isReady: false, isLoading: true, error: null });
    try {
      await loadModel();
      setModelState({ status: 'ready', isReady: true, isLoading: false, error: null });
    } catch (err) {
      const msg = err.message || 'Unable to load the AI model. Please check your internet connection.';
      setModelState({ status: 'error', isReady: false, isLoading: false, error: msg });
      setErrorMessage(msg);
    }
  }, []);

  useEffect(() => {
    initModel();
    setHistoryState(getHistory());
  }, [initModel]);

  // Clean up Object URLs when images state changes or unmounts
  const revokeImageUrls = (items) => {
    items.forEach((item) => {
      if (item && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
  };

  // Handle incoming file selection
  const handleFilesSelected = (files) => {
    setErrorMessage(null);

    if (!files || files.length === 0) {
      setErrorMessage('Please select an image first.');
      return;
    }

    const newItems = [];
    let firstValidationError = null;

    files.forEach((file) => {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        if (!firstValidationError) {
          firstValidationError = validation.error;
        }
      } else {
        newItems.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          file,
          previewUrl: URL.createObjectURL(file)
        });
      }
    });

    if (firstValidationError && newItems.length === 0) {
      setErrorMessage(firstValidationError);
      return;
    }

    if (firstValidationError && newItems.length > 0) {
      setErrorMessage(`Some files were skipped: ${firstValidationError}`);
    }

    if (newItems.length > 0) {
      // Append to existing selected images
      setSelectedImages((prev) => {
        const combined = [...prev, ...newItems];
        return combined;
      });
      // Set active index to newly added first image
      setActiveImageIndex(selectedImages.length);
      // Reset active prediction result when new batch added
      setCurrentResult(null);
    }
  };

  // Remove individual image from batch
  const handleRemoveImage = (idToRemove) => {
    setSelectedImages((prev) => {
      const target = prev.find(item => item.id === idToRemove);
      if (target && target.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const updated = prev.filter(item => item.id !== idToRemove);
      return updated;
    });

    setActiveImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    setCurrentResult(null);
    setErrorMessage(null);
  };

  // Run real MobileNet inference on selected image element
  const handleClassify = async (imgElement, activeItem) => {
    if (!imgElement) {
      setErrorMessage('Unable to read this image. Please try another file.');
      return;
    }

    if (!modelState.isReady) {
      setErrorMessage('AI model is not ready yet. Please wait for model loading.');
      return;
    }

    setIsClassifying(true);
    setErrorMessage(null);

    try {
      // Execute MobileNet inference
      const predictions = await classifyImage(imgElement, 3);

      if (!predictions || predictions.length === 0) {
        throw new Error('No prediction was returned for this image.');
      }

      // Generate lightweight thumbnail for history storage
      const thumbnailBase64 = await createThumbnail(imgElement);

      const topPrediction = predictions[0];
      const category = topPrediction.className;
      const confidence = topPrediction.probability;

      // Save to localStorage history
      const saveRes = savePrediction({
        category,
        confidence,
        topPredictions: predictions,
        thumbnail: thumbnailBase64
      });

      if (saveRes.history) {
        setHistoryState(saveRes.history);
      }

      if (saveRes.error) {
        setErrorMessage(saveRes.error);
      }

      // Set current result state
      setCurrentResult({
        imageItem: activeItem,
        predictions,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Classification execution failed:', err);
      setErrorMessage(err.message || 'Unable to classify this image. Please try again.');
    } finally {
      setIsClassifying(false);
    }
  };

  // Clear prediction history
  const handleClearHistory = () => {
    const ok = clearHistory();
    if (ok) {
      setHistoryState([]);
    } else {
      setErrorMessage('Failed to clear prediction history from storage.');
    }
  };

  // Select historical item to view
  const handleSelectHistoryItem = (item) => {
    if (!item.topPredictions) return;
    setCurrentResult({
      imageItem: { previewUrl: item.thumbnail, file: { name: 'Historical Image' } },
      predictions: item.topPredictions,
      timestamp: item.timestamp
    });
  };

  return (
    <div className="app-shell">
      {/* Header with Model Status */}
      <Header modelState={modelState} onRetryModel={initModel} />

      <main className="main-content-container">
        {/* Error Alert Display */}
        <ErrorMessage
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
          onRetry={modelState.status === 'error' ? initModel : undefined}
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid-layout">
          {/* Left Column: Upload & Image Preview */}
          <div className="column-left">
            <ImageUploader
              onFilesSelected={handleFilesSelected}
              isProcessing={isClassifying}
            />

            <ImagePreview
              images={selectedImages}
              selectedIndex={activeImageIndex}
              onSelectIndex={setActiveImageIndex}
              onRemoveImage={handleRemoveImage}
              onClassify={handleClassify}
              isClassifying={isClassifying}
              isModelReady={modelState.isReady}
            />
          </div>

          {/* Right Column: AI Predictions & History */}
          <div className="column-right">
            {isClassifying && (
              <LoadingState message="Running MobileNet Neural Inference..." />
            )}

            {!isClassifying && currentResult && (
              <>
                <PredictionResult result={currentResult} />
                <TopPredictions predictions={currentResult.predictions} />
              </>
            )}

            {!isClassifying && !currentResult && (
              <EmptyState />
            )}

            <PredictionHistory
              history={history}
              onClearHistory={handleClearHistory}
              onSelectHistoryItem={handleSelectHistoryItem}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Client-Side AI Inference with <strong>TensorFlow.js</strong> &amp; <strong>MobileNet v2</strong>
          </p>
          <p className="footer-sub">
            Zero Server Dependency • Private Browser Processing • Instant Classification
          </p>
        </div>
      </footer>
    </div>
  );
}
