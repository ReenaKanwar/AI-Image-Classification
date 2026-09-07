# Technical Interview Questions & Answers

### 1. Why React?
React provides component-based structure and reactive state management. State updates naturally trigger UI changes as the model loads, images are selected, and predictions are calculated.

### 2. Why TensorFlow.js?
TensorFlow.js enables running deep learning models directly in JavaScript. It utilizes the browser's GPU via WebGL to perform fast neural network inference locally on client devices.

### 3. Why MobileNet?
MobileNet is a compact Convolutional Neural Network (CNN) optimized for mobile and web environments. It uses depthwise separable convolutions to reduce parameter size (~16 MB) while maintaining good accuracy across 1,000 ImageNet categories.

### 4. Why browser inference?
It eliminates server costs, protects user privacy (images stay local), and allows offline predictions once the model is loaded.

### 5. Why no backend?
For this application, browser inference is fast and self-contained. Adding a backend server like Python/FastAPI would introduce extra latency, hosting costs, and infrastructure complexity without added benefit.

### 6. How does image classification work?
The input image pixel array is fed into the Convolutional Neural Network. Feature layers detect edges, shapes, and complex object parts, and the final Softmax activation layer outputs probability scores across candidate classes.

### 7. How is confidence calculated and displayed?
The confidence score comes from the model's Softmax output probabilities (0 to 1). We convert it to a percentage and format it to 2 decimal places (e.g. `94.72%`).

### 8. Why top 3 predictions?
Displaying the top 3 predictions gives context when the model is uncertain or when an image contains features relevant to multiple closely related categories (e.g., different dog breeds).

### 9. How is prediction history stored?
History items are saved in `localStorage` under `image_classifier_history`. We generate small JPEG thumbnails using HTML Canvas so stored data stays well within browser storage limits.

### 10. What happens if the model fails?
If model loading fails, we catch the error, show a clear message, and provide a "Retry" button so the user can re-attempt loading without refreshing the page.

### 11. How are invalid files handled?
In `fileValidation.js`, we verify MIME type and check that file size is ≤ 5 MB. If validation fails, an error message is displayed and classification is blocked.

### 12. How would you improve accuracy?
1. Fine-tune a custom model on domain-specific dataset images.
2. Use larger architectures like MobileNet v3 or EfficientNet.
3. Pre-process and crop input images around primary objects before classification.

### 13. How would you handle 10,000 users?
Because inference happens on the client side, scaling is straightforward. The app assets are static files that can be cached on a CDN (like Vercel or Cloudflare CDN), incurring minimal server overhead regardless of user volume.

### 14. What are the limitations of MobileNet?
- Fixed to 1,000 ImageNet classes.
- Resizes input to 224x224 pixels, which can blur fine details.
- Classifies the entire image rather than locating individual objects with bounding boxes.

### 15. What is the difference between an AI API and a locally loaded model?
- **AI API**: Sends data to a third-party cloud server that processes the request and returns predictions via HTTP. Requires internet and incurs API costs.
- **Locally loaded model**: Downloads model weights once and executes inference on the client machine locally.

### 16. What is an embedding?
An embedding is a numerical vector (array of numbers) representing an image or text in a high-dimensional vector space, capturing semantic meaning and feature similarity.

### 17. What is RAG?
Retrieval-Augmented Generation (RAG) is a technique where external documents are retrieved from a database and injected into an LLM's context to generate factually accurate answers.

### 18. What is prompt engineering?
Prompt engineering is the process of structuring natural language instructions sent to Large Language Models (LLMs) to produce desired outputs.

### 19. What is hallucination?
Hallucination occurs when a generative AI model generates plausible-sounding but factually incorrect or fabricated information.
