# AI Image Classification Application - Technical Interview Q&A

This document provides clear, technically precise, and concise answers to common viva and technical interview questions regarding this project.

---

### 1. Why did you select React?
React provides a component-based architecture and declarative state management. In an AI application with asynchronous model loading, file uploading, preview generation, and dynamic progress bars, React's reactive state automatically keeps the UI synchronized with underlying model states without manual DOM manipulation.

### 2. Why TensorFlow.js?
TensorFlow.js enables running pre-trained deep learning models directly in the JavaScript runtime environment (browser or Node.js). It leverages the user's local GPU via WebGL acceleration, enabling high-performance neural network inference without requiring any backend server or Python environment.

### 3. Why MobileNet?
MobileNet (v2) is a lightweight Convolutional Neural Network (CNN) architecture designed specifically for mobile and edge devices. It utilizes depthwise separable convolutions, drastically reducing model parameter size (~16MB) while retaining high classification accuracy across 1,000 ImageNet categories.

### 4. Why did you choose browser-based inference?
Browser-based client-side inference offers three critical advantages:
1. **Zero Server / API Costs**: No cloud GPU or server hosting expenses.
2. **User Privacy**: Images never leave the client's device.
3. **Low Latency & Offline Capability**: Once the model weights are cached, predictions run locally without network roundtrips.

### 5. Why didn't you use Python?
For this specific practical requirement, client-side browser execution was requested. Python would require hosting a backend service (e.g. FastAPI/Flask with PyTorch/TensorFlow), increasing deployment complexity, latency, infrastructure costs, and server memory demands for image uploads.

### 6. Explain your architecture.
The architecture consists of:
- **React Frontend**: Manages UI state, file upload drop zone, previews, and historical cards.
- **Classifier Service (`src/services/classifier.js`)**: A singleton module that loads and caches the MobileNet model once and exposes `classifyImage(imgElement)`.
- **Validation & Storage Utilities**: `fileValidation.js` enforces file format/size rules, while `storage.js` manages persistent history in `localStorage`.
- **TensorFlow.js Runtime**: Executes tensor calculations on the browser GPU via WebGL.

### 7. How does image classification work?
Image classification inputs a digital image (RGB pixel matrix), passes it through layers of a Convolutional Neural Network (CNN) to extract feature maps (edges, textures, shapes, complex objects), and outputs a probability vector across candidate classes using a Softmax activation function.

### 8. How does MobileNet work at a high level?
MobileNet replaces standard 3D convolutions with **Depthwise Separable Convolutions**, split into two steps:
1. *Depthwise Convolution*: Applies a single spatial filter per input channel.
2. *Pointwise Convolution*: Applies a 1x1 convolution to combine channels.
This reduces computation and parameter size by 8 to 9 times compared to standard convolutions with minimal loss in accuracy.

### 9. How are top 3 predictions generated?
MobileNet's final layer outputs a probability array of 1,000 numbers summing to 1.0 (100%). The `model.classify(imgElement, 3)` function sorts these probabilities descendingly and returns the top 3 items containing the `className` label and `probability` value.

### 10. What is a confidence score?
A confidence score is the output probability (ranging from 0.0 to 1.0 or 0% to 100%) assigned by the neural network's final Softmax activation layer to a specific class. It reflects the model's mathematical certainty based on learned features.

### 11. Can a high confidence prediction still be wrong?
Yes. Deep neural networks can be overly confident on out-of-distribution images, adversarial noise, or unlearned categories. A model might assign 95% confidence to an object simply because it shares textures or shapes with an ImageNet class it was trained on.

### 12. What happens when the model gives an incorrect prediction?
When an incorrect prediction occurs:
- If confidence is low (< 50%), our UI flags a warning alert: *"Low confidence prediction. The model may not recognize this image accurately."*
- The top 3 predictions showcase alternative candidate classes.
- In production, such images would be logged for dataset re-training or human review.

### 13. How did you handle invalid files?
In `src/utils/fileValidation.js`, we validate:
1. **MIME type**: Strictly allow `image/jpeg`, `image/png`, `image/webp`.
2. **File Size**: Cap size at 5 MB (`5 * 1024 * 1024` bytes).
If validation fails, processing stops immediately and an actionable error alert is rendered without crashing the app.

### 14. How did you handle model loading errors?
In `src/services/classifier.js`, model loading is wrapped in a try-catch block. If loading fails (e.g. offline network during weight fetch), `modelStatus` shifts to `'error'`, an inline error banner appears with a **"Retry Load"** button allowing the user to re-attempt fetching weights.

### 15. How did you handle prediction errors?
If tensor processing fails (e.g., broken image element or WebGL context loss), the error is caught, the classify button re-enables, and the user receives a message: *"Unable to classify this image. Please try again."*

### 16. Why did you use localStorage?
`localStorage` provides simple, client-side persistent storage that requires no database setup, network connection, or user authentication. It allows classification history to survive page refreshes while preserving user privacy.

### 17. Why didn't you use MongoDB?
MongoDB requires a backend server, database credentials, network requests, and user authentication infrastructure. Since this application operates entirely client-side without user accounts or server infrastructure, `localStorage` was the appropriate choice.

### 18. How did you protect API credentials?
No API keys or credentials were used or exposed. MobileNet is an open-source, pre-trained model downloaded directly from public TensorFlow Hub CDNs.

### 19. Why don't you need an API key?
Because model weights are open-source and downloaded directly into the browser to run inference locally via TensorFlow.js. No commercial cloud AI API (such as OpenAI or Google Cloud Vision) is being queried.

### 20. What are MobileNet's limitations?
1. Limited to 1,000 ImageNet categories.
2. Low resolution input scaling (224x224 pixels), which can drop fine detail in complex scenes.
3. Cannot perform multi-object detection (bounding boxes) or segmentation out of the box.

### 21. How would you improve this project?
1. Support object detection models (e.g. YOLOv8 / COCO-SSD) to draw bounding boxes around multiple objects.
2. Support custom fine-tuned model loading via uploadable TF.js model files (`model.json`).
3. Add batch image processing export (CSV/JSON download).

### 22. How would you scale it to 10,000 users?
Because inference is 100% client-side, the app scales effortlessly to 10,000+ users! Static assets (HTML, JS, CSS, model weights) can be served through a global CDN (Vercel / Cloudflare). Server load remains near zero regardless of user volume.

### 23. When would you move inference to a backend?
Inference should move to a backend if:
1. The model is too large for browsers (>100MB, e.g., LLaMA, ResNet-152).
2. Model weights are proprietary intellectual property that must not be downloaded by clients.
3. High-resolution raw images or batch server processing is required.

### 24. What is client-side inference?
Client-side inference means running the machine learning model directly on the end user's device (laptop, phone) using their CPU/GPU via JavaScript/WASM/WebGL.

### 25. What is server-side inference?
Server-side inference means sending input data (images, text) via HTTP/gRPC API to a cloud server or microservice where powerful GPUs (e.g. NVIDIA A100) run the model and return results.

### 26. What is an AI API?
An AI API is a cloud service (e.g. OpenAI GPT-4 Vision, Google Cloud Vision) that exposes trained machine learning models via REST endpoints, charging per request or token.

### 27. What is a locally hosted model?
A locally hosted model is a model running on local infrastructure or on client hardware without relying on third-party cloud SaaS providers.

### 28. What is an embedding?
An embedding is a dense numerical vector representation (e.g. 512 numbers) of an image or text chunk in a continuous vector space, capturing semantic features and relationships.

### 29. What is RAG?
Retrieval-Augmented Generation (RAG) is an AI architecture that enhances LLM responses by retrieving relevant factual documents from an external vector database before generating an answer.

### 30. What is prompt engineering?
Prompt engineering is the practice of crafting, structuring, and refining natural language prompts to guide Large Language Models (LLMs) to produce accurate, context-aware outputs.

### 31. What is AI hallucination?
AI hallucination occurs when a generative AI model (such as an LLM) generates confident but factually incorrect, fabricated, or nonsensical information not grounded in its training data or input context.

### 32. Is hallucination relevant to image classification?
No. Discriminative models like MobileNet do not generate text or hallucinate content. They perform deterministic multi-class classification by outputting mathematical probabilities across a fixed set of predefined classes.
