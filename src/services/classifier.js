import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;
let loadingPromise = null;

export async function loadModel() {
  if (model) return model;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      await tf.ready();
      model = await mobilenet.load({ version: 2, alpha: 1.0 });
      return model;
    } catch (err) {
      model = null;
      loadingPromise = null;
      throw new Error('Unable to load AI model. Please check your network connection.');
    }
  })();

  return loadingPromise;
}

export async function classifyImage(imgElement) {
  if (!imgElement) {
    throw new Error('Please select an image first.');
  }

  const activeModel = await loadModel();
  const predictions = await activeModel.classify(imgElement, 3);

  if (!predictions || predictions.length === 0) {
    throw new Error('No prediction returned for this image.');
  }

  return predictions;
}
