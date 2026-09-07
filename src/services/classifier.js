import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

/**
 * MobileNet AI Image Classification Service
 * Handles model initialization, caching, status tracking, and browser-side inference.
 */

let modelInstance = null;
let modelLoadingPromise = null;
let modelStatus = 'idle'; // 'idle' | 'loading' | 'ready' | 'error'
let lastErrorMessage = null;

/**
 * Returns current AI model status and metadata.
 */
export function getModelStatus() {
  return {
    status: modelStatus,
    isReady: modelStatus === 'ready',
    isLoading: modelStatus === 'loading',
    error: lastErrorMessage
  };
}

/**
 * Loads the MobileNet model into browser memory (only once).
 * Returns the model instance upon success.
 * @returns {Promise<mobilenet.MobileNet>}
 */
export async function loadModel() {
  // If model is already loaded, return cached instance immediately
  if (modelInstance) {
    modelStatus = 'ready';
    return modelInstance;
  }

  // If loading is currently in progress, await the ongoing promise
  if (modelLoadingPromise) {
    return modelLoadingPromise;
  }

  modelStatus = 'loading';
  lastErrorMessage = null;

  modelLoadingPromise = (async () => {
    try {
      // Ensure TF backend is initialized (WebGL / CPU)
      await tf.ready();
      
      // Load MobileNet pre-trained architecture
      // version: 2, alpha: 1.0 offers optimal accuracy vs speed ratio
      const loadedModel = await mobilenet.load({
        version: 2,
        alpha: 1.0
      });

      modelInstance = loadedModel;
      modelStatus = 'ready';
      modelLoadingPromise = null;
      console.log('MobileNet model successfully initialized in browser WebGL context');
      return modelInstance;
    } catch (error) {
      modelInstance = null;
      modelStatus = 'error';
      modelLoadingPromise = null;
      lastErrorMessage = error.message || 'Unable to download MobileNet pre-trained weights.';
      console.error('Failed to load MobileNet model:', error);
      throw error;
    }
  })();

  return modelLoadingPromise;
}

/**
 * Executes real neural network inference on an HTMLImageElement.
 * @param {HTMLImageElement} imageElement 
 * @param {number} topK Number of top predictions to return (default 3)
 * @returns {Promise<Array<{ className: string, probability: number }>>}
 */
export async function classifyImage(imageElement, topK = 3) {
  if (!imageElement) {
    throw new Error('Please select an image first.');
  }

  const model = await loadModel();

  if (!model) {
    throw new Error('Unable to load the AI model.');
  }

  try {
    // Run real inference using MobileNet
    const predictions = await model.classify(imageElement, topK);

    if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
      throw new Error('No prediction was returned for this image.');
    }

    // Sort predictions descending by probability
    const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);

    return sortedPredictions;
  } catch (error) {
    console.error('MobileNet classification error:', error);
    if (error.message && error.message.includes('No prediction')) {
      throw error;
    }
    throw new Error('Unable to classify this image. Please try again.');
  }
}
